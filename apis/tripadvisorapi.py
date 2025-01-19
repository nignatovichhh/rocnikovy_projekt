import requests
import json
import os

TA_API_KEY = os.getenv("TA_API_KEY")

class TripAdvisorApiWrapper():
    def __init__(self):
        self.api_key = TA_API_KEY

    def send_request(self, url: str):
        headers = {"accept": "application/json"}
        response = requests.get(url, headers=headers)
        return json.loads(response.text)
    
    def find_search(self, search_query: str, lat_long: str, radius: int):
        url = f'https://api.content.tripadvisor.com/api/v1/location/search?language=en&key={self.api_key}'
        url += f"&searchQuery={search_query}"
        url += f"&latLong={lat_long}"
        url += f"&radius={radius}"
        url += f"&radiusUnit=m"
        print(url)
        return self.send_request(url)

    def location_photos(self,location_id: str):
        url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/photos?language=en&key={self.api_key}"
        return self.send_request(url)

