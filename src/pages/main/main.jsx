import PriceSummary from '../../components/price-summary/price-summary'
import ComponentList from '../../components/component-list/component-list'
import './main.css'
import { useEffect, useState } from 'react'

function MainPage() {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3004/components')
      .then(res => res.json())
      .then((data) => setComponents(data))
  }, [])

  return (
    <div className="mt-5 container text-center">
      <div className="row">
        <div className="col-8">
          <ComponentList components={components} />
        </div>
        <div className="col">
          <PriceSummary />
        </div>
      </div>
    </div>
  )
}

export default MainPage
