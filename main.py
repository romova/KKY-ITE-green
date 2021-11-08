from sensor import tempSensorDS
import time
import network
import machine
import ntptime
import json
from umqttsimple import MQTTClient

def timeFormat(time):
    return "{}-{}-{}T{}:{}:{}.{:0>6}".format(time[0],time[1],time[2],time[4]+1,time[5],time[6],time[7]*1000)


sensor = tempSensorDS(pin_nb=4)
sta_if = network.WLAN(network.STA_IF)
sta_if.active(True)
sta_if.connect('mize', '')

while not sta_if.isconnected():
    pass

rtc = machine.RTC()
ntptime.settime()
client = MQTTClient("green1","147.228.124.230",user="student_2021",password="pivotecepomqtt")
client.connect()


led = machine.Pin(2, machine.Pin.OUT)
on = True

for i in range(50):
    temperature = sensor.measure_temp(delay = 0)
    currentTime = timeFormat(rtc.datetime())
    data = json.dumps({'team_name': 'green', 'created_on': currentTime, 'temperature': temperature})
    client.publish("ite/green",data,qos=1)
    print(data)
    time.sleep(1)
    if (on):
        on = False
        led.on()
    else:
        on = True
        led.off()
    
