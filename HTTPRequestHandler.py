import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

class HTTPRequestHandler:
    def __init__(self):
        self.session = requests.Session()
        retry = Retry(total=5, backoff_factor=0.1, status_forcelist=[ 500, 502, 503, 504 ])
        adapter = HTTPAdapter(max_retries=retry)
        self.session.mount('http://', adapter)
        self.session.mount('https://', adapter)

    def get(self, url, params={}):
        return self.session.get(url, params=params)

    def post(self, url, data={}):
        return self.session.post(url, data=data)

    def put(self, url, data={}):
        return self.session.put(url, data=data)

    def delete(self, url):
        return self.session.delete(url)

    def redirect(self, n):
        self.session.max_redirects = n

    def timeout(self, n):
        self.session.timeout = n