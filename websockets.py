from tornado.web import StaticFileHandler, RequestHandler, Application as TornadoApplication
from tornado.websocket import WebSocketHandler
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from os.path import dirname, join as join_path
from json import dumps as dumps_json, loads as loads_json
import json
import tornado
from threading import Thread
from time import sleep
from random import random
import paho.mqtt.client
import datetime
import requests
from recognize_handler import RecognizeImageHandler
import re

class Pripoj():
    def __init__(self, online, lastonline):
        self.online = online
        self.lastonline = lastonline

class BaseHandler(RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

class LoginHandler(BaseHandler):
    def get(self):
        self.render("static/main.html")

    def post(self):
        print("pokus")
        #print("name = ",self.get_argument("name"))
        #print("Res = ",self.get_argument("Res"))


        self.set_secure_cookie("user", self.get_argument("Res"))       
        self.redirect("/")


class MainHandler(BaseHandler):
    
    def get(self):
        if not self.current_user:
            self.redirect("/login")
            return
        
        name = tornado.escape.xhtml_escape(self.current_user)
        print("res = ", name)
        n = name.split(',')

        if len(n)>1:
            self.redirect("/login")
            name = None
            return

        identita = n[0].split(' ')
        jmeno = identita[0]
        prob = identita[1]
        prob = re.sub(r"[^0-9]","",prob)

        print("jmeno = ", jmeno)
        print("prob = ", prob)
        

        users = ["dan","honzas","lubos","martin","milos","romova_jana","simek_honza","zelezny_petr"]
        with_acess = False

        
        if jmeno in users:
            with_acess = True

        if(int(prob)<81):
            with_acess = False

        if with_acess == False:
            self.redirect("/login")
            name = None
            return

        self.render("static/index.html")

class ReceiveImageHandler(BaseHandler):
    def post(self):
        # Convert from binary data to string
        received_data = self.request.body.decode()

        assert received_data.startswith("data:image/png"), "Only data:image/png URL supported"

        # Parse data:// URL
        with urlopen(received_data) as response:
            image_data = response.read()

        app_log.info("Received image: %d bytes", len(image_data))

        # Write an image to the file
        with open(f"images/img-{dt.datetime.now().strftime('%Y%m%d-%H%M%S')}.png", "wb") as fw:
            fw.write(image_data)


class WSHandler(WebSocketHandler):

    def initialize(self):
        self.application.ws_clients.append(self)
        print('Webserver: New WS Client. Connected clients:', len(self.application.ws_clients))

    def open(self):
        print('Webserver: Websocket opened.')
        #self.write_message('Server ready.')
        online.online = online.online + 1
        
    def on_message(self, msg):
        print('Webserver: Received WS message:', msg)
        
    def on_close(self):
        self.application.ws_clients.remove(self)
        print('Webserver: Websocket client closed. Connected clients:', len(self.application.ws_clients))
           

class WebWSApp(TornadoApplication):
    def __init__(self):

        def on_message(client, userdata, msg):      
            try:
                data = json.loads(msg.payload)
                team = data["team_name"]
                time = data["created_on"]
                temp = round(data["temperature"],2)
                print("message recieved:", {"team":team,"temp":temp,"time":time})

                temperatures[team].append(temp)
                timestamps[team].append(time)
                lastmessage[team] = datetime.datetime.today()
                
                self.send_ws_message({"team":team,"temp":temperatures[team][-2880:],"time":timestamps[team][-2880:]})

                if(team == "green"):
                    t = datetime.datetime.strptime(time,"%Y-%m-%dT%H:%M:%S.%f")
                    t = t.isoformat()
                    t = t.split('T')
                    t[0] = t[0].split('-')
                    t[1] = t[1].split(':')
                    t[1][2] = t[1][2].split('.')
                    desetina = str(t[1][2][1][0]) + str(t[1][2][1][1]) + str(t[1][2][1][2])
                    result = str(t[0][0]) + "-" + str(t[0][1]) + "-" + str(t[0][2]) +  "T" + str(int(t[1][0]) - 1) + ":" + str(t[1][1]) + ":" + str(t[1][2][0]) + "." + desetina + "+01:00"
                    
                    url = "https://uvb1bb4153.execute-api.eu-central-1.amazonaws.com/Prod/measurements"
                    headers = {"Content-Type": "application/json;","teamUUID":"86ceae26-dc83-4063-9750-f61243c347ad"}
                    data = {
                        "createdOn": result,
                        "sensorUUID": "650eb222-3078-40e7-9b38-d3291099d8ca",
                        "temperature": temp,
                        "status": "TEST"
                    }
                    response = requests.post(url,headers = headers,json=data)
                    print("measurements", response)

                    if(float(temp) >= 25 or float(temp) <= 0):
                        url = "https://uvb1bb4153.execute-api.eu-central-1.amazonaws.com/Prod/alerts"
                        data = {
                            "createdOn": result,
                            "sensorUUID": "650eb222-3078-40e7-9b38-d3291099d8ca",
                            "temperature": temp,
                            "lowTemperature": 0,
		                    "highTemperature": 25
                        }
                        response = requests.post(url,headers = headers,json=data)
                        print("alerts", response)

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

            online.lastonline = 0
            while True:
                for i in range(5*60):
                    sleep(1)
                    if not online.online == online.lastonline:
                        online.lastonline = online.online
                        self.send_to_last({"team":'green',"temp":temperatures['green'][-2880:],"time":timestamps['green'][-2880:]})
                        self.send_to_last({"team":'pink',"temp":temperatures['pink'][-2880:],"time":timestamps['pink'][-2880:]})
                        self.send_to_last({"team":'black',"temp":temperatures['black'][-2880:],"time":timestamps['black'][-2880:]})           
                        self.send_to_last({"team":'blue',"temp":temperatures['blue'][-2880:],"time":timestamps['blue'][-2880:]})
                        self.send_to_last({"team":'red',"temp":temperatures['red'][-2880:],"time":timestamps['red'][-2880:]})
                        

                with open("data.txt",'w', encoding = "utf-8") as f:
                    for i in temperatures:
                        for j in range(len(temperatures[i])):
                            f.write(i + " " + str(temperatures[i][j]) + " " + timestamps[i][j] + "\n")
                print("Ulozeno")

            
        self.ws_clients = []
        
        self.tornado_handlers = [
            (r'/', MainHandler),
            (r"/receive_image", ReceiveImageHandler),
            (r"/recognize", RecognizeImageHandler),
            (r"/login", LoginHandler),
            (r'/websocket', WSHandler),
            (r'/(.*)', StaticFileHandler, {'path': join_path(dirname(__file__), 'static')})
        ]

        self.tornado_settings = {
            "debug": True,
            "autoreload": True,
            "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            "login_url": "/login"
        }

        t = Thread(target=mqtt)
        t.setDaemon(True)
        t.start() 

        TornadoApplication.__init__(self, self.tornado_handlers, **self.tornado_settings)

    def send_ws_message(self, message):
        for client in self.ws_clients:
            iol.spawn_callback(client.write_message, dumps_json(message))
        print("sent.", self.ws_clients)

    def send_to_last(self,message):
	    iol.spawn_callback(self.ws_clients[-1].write_message, dumps_json(message))
    

if __name__ == '__main__':
    temperatures = {"green":[],"black":[],"blue":[],"pink":[],"red":[]}
    timestamps = {"green":[],"black":[],"blue":[],"pink":[],"red":[]}
    lastmessage = {"green":datetime.datetime.now(),"black":datetime.datetime.now(),"blue":datetime.datetime.now(),"pink":datetime.datetime.now(),"red":datetime.datetime.now()}
    online = Pripoj(0,0)

    with open("data.txt",'r', encoding = "utf-8") as f:
        for l in f:
            l = l.strip()
            l = l.split(' ')
            team = l[0]
            temperatures[l[0]].append(l[1])
            timestamps[l[0]].append(l[2])
    
    PORT = 443
    app = WebWSApp()

    http_server = HTTPServer(app, ssl_options={
        "certfile": "cert.pem",
        "keyfile": "key.pem",
        "ca_certs": "fullchain.pem",
    })
    http_server.listen(PORT)

    iol = IOLoop.current()
    iol.start()
    print('Webserver: Initialized. Listening on', PORT)

    
    current().start()