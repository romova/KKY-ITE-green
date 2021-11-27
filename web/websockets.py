from tornado.web import StaticFileHandler, RequestHandler, Application as TornadoApplication
from tornado.websocket import WebSocketHandler
from tornado.ioloop import IOLoop
from os.path import dirname, join as join_path
from json import dumps as dumps_json, loads as loads_json
from threading import Thread
from time import sleep
from random import random
import paho.mqtt.client
import datetime

class MainHandler(RequestHandler):
    def get(self):
        self.render("static/index.html")


class WSHandler(WebSocketHandler):

    def initialize(self):
        self.application.ws_clients.append(self)
        print('Webserver: New WS Client. Connected clients:', len(self.application.ws_clients))

    def open(self):
        print('Webserver: Websocket opened.')
        #self.write_message('Server ready.')

    def on_message(self, msg):
        try:
            msg = loads_json(msg)
            print('Webserver: Received json WS message:', msg)
        except (ValueError):
            print('Webserver: Received WS message:', msg)

    def on_close(self):
        self.application.ws_clients.remove(self)
        print('Webserver: Websocket client closed. Connected clients:', len(self.application.ws_clients))
import json
class WebWSApp(TornadoApplication):
    def __init__(self):
        def on_message(client, userdata, msg):
            
            try:
                data = json.loads(msg.payload)
                #print("message recieved:",data)
                team = data["team_name"]
                time = data["created_on"]
                temp = round(data["temperature"],2)

                print("message recieved:", {"team":team,"temp":temp,"time":time})

                temperatures[team].append(temp)
                timestamps[team].append(time)

                #print({"team":team,"temp":temperatures[team]})
                #print({"team":team,"time":timestamps[team]})

                #lastmessage[team] = datetime.datetime.fromisoformat(time)
                #print({"team":team,"time":lastmessage[team]})

                #self.send_ws_message(json.dumps({"team":team,"temp":temperatures[team],"time":timestamps[team]}))
                self.send_ws_message({"team":team,"temp":temperatures[team],"time":timestamps[team]})
                #print()
            except:
                pass


        def mqtt():
            print("mqtt started")
            client = paho.mqtt.client.Client("")
            client.on_message = on_message
            client.username_pw_set("student_2021","pivotecepomqtt")
            client.connect("147.228.124.230",1883,60)
            client.subscribe("ite/#")
            client.loop_start()
            
        self.ws_clients = []
        
        self.tornado_handlers = [
            (r'/', MainHandler),
            (r'/websocket', WSHandler),
            (r'/(.*)', StaticFileHandler, {'path': join_path(dirname(__file__), 'static')})
        ]
        self.tornado_settings = {
            "debug": True,
            "autoreload": True
        }
        t = Thread(target=mqtt)
        t.setDaemon(True)
        t.start() 

        TornadoApplication.__init__(self, self.tornado_handlers, **self.tornado_settings)

    def send_ws_message(self, message):
        for client in self.ws_clients:
            iol.spawn_callback(client.write_message, dumps_json(message))
    
    

if __name__ == '__main__':
    temperatures = {"green":[],"black":[],"blue":[],"pink":[],"red":[]}
    timestamps = {"green":[],"black":[],"blue":[],"pink":[],"red":[]}
    lastmessage = {"green":datetime.datetime.now(),"black":datetime.datetime.now(),"blue":datetime.datetime.now(),"pink":datetime.datetime.now(),"red":datetime.datetime.now()}
    
    PORT = 4444
    app = WebWSApp()
    app.listen(PORT)
    iol = IOLoop.current()
    iol.start()
    print('Webserver: Initialized. Listening on', PORT)

    
    current().start()