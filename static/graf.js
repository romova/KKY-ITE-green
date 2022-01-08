    function parseISOTime(isotime, team) {

    var dateAndTime = isotime.split("T");
    var date = dateAndTime[0].split("-");
    var time = dateAndTime[1].split(":");
    var hours = time[0];
    var minutes = time[1];
    var seconds = time[2].substring(".")[0];
   /* if (parseInt(hours)<10) {
        hours = "0"+hours;
        }
    if (parseInt(hours)<10) {
        hours = "0"+hours;
        }  */
    
    if (/*team == "green" ||*/ team == "blue" || team == "pink") {
    
        if (parseInt(minutes)<10) {
            minutes = "0"+minutes;
            }
    }
    if (parseInt(seconds)<10) {
        seconds = "0"+seconds;
        }
        
    var timeZone = " UTC";
   /* if (team == "green") {
        timeZone = " GMT+1"
        }
    else {
        timeZone = " UTC"
        }  */
          
    
    return date[2] + ". "+ date [1] + ". "+ date[0] + ", " +hours +":" + minutes + ":" + seconds + timeZone;
}
    
    //ws = new WebSocket('wss://147.228.173.95:443/websocket');
    ws = new WebSocket('wss://sulis95.zcu.cz:443/websocket');
    ws.onmessage = onSocketMessage;
    ws.onclose = onSocketClose;
    ws.onopen = onSocketOpen;
    //ws.send("Chci data!!")

    function onSocketClose() {
        console.log("closed.")
    }

    function onSocketOpen() {
        console.log("WS client: Websocket opened.")
    }

    const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    ];     
    
    var green_data = {
    labels: [null],
    datasets: [{
    label: 'Teplota green [°C]',
    backgroundColor: 'rgb(0,255,0)',
    borderColor: 'rgb(0,150,0)',
    data: [null],
    }]
    };
    
    var black_data = {
    labels: labels,
    datasets: [{
    label: 'Teplota black [°C]',
    backgroundColor: 'rgb(100, 100, 100)',
    borderColor: 'rgb(0, 0, 0)',
    data: [null],
    }]
    };
    
    var red_data = {
    labels: labels,
    datasets: [{
    label: 'Teplota red [°C]',
    backgroundColor: 'rgb(200, 0, 0)',
    borderColor: 'rgb(255, 0, 0)',
    data: [null],
    }]
    };
    
    var blue_data = {
    labels: labels,
    datasets: [{
    label: 'Teplota blue [°C]',
    backgroundColor: 'rgb(0, 0, 200)',
    borderColor: 'rgb(0, 0, 255)',
    data: [null],
    }]
    };
    
    var pink_data = {
    labels: labels,
    datasets: [{
    label: 'Teplota pink [°C]',
    backgroundColor: 'rgb(255,105,180)',
    borderColor: 'rgb(255,20,147)',
    data: [null],
    }]
    };


    
    var green = {
        type: 'line',
        data: green_data,
        options: {
            scales: {
                x: {
                    ticks: {
                        display: false
                   },
                    grid:{
                        display: false
                    }
                }
            }
        }
    };
        
    var black = {
        type: 'line',
        data: black_data,
        options: {
            scales: {
                x: {
                    ticks: {
                        display: false
                   },
                    grid:{
                        display: false
                    }
                }
            }
        }
    };
        
    var red = {
        type: 'line',
        data: red_data,
        options: {
            scales: {
                x: {
                   ticks: {
                       display: false
                  },
                  grid:{
                      display: false
                  }
               }
            }
        }
    };
        
    var blue = {
        type: 'line',
        data: blue_data,
        options: {
            scales: {
                x: {
                   ticks: {
                       display: false
                  },
                  grid:{
                      display: false
                  }
               }
            }
        }
        };
        
    var pink = {
        type: 'line',
        data: pink_data,
        options: {
            scales: {
                x: {
                   ticks: {
                       display: false
                  },
                  grid:{
                      display: false
                  }
               }
            }
        }
        };
    
    if (document.getElementById('green') != null) {
    var greenChart = new Chart(
        document.getElementById('green'),
        green
        );
    }
    
    if (document.getElementById('red') != null) {
    var redChart = new Chart(
        document.getElementById('red'),
        red
        );
    }
    
    if (document.getElementById('black') != null) {
    var blackChart = new Chart(
        document.getElementById('black'),
        black
        );
    }
    
    if (document.getElementById('blue') != null) {
    var blueChart = new Chart(
        document.getElementById('blue'),
        blue
        );
    }
    
    if (document.getElementById('pink') != null) {
    var pinkChart = new Chart(
        document.getElementById('pink'),
        pink
        );
    }

    var greenStatus;
    var greenLastTemp;
    var greenLastTempTime;
    var greenAvgTemp;
    var greenAlerts;
    
    var redStatus;
    var redLastTemp;
    var redLastTempTime;
    var redAvgTemp;
    var redAlerts;
    
    var blackStatus;
    var blackLastTemp;
    var blackLastTempTime;
    var blackAvgTemp;
    var blackAlerts;
    
    var blueStatus;
    var blueLastTemp;
    var blueLastTempTime;
    var blueAvgTemp;
    var blueAlerts;
    
    var pinkStatus;
    var pinkLastTemp;
    var pinkLastTempTime;
    var pinkAvgTemp;
    var pinkAlerts;

    function onSocketMessage(message) {
    //console.log(message.data);
    //console.log(message);
    var data = JSON.parse((message.data));
    console.log(data);
    
    time = data.time;
    temp = data.temp;
    team = data.team;
    //console.log(team);
    //console.log(time);
    //console.log(temp);

    if(team=="green") {
    
    for (var i = 0; i < time.length; i++) {
        parsedTime = parseISOTime(time[i], team);
        time[i] = parsedTime;        
    }
    
    green_data.labels = time;
    green_data.datasets[0].data = temp;
    //console.log("zelena");
    
    greenLastTemp = temp[temp.length-1];
    greenLastTempTime = time[time.length-1];
    
    greenAlerts = 0;
    var total = 0;
    for(var i = 0; i < temp.length; i++) {
        var teplota = parseFloat(temp[i])
        total += teplota;
        if (teplota<=0 || teplota>=25) {
            greenAlerts += 1;
            }
        }
    greenAvgTemp = total / temp.length;
    }

    if(team=="red") {
    
    for (var i = 0; i < time.length; i++) {
        parsedTime = parseISOTime(time[i]);
        time[i] = parsedTime;        
    }
    
    red_data.labels = time;
    red_data.datasets[0].data = temp;
    //console.log("cervena");
    
    redLastTemp = temp[temp.length-1];
    redLastTempTime = time[time.length-1];
    
    redAlerts = 0;
    var total = 0;
    for(var i = 0; i < temp.length; i++) {
        var teplota = parseFloat(temp[i])
        total += teplota;
        if (teplota<=0 || teplota>=25) {
            redAlerts += 1;
            }
        }
    redAvgTemp = total / temp.length;
    }

    if(team=="black") {
    
    for (var i = 0; i < time.length; i++) {
        parsedTime = parseISOTime(time[i]);
        time[i] = parsedTime;        
    }
    
    black_data.labels = time;
    black_data.datasets[0].data = temp;
    //console.log("cerna");
    
    blackLastTemp = temp[temp.length-1];
    blackLastTempTime = time[time.length-1];
    
    blackAlerts = 0;
    var total = 0;
    for(var i = 0; i < temp.length; i++) {
        var teplota = parseFloat(temp[i])
        total += teplota;
        if (teplota<=0 || teplota>=25) {
            blackAlerts += 1;
            }
        }
    blackAvgTemp = total / temp.length;
    }
    
    if(team=="blue"){
    
    for (var i = 0; i < time.length; i++) {
        parsedTime = parseISOTime(time[i], team);
        time[i] = parsedTime;        
    }
    
    blue_data.labels = time;
    blue_data.datasets[0].data = temp;
    //console.log("modra");
    
    blueLastTemp = temp[temp.length-1];
    blueLastTempTime = time[time.length-1];
    
    blueAlerts = 0;
    var total = 0;
    for(var i = 0; i < temp.length; i++) {
        var teplota = parseFloat(temp[i])
        total += teplota;
        if (teplota<=0 || teplota>=25) {
            blueAlerts += 1;
            }
        }
    blueAvgTemp = total / temp.length;
    }
    

    if(team=="pink") {
    
    for (var i = 0; i < time.length; i++) {
        parsedTime = parseISOTime(time[i]);
        time[i] = parsedTime;        
    }
    
    pink_data.labels = time;
    pink_data.datasets[0].data = temp;
    //console.log("ruzova");
    
    pinkLastTemp = temp[temp.length-1];
    pinkLastTempTime = time[time.length-1];
    
    pinkAlerts = 0;
    var total = 0;
    for(var i = 0; i < temp.length; i++) {
        var teplota = parseFloat(temp[i], team)
        total += teplota;
        if (teplota<=0 || teplota>=25) {
            pinkAlerts += 1;
            }
        }
    pinkAvgTemp = total / temp.length;
    }

    if (document.getElementById('green') != null) {
    greenChart.update();
    }

    if (document.getElementById('red') != null) {
    redChart.update();
    }

    if (document.getElementById('black') != null) {
    blackChart.update();
    }

    if (document.getElementById('blue') != null) {
    blueChart.update();
    }

    if (document.getElementById('pink') != null) {
    pinkChart.update();
    }
    
    if (document.getElementById('greenStats') != null) {
    document.getElementById('greenAvgTemp').innerHTML = Math.round(greenAvgTemp * 100) / 100;
    document.getElementById('greenLastTemp').innerHTML = greenLastTemp;
    if (greenLastTemp <=0 || greenLastTemp >= 25) {
        document.getElementById('greenLastTemp').style="color:red";
        }
    else {
        document.getElementById('greenLastTemp').style="color:rgb(41, 43, 44)";
        }
      
    document.getElementById('greenLastTempTime').innerHTML = greenLastTempTime;
    
    document.getElementById('greenAlerts').innerHTML = greenAlerts;
    if (greenAlerts > 0) {
        document.getElementById('greenAlerts').style="color:red";
        }
    else {
        document.getElementById('greenAlerts').style="color:rgb(41, 43, 44)";
        }
    
    }
    
    if (document.getElementById('redStats') != null) {
    document.getElementById('redAvgTemp').innerHTML = Math.round(redAvgTemp * 100) / 100;
    document.getElementById('redLastTemp').innerHTML = redLastTemp;
    if (redLastTemp <=0 || redLastTemp >= 25) {
        document.getElementById('redLastTemp').style="color:red";
        }
    else {
        document.getElementById('redLastTemp').style="color:rgb(41, 43, 44)";
        } 
      
    document.getElementById('redLastTempTime').innerHTML = redLastTempTime;
    
    document.getElementById('redAlerts').innerHTML = redAlerts;
    if (redAlerts > 0) {
        document.getElementById('redAlerts').style="color:red";
        }
    else {
        document.getElementById('redAlerts').style="color:rgb(41, 43, 44)";
        }
    
    }
    
    if (document.getElementById('blackStats') != null) {
    document.getElementById('blackAvgTemp').innerHTML = Math.round(blackAvgTemp * 100) / 100;
    document.getElementById('blackLastTemp').innerHTML = blackLastTemp;
    if (blackLastTemp <=0 || blackLastTemp >= 25) {
        document.getElementById('blackLastTemp').style="color:red";
        }
    else {
        document.getElementById('blackLastTemp').style="color:rgb(41, 43, 44)";
        }
      
    document.getElementById('blackLastTempTime').innerHTML = blackLastTempTime;
    
    document.getElementById('blackAlerts').innerHTML = blackAlerts;
    if (blackAlerts > 0) {
        document.getElementById('blackAlerts').style="color:red";
        }
    else {
        document.getElementById('blackAlerts').style="color:rgb(41, 43, 44)";
        }
    
    }
    
    if (document.getElementById('blueStats') != null) {
    document.getElementById('blueAvgTemp').innerHTML = Math.round(blueAvgTemp * 100) / 100;
    document.getElementById('blueLastTemp').innerHTML = blueLastTemp;
    if (blueLastTemp <=0 || blueLastTemp >= 25) {
        document.getElementById('blueLastTemp').style="color:red";
        }
    else {
        document.getElementById('blueLastTemp').style="color:rgb(41, 43, 44)";
        }
     
 /*   dateAndTime = blueLastTempTime.split("T");
    var date = dateAndTime[0].split("-");
    var time = dateAndTime[1].split(":");
    var hours = time[0];
    var minutes = time[1];
    var seconds = time[2].substring(".")[0];
    if (parseInt(hours)<10) {
        hours = "0"+hours;
        }
    if (parseInt(hours)<10) {
        hours = "0"+hours;
        }
    if (parseInt(minutes)<10) {
        minutes = "0"+minutes;
        }
    if (parseInt(seconds)<10) {
        seconds = "0"+seconds;
        }     */
      
    document.getElementById('blueLastTempTime').innerHTML = blueLastTempTime;
    
    document.getElementById('blueAlerts').innerHTML = blueAlerts;
    if (blueAlerts > 0) {
        document.getElementById('blueAlerts').style="color:red";
        }
    else {
        document.getElementById('blueAlerts').style="color:rgb(41, 43, 44)";
        }
    
    }
    
    if (document.getElementById('pinkStats') != null) {
    document.getElementById('pinkAvgTemp').innerHTML = Math.round(pinkAvgTemp * 100) / 100;
    document.getElementById('pinkLastTemp').innerHTML = pinkLastTemp;
    if (pinkLastTemp <=0 || pinkLastTemp >= 25) {
        document.getElementById('pinkLastTemp').style="color:red";
        }
    else {
        document.getElementById('pinkLastTemp').style="color:rgb(41, 43, 44)";
        }
      
    document.getElementById('pinkLastTempTime').innerHTML = pinkLastTempTime;
    
    document.getElementById('pinkAlerts').innerHTML = pinkAlerts;
    if (pinkAlerts > 0) {
        document.getElementById('pinkAlerts').style="color:red";
        }
    else {
        document.getElementById('pinkAlerts').style="color:rgb(41, 43, 44)";
        }
    
    }
        
    console.log("data successfully parsed.")
    }
    
    