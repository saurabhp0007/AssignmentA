
import './App.css'
import CustomerLifetimeValueChart from './component/CustomerLifetimeValueChart'
import GeographicalDistributionChart from './component/GeographicalDistributionChart'
import NewCustomersChart from './component/NewCustomersChart'
import RepeatCustomersChart from './component/RepeatCustomersChart'
import SalesGrowthRateChart from './component/SalesGrowthrate'
import SalesDashboard from './component/TotalSalesChart'

function App() {

  return (
    <div className="App">
    <h1>Shopify Analytics Dashboard</h1>
   <SalesDashboard />
   <SalesGrowthRateChart />
   <NewCustomersChart />
   <RepeatCustomersChart />
   <GeographicalDistributionChart />
   <CustomerLifetimeValueChart />
</div>
  )
}

export default App
