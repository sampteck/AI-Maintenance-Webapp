document.getElementById('inputForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const temp = parseFloat(document.getElementById('tempInput').value);
  const vibration = parseFloat(document.getElementById('vibrationInput').value);
  const pressure = parseFloat(document.getElementById('pressureInput').value);

  const outputArea = document.getElementById('outputArea');

  let result;
  if (temp > 80 || vibration > 6 || pressure > 120) {
    result = "⚠️ Warning: Maintenance Required";
    outputArea.innerHTML = `<p style="color:red;">${result}</p>`;
  } else { 
    result = "✅ All Systems Normal";
    outputArea.innerHTML = `<p style="color:green;">${result}</p>`;
  }

  updateChart(temp, vibration, pressure);
  logData(temp, vibration, pressure, result);
});

// Chart.js bar chart setup
const ctx = document.getElementById('statusChart').getContext('2d');
const statusChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Temperature', 'Vibration', 'Pressure'],
    datasets: [{
      label: 'Sensor Readings',
      data: [0, 0, 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Function to update chart
function updateChart(temp, vibration, pressure) {
  statusChart.data.datasets[0].data = [temp, vibration, pressure];
  statusChart.update();
}

// Auto-simulate button
document.getElementById('simulateBtn').addEventListener('click', () => {
  document.getElementById('tempInput').value = (Math.random() * 100).toFixed(1);
  document.getElementById('vibrationInput').value = (Math.random() * 10).toFixed(1);
  document.getElementById('pressureInput').value = (Math.random() * 150).toFixed(1);
});

// Logging system
const logs = [];

function logData(temp, vibration, pressure, result) {
  const timestamp = new Date().toLocaleString();
  logs.push({ timestamp, temp, vibration, pressure, result });
}

// Export logs as CSV
document.getElementById('downloadCSV').addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,Timestamp,Temperature,Vibration,Pressure,Result\n";
  logs.forEach(log => {
    csvContent += `${log.timestamp},${log.temp},${log.vibration},${log.pressure},${log.result}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ai_maintenance_logs.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
