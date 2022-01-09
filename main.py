from sensor import tempSensorDS
import time
import utime
import network
import machine
import ntptime
import json
from umqttsimple import MQTTClient

def timeFormat(time):
    return "{}-{:0>2}-{:0>2}T{:0>2}:{:0>2}:{:0>2}.{:0>6}".format(time[0],time[1],time[2],(time[4])%24,time[5],time[6],time[7]*1000)

def dataFormat(temperature):    
    currentTime = timeFormat(rtc.datetime())
    return json.dumps({'team_name': 'green', 'created_on': currentTime, 'temperature': temperature})


sensor = tempSensorDS(pin_nb=4)
sta_if = network.WLAN(network.STA_IF)
sta_if.active(True)
sta_if.connect('mize','TomPetMich33011')

while not sta_if.isconnected():
    pass

rtc = machine.RTC()

ntptime.settime()
client = MQTTClient("green1","147.228.124.230",user="student_2021",password="pivotecepomqtt")
client.connect()

on = True
led = machine.Pin(2, machine.Pin.OUT)

try:
    while True:
        temps = list()
        lastmin = rtc.datetime()[5]
        while rtc.datetime()[5] == lastmin:
            if (on):
                on = False
                led.on()
            else:
                on = True
                led.off()
            temps.append(sensor.measure_temp(delay = 0))
            time.sleep(1)
        time.sleep(1)
        temperature = sum(temps)/len(temps)
        data = dataFormat(temperature)
        try:
            ntptime.settime()
        except:
            pass
        client.publish("ite/green",data,retain = True,qos=1)
        print(data)
except:
    machine.reset()