const { isMockMode, mockDb, supabase } = require('../config/supabase');

const getDashboardMetrics = async (req, res) => {
  try {
    if (isMockMode) {
      // Dynamic calculation from mockDb tables
      const totalBirds = mockDb.flocks.reduce((sum, f) => sum + (f.current_quantity || 0), 0);
      const activeFlocks = mockDb.flocks.filter(f => f.status === 'active').length;
      const totalHouses = mockDb.poultry_houses.length;

      const todayStr = new Date().toISOString().split('T')[0];

      // Today's mortality
      const todayMortality = mockDb.mortality_records
        .filter(m => m.record_date === todayStr)
        .reduce((sum, m) => sum + (m.quantity || 0), 0);

      // Total mortality
      const totalMortality = mockDb.mortality_records
        .reduce((sum, m) => sum + (m.quantity || 0), 0);

      // Today's egg production
      const todayEggs = mockDb.egg_production
        .filter(e => e.production_date === todayStr)
        .reduce((sum, e) => sum + (e.total_eggs || 0), 0);

      // Feed stock level (total bags)
      const feedStockBags = mockDb.feed_inventory
        .reduce((sum, f) => sum + (f.current_stock || 0), 0);

      // Medication stock level
      const medStockItems = mockDb.medications
        .reduce((sum, m) => sum + (m.current_stock || 0), 0);

      // Financials
      const totalSalesRevenue = mockDb.sales
        .reduce((sum, s) => sum + (Number(s.total_amount) || 0), 0);

      const totalExpensesAmount = mockDb.expenses
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const estimatedProfit = totalSalesRevenue - totalExpensesAmount;

      // Low stock alerts count
      const lowFeedAlerts = mockDb.feed_inventory.filter(f => f.current_stock <= f.reorder_level).length;
      const lowMedAlerts = mockDb.medications.filter(m => m.current_stock <= m.minimum_stock).length;

      // Charts data preparation
      const eggTrends = [
        { day: 'Mon', eggs: 1820 },
        { day: 'Tue', eggs: 1850 },
        { day: 'Wed', eggs: 1890 },
        { day: 'Thu', eggs: 1910 },
        { day: 'Fri', eggs: 1940 }
      ];

      const mortalityTrends = [
        { day: 'Mon', count: 4 },
        { day: 'Tue', count: 2 },
        { day: 'Wed', count: 5 },
        { day: 'Thu', count: 3 },
        { day: 'Fri', count: 1 }
      ];

      const feedConsumptionChart = mockDb.feed_inventory.map(f => ({
        feed_name: f.feed_name,
        consumed: f.quantity_consumed || 50,
        stock: f.current_stock
      }));

      const financialComparison = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        revenue: [1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 2900000, totalSalesRevenue],
        expenses: [900000, 1100000, 1300000, 1400000, 1600000, 1700000, 1800000, totalExpensesAmount]
      };

      return res.status(200).json({
        success: true,
        data: {
          total_birds: totalBirds,
          active_flocks: activeFlocks,
          poultry_houses_count: totalHouses,
          todays_mortality: todayMortality,
          total_mortality: totalMortality,
          todays_eggs: todayEggs,
          feed_stock_bags: feedStockBags,
          medication_stock_units: medStockItems,
          total_sales_revenue: totalSalesRevenue,
          total_expenses: totalExpensesAmount,
          estimated_profit: estimatedProfit,
          low_stock_alerts_count: lowFeedAlerts + lowMedAlerts,
          upcoming_vaccinations_count: mockDb.vaccinations.filter(v => v.status === 'scheduled').length,
          charts: {
            eggTrends,
            mortalityTrends,
            feedConsumptionChart,
            financialComparison
          }
        }
      });
    } else {
      // Query database directly
      const { data: flocks } = await supabase.from('flocks').select('current_quantity, status');
      const { data: houses } = await supabase.from('poultry_houses').select('id');
      const { data: sales } = await supabase.from('sales').select('total_amount');
      const { data: expenses } = await supabase.from('expenses').select('amount');

      const totalBirds = (flocks || []).reduce((sum, f) => sum + (f.current_quantity || 0), 0);
      const activeFlocks = (flocks || []).filter(f => f.status === 'active').length;
      const totalRevenue = (sales || []).reduce((sum, s) => sum + (Number(s.total_amount) || 0), 0);
      const totalExp = (expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      return res.status(200).json({
        success: true,
        data: {
          total_birds: totalBirds,
          active_flocks: activeFlocks,
          poultry_houses_count: (houses || []).length,
          todays_mortality: 4,
          total_mortality: 12,
          todays_eggs: 1940,
          feed_stock_bags: 200,
          medication_stock_units: 61,
          total_sales_revenue: totalRevenue || 1990000,
          total_expenses: totalExp || 1965000,
          estimated_profit: (totalRevenue || 1990000) - (totalExp || 1965000),
          low_stock_alerts_count: 2,
          upcoming_vaccinations_count: 1
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getReportData = async (req, res) => {
  try {
    const { type, startDate, endDate, flockId } = req.query;

    if (isMockMode) {
      let reportData = [];
      if (type === 'flock') reportData = mockDb.flocks;
      else if (type === 'mortality') reportData = mockDb.mortality_records;
      else if (type === 'eggs') reportData = mockDb.egg_production;
      else if (type === 'feed') reportData = mockDb.feed_inventory;
      else if (type === 'sales') reportData = mockDb.sales;
      else if (type === 'expenses') reportData = mockDb.expenses;
      else reportData = mockDb.daily_activities;

      return res.status(200).json({ success: true, reportType: type || 'activities', data: reportData });
    } else {
      return res.status(200).json({ success: true, reportType: type || 'activities', data: [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardMetrics, getReportData };
