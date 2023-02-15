import './orders.css'
import { useEffect, useState } from 'react'
import { formatPrice } from '../../utils/format-price'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [totalSum, setTotalSum] = useState(0)

  useEffect(() => {
    fetch('http://localhost:3004/orders')
      .then(res => res.json())
      .then((data) => {
        // @TODO replace email to dynamic
        const ordersEmail = data
          .filter(o => o.email === 'asas@gmail.com')
          .map(o => o.build)
          .map((build) => {
            return Object.entries(build).map(([key, value]) => ({
              ...value,
              id: value.id + key,
            }))
        }).flat()
        ordersEmail.sort((a, b) => a.typeTitle > b.typeTitle ? -1 : 1)
        const sum = Object.values(ordersEmail).reduce((sum, c) => 
          sum + parseInt(c.price.replace(' ', '')),
        0)
        setTotalSum(sum)
        setOrders(ordersEmail)
      })
  }, [])
  return (
    <div className="mt-5 container text-center">
      <div className="row">
        <div className="col">
          <div className="container">
            <h1 className='text-start'>Общая стоимость заказа: {formatPrice(totalSum)} р</h1>
            {orders.map(c => ((
              <div key={c.id} className="mt-3 mx-auto card mb-3" style={{ maxWidth: '100%' }}>
                <div className="row g-0">
                  <div className="col-md-4 card-image px-3">
                    <img src={c.image} className="img-fluid rounded-start" alt="" style={{
                      maxHeight: '200px'
                    }} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{c.title}</h5>
                      <p className='fs-5' style={{ marginBottom: 0 }}>Цена: {c.price}</p>
                      <p style={{ marginBottom: 0 }}>Количество на складе: {c.count}</p>

                      {Object.entries(c.properties).map(([key, value]) => (
                        <p key={key} className="card-text" style={{ marginBottom: 0 }}>
                          {key} : {value}
                        </p>
                      ))}

                      <p style={{ marginBottom: 0 }}>Дата поступления: {c.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            )

            ))}

          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
