from flask import Flask, request, jsonify
from flask_cors import CORS
from apis.tripadvisorapi import TripAdvisorApiWrapper
from apis.openaiapi import OpenAIApiWrapper

openai_wrapper = OpenAIApiWrapper()
tripadvisor_wrapper = TripAdvisorApiWrapper()
app = Flask(__name__)
CORS(app)

def find_route(query):
    openai_json = openai_wrapper.send_request(query)
    if openai_json == None:
        return None

    for attraction in openai_json["AttractionRecommendations"]:
        attraction["Address"] = {}
        attraction["Address"]["Latitude"] = ""
        attraction["Address"]["AddressStr"] = ""
        attraction["Address"]["Longitude"] = ""
        attraction["Photos"] = []
        attraction["Link"] = ""

    for attraction in openai_json["AttractionRecommendations"]:
        location_search_result = tripadvisor_wrapper.find_search(attraction["Name"],attraction["Location"],attraction["Radius"])
        
        if "data" in location_search_result and len(location_search_result["data"]) > 0:
            location_id = location_search_result["data"][0]["location_id"]
            location_address = location_search_result["data"][0]["address_obj"]["address_string"]
            attraction["Address"]["AddressStr"] = location_address

            photos_search_result = tripadvisor_wrapper.location_photos(location_id)
            if "data" in photos_search_result:
                for photo in photos_search_result["data"]:
                    attraction["Photos"].append(photo["images"]["original"]["url"])
            
            location_details_result = tripadvisor_wrapper.location_details(location_id)
            
            if "longitude" in location_details_result:
                location_long = location_details_result["longitude"]
                attraction["Address"]["Longitude"] = location_long
            
            if "latitude" in location_details_result:
                location_lat = location_details_result["latitude"]
                attraction["Address"]["Latitude"] = location_lat

            if "web_url" in location_details_result:
                web_url = location_details_result["web_url"]
                attraction["Link"] = web_url

            if "website" in location_details_result:
                web_url = location_details_result["website"]
                attraction["Link"] = web_url

    return openai_json

@app.route('/find_route',methods=['GET'])
def get_parameters():
    args = request.args.to_dict()

    return find_route(str(args))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    
