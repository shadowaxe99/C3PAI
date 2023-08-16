from geopy.geocoders import Nominatim


class LocationTracker:

    def __init__(self):
        self.geolocator = Nominatim(user_agent='myGeocoder')

    def track_location(self, address):
        print('Tracking location...')
        # TODO: Implement location tracking logic

    def retrieve_location(self, latitude, longitude):
        print('Retrieving location...')
        # TODO: Implement location retrieval logic