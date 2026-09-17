const drawChart = (canvas, type, data) => {
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  return new Chart(canvas, {
    type: type,
    data: {
      labels: data.map((item) => item.title),
      datasets: [
        {
          label: data.map((item) => item.title),
          data: data.map((item) => item.expense),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

export default drawChart;
