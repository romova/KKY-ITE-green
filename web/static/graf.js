    ws = new WebSocket('ws://147.228.173.95:4444/websocket');
    ws.onmessage = onSocketMessage;

    const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    ];
    
    var green_data = {
    labels: [1, 2, 3, 8, 9, 10, 18, 20, 5],
    datasets: [{
    label: 'Temperature green',
    backgroundColor: 'rgb(0,255,0)',
    borderColor: 'rgb(0,150,0)',
    data: [0, 10, 5, 2, 20, null , 30, 45],
    }]
    };
    
    var black_data = {
    labels: labels,
    datasets: [{
    label: 'Temperature black',
    backgroundColor: 'rgb(100, 100, 100)',
    borderColor: 'rgb(0, 0, 0)',
    data: [0, -10, -5, -2, -20, -30, -45],
    }]
    };
    
    var red_data = {
    labels: labels,
    datasets: [{
    label: 'Temperature red',
    backgroundColor: 'rgb(200, 0, 0)',
    borderColor: 'rgb(255, 0, 0)',
    data: [0, -10, -5, -2, -20, -30, -45],
    }]
    };
    
    var blue_data = {
    labels: labels,
    datasets: [{
    label: 'Temperature blue',
    backgroundColor: 'rgb(0, 0, 200)',
    borderColor: 'rgb(0, 0, 255)',
    data: [0, -10, -5, -2, -20, -30, -45],
    }]
    };
    
    var pink_data = {
    labels: labels,
    datasets: [{
    label: 'Temperature pink',
    backgroundColor: 'rgb(255,105,180)',
    borderColor: 'rgb(255,20,147)',
    data: [0, -10, -5, -2, -20, -30, -45],
    }]
    };
    
    var green = {
        type: 'line',
        data: green_data,
        options: {}
        };
        
    var black = {
        type: 'line',
        data: black_data,
        options: {}
        };
        
    var red = {
        type: 'line',
        data: red_data,
        options: {}
        };
        
    var blue = {
        type: 'line',
        data: blue_data,
        options: {}
        };
        
    var pink = {
        type: 'line',
        data: pink_data,
        options: {}
        };
        
    var greenChart = new Chart(
        document.getElementById('green'),
        green
        );
        
    var redChart = new Chart(
        document.getElementById('red'),
        red
        );
        
    var blackChart = new Chart(
        document.getElementById('black'),
        black
        );
        
    var blueChart = new Chart(
        document.getElementById('blue'),
        blue
        );
        
    var pinkChart = new Chart(
        document.getElementById('pink'),
        pink
        );


    function onSocketMessage(message) {
    //console.log(message.data);
    //console.log(message);
    var data = JSON.parse((message.data));
    console.log(data);
    
    time = data.time;
    temp = data.temp;
    team = data.team;
    console.log(team);
    //console.log(time);
    //console.log(temp);

    if(team=="green") {
    green_data.labels = time;
    green_data.datasets[0].data = temp;
    console.log("zelena");
    }

    if(team=="red") {
    red_data.labels = time;
    red_data.datasets[0].data = temp;
    console.log("cervena");
    }

    if(team=="black") {
    black_data.labels = time;
    black_data.datasets[0].data = temp;
    console.log("cerna");
    }
    
    if(team=="blue"){
    blue_data.labels = time;
    blue_data.datasets[0].data = temp;
    console.log("modra");
    }

    if(team=="pink") {
    pink_data.labels = time;
    pink_data.datasets[0].data = temp;
    console.log("ruzova");
    }

    greenChart.update();
    redChart.update();
    blackChart.update();
    blueChart.update();
    pinkChart.update();    
    }