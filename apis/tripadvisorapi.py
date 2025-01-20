import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

TA_API_KEY = os.getenv("TA_API_KEY")

class TripAdvisorApiWrapper():
    def __init__(self):
        self.api_key = TA_API_KEY

    def send_request(self, url: str):
        headers = {"accept": "application/json",
                "Referer": "https://rocnikovy-projekt.onrender.com"}
        response = requests.get(url, headers=headers)
        return json.loads(response.text)
    
    def find_search(self, search_query: str, lat_long: str, radius: int):
        '''
            Parameters: 
                search_query - location name; 
                lat_long - approx. latitude, longitude;
                radius - radius for search with center in lat_long
            Used for:
                retrieving location id and address
        '''
        url = f'https://api.content.tripadvisor.com/api/v1/location/search?language=en&key={self.api_key}'
        url += f"&searchQuery={search_query}"
        url += f"&latLong={lat_long}"
        url += f"&radius={radius}"
        url += f"&radiusUnit=m"
        return self.send_request(url)

    def location_photos(self,location_id: str):
        '''
            Parameters: 
                location_id - id from TripAdvisor retrieved using fin_search; 
            Used for:
                retrieving photos
        '''
        url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/photos?language=en&key={self.api_key}"
        return self.send_request(url)

    def location_details(self,location_id: str):
        '''
            Parameters: 
                location_id - id from TripAdvisor retrieved using fin_search; 
            Used for:
                retrieving latitude, longitude
        '''
        url = location_details_url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/details?language=en&currency=USD&key={self.api_key}"
        return self.send_request(url)

