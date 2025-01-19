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
    print(openai_json)

    for attraction in openai_json["AttractionRecommendations"]:
        attraction["Address"] = {}
        attraction["Address"]["Latitude"] = ""
        attraction["Address"]["AddressStr"] = ""
        attraction["Address"]["Longitude"] = ""
        attraction["Photos"] = []

    for attraction in openai_json["AttractionRecommendations"]:
        location_search_result = tripadvisor_wrapper.find_search(attraction["Name"],attraction["Location"],attraction["Radius"])
        print(location_search_result)
        
        if "data" in location_search_result and len(location_search_result["data"]) > 0:
            location_id = location_search_result["data"][0]["location_id"]
            location_address = location_search_result["data"][0]["address_obj"]["address_string"]
            location_long = location_search_result["data"][0]["longitude"]
            location_lat = location_search_result["data"][0]["latitude"]

            attraction["Address"]["AddressStr"] = location_address
            attraction["Address"]["Latitude"] = location_lat
            attraction["Address"]["Longitude"] = location_long
            
            photos_search_result = tripadvisor_wrapper.location_photos(location_id)
            if "data" in photos_search_result:
                for photo in photos_search_result["data"]:
                    attraction["Photos"].append(photo["images"]["large"]["url"])
        print(attraction)

    print(openai_json)
    return openai_json

@app.route('/find_route',methods=['GET'])
def get_parameters():
    args = request.args.to_dict()
    
    if 'interests' in args:
        args['interests'] = args['interests'].split(',')
    if 'age' in args:
        args['age'] = args['age'].split(',')
    
    query = jsonify(args)
    print(query)

    return find_route(query)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    