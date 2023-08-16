class PluginHandler:
    def __init__(self):
        self.plugins = []

    def add_plugin(self, plugin):
        self.plugins.append(plugin)

    def apply_plugins(self, request):
        for plugin in self.plugins:
            request = plugin(request)
        return request
