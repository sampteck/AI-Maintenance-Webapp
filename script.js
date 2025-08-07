// Dark mode persistence
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
  initChart();
});

// Toggle Theme
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// Show toast
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// Chart Data
let faultChart;
let labels = [];
let data = [];

// Initialize Chart
function initChart() {
  const ctx = document.getElementById("faultChart").getContext("2d");
  faultChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Fault Risk (%)",
        data: data,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Manual Input
function submitManualInput() {
  const temp = parseFloat(document.getElementById("tempInput").value);
  const vibration = parseFloat(document.getElementById("vibrationInput").value);
  if (isNaN(temp) || isNaN(vibration)) {
    showToast("Please enter both temperature and vibration values.");
    return;
  }
  processSensorData(temp, vibration);
}

// Simulate Data
function simulateSensorData() {
  const temp = Math.floor(Math.random() * 100);
  const vibration = Math.floor(Math.random() * 50);
  processSensorData(temp, vibration);
}

// Predictive Maintenance Logic
function processSensorData(temp, vibration) {
  const risk = Math.min(100, Math.floor((temp + vibration) / 1.5));
  const timestamp = new Date().toLocaleTimeString();

  // Update chart
  labels.push(timestamp);
  data.push(risk);
  if (labels.length > 10) {
    labels.shift();
    data.shift();
  }
  faultChart.update();

  // Display status
  const status = document.getElementById("statusDisplay");
  if (risk > 80) {
    status.innerText = `Warning: High maintenance risk detected! (${risk}%)`;
    status.style.color = "red";
  } else if (risk > 50) {
    status.innerText = `Caution: Moderate risk. Monitor system. (${risk}%)`;
    status.style.color = "orange";
  } else {
    status.innerText = `Normal: System running smoothly. (${risk}%)`;
    status.style.color = "green";
  }

  showToast("Sensor data processed successfully.");
}

// Export to CSV
function exportCSV() {
  let csv = "Time,Fault Risk (%)\n";
  for (let i = 0; i < labels.length; i++) {
    csv += `${labels[i]},${data[i]}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "maintenance_data.csv";
  link.click();

  showToast("CSV exported!");
}
