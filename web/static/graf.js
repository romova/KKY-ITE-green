    const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    ];
    
    const data = {
    labels: labels,
    datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
    }]
    };
    
    const data2 = {
    labels: labels,
    datasets: [{
    label: 'My Second dataset',
    backgroundColor: 'rgb(135, 29, 46)',
    borderColor: 'rgb(15, 108, 149)',
    data: [0, -10, -5, -2, -20, -30, -45],
    }]
    };
    
    const config = {
    type: 'line',
    data: data,
    options: {}
    };
    
    const config2 = {
    type: 'line',
    data: data2,
    options: {}
    };
    
    const myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
    
    const myChart2 = new Chart(
    document.getElementById('myChart2'),
    config2
    );
