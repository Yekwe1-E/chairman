// Dashboard Statistics & Chart.js Visualizations Controller
document.addEventListener('DOMContentLoaded', async () => {
  Auth.checkProtectedPage();
  await loadDashboardMetrics();
});

async function loadDashboardMetrics() {
  try {
    const res = await Auth.fetchWithAuth('/api/reports/dashboard');
    const result = await res.json();

    if (!result.success) {
      showToast('Failed to load dashboard metrics: ' + result.message, 'error');
      return;
    }

    const data = result.data;

    // Update KPI Cards in UI (Desktop & Mobile Carousel)
    if (document.getElementById('kpiTotalBirds')) document.getElementById('kpiTotalBirds').textContent = Number(data.total_birds || 0).toLocaleString();
    if (document.getElementById('mobileKpiTotalBirds')) document.getElementById('mobileKpiTotalBirds').textContent = `${Number(data.total_birds || 0).toLocaleString()} Birds`;

    if (document.getElementById('kpiActiveFlocks')) document.getElementById('kpiActiveFlocks').textContent = data.active_flocks || 0;
    if (document.getElementById('kpiPoultryHouses')) document.getElementById('kpiPoultryHouses').textContent = data.poultry_houses_count || 0;
    if (document.getElementById('kpiTodaysMortality')) document.getElementById('kpiTodaysMortality').textContent = data.todays_mortality || 0;
    
    if (document.getElementById('kpiTodaysEggs')) document.getElementById('kpiTodaysEggs').textContent = Number(data.todays_eggs || 0).toLocaleString();
    if (document.getElementById('mobileKpiEggs')) document.getElementById('mobileKpiEggs').textContent = `${Number(data.todays_eggs || 0).toLocaleString()} Eggs`;

    if (document.getElementById('kpiFeedStock')) document.getElementById('kpiFeedStock').textContent = `${data.feed_stock_bags || 0} bags`;
    if (document.getElementById('kpiMonthlyRevenue')) document.getElementById('kpiMonthlyRevenue').textContent = formatNaira(data.total_sales_revenue);
    if (document.getElementById('kpiMonthlyExpenses')) document.getElementById('kpiMonthlyExpenses').textContent = formatNaira(data.total_expenses);
    
    if (document.getElementById('kpiEstimatedProfit')) document.getElementById('kpiEstimatedProfit').textContent = formatNaira(data.estimated_profit);
    if (document.getElementById('mobileKpiProfit')) document.getElementById('mobileKpiProfit').textContent = formatNaira(data.estimated_profit);

    // Initialize Chart.js Charts if canvas context exists
    if (data.charts) {
      renderEggProductionChart(data.charts.eggTrends);
      renderMortalityChart(data.charts.mortalityTrends);
      renderFeedChart(data.charts.feedConsumptionChart);
      renderFinancialChart(data.charts.financialComparison);
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
  }
}

// 1. Egg Production Line Chart
function renderEggProductionChart(eggData) {
  const ctx = document.getElementById('eggProductionChart')?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: eggData ? eggData.map(d => d.day) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Daily Eggs Collected',
        data: eggData ? eggData.map(d => d.eggs) : [1820, 1850, 1890, 1910, 1940],
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(45, 106, 79, 0.12)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#52b788',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false } }
    }
  });
}

// 2. Mortality Bar Chart
function renderMortalityChart(mortalityData) {
  const ctx = document.getElementById('mortalityChart')?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: mortalityData ? mortalityData.map(d => d.day) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Mortality Count',
        data: mortalityData ? mortalityData.map(d => d.count) : [4, 2, 5, 3, 1],
        backgroundColor: '#ef4444',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// 3. Feed Stock Consumption Doughnut Chart
function renderFeedChart(feedData) {
  const ctx = document.getElementById('feedConsumptionChart')?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: feedData ? feedData.map(f => f.feed_name) : ['Layer Mash', 'Broiler Finisher', 'Chick Starter'],
      datasets: [{
        data: feedData ? feedData.map(f => f.stock) : [115, 60, 25],
        backgroundColor: ['#2d6a4f', '#d97706', '#3b82f6'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// 4. Financial Overview Chart (Income vs Expense vs Profit)
function renderFinancialChart(finData) {
  const ctx = document.getElementById('financialChart')?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: finData ? finData.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'Revenue (₦)',
          data: finData ? finData.revenue : [1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 2900000, 1990000],
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Expenses (₦)',
          data: finData ? finData.expenses : [900000, 1100000, 1300000, 1400000, 1600000, 1700000, 1800000, 1965000],
          backgroundColor: '#ef4444',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
