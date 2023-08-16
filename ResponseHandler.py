class ResponseHandler:
    def __init__(self, response):
        self.response = response

    def parseJSON(self):
        return self.response.body

    def parseXML(self):
        # XML parsing logic goes here
        pass

    def parseData(self):
        if 'application/json' in self.response.headers['Content-Type']:
            return self.parseJSON()
        elif 'application/xml' in self.response.headers['Content-Type']:
            return self.parseXML()
        else:
            return self.response.text
