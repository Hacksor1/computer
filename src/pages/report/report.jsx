import { useEffect, useState } from 'react'
import { formatPrice } from '../../utils/format-price'
import './report.css'

function ReportPage() {
  const [rawOrders, setRawOrders] = useState([])
  const [orders, setOrders] = useState({})
  const [totalSum, setTotalSum] = useState(0)
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  const filterOrder = (data) => {
    const orders = (data ? data : rawOrders)
      .filter(o => {
        const [day, month, year] = o.date.split('.')
        if (!dateStart && !dateEnd) {
          return true
        }
        if (!dateEnd) {
          return new Date(dateStart) <= new Date(`${month}.${day}.${year}`)
        }
        if (!dateStart) {
          return new Date(`${month}.${day}.${year}`) <= new Date(dateEnd)
        }
        return new Date(dateStart) <= new Date(`${month}.${day}.${year}`) && new Date(`${month}.${day}.${year}`) <= new Date(dateEnd)
      })
      .map(o => o.build)
      .map((build) => {
        return Object.entries(build).map(([key, value]) => ({
          ...value,
          id: value.id + key,
        }))
      }).flat()

    const sum = Object.values(orders).reduce((sum, c) =>
      sum + c.count * parseInt(c.price.replace(' ', '')),
    0)
    setTotalSum(sum)
    const ordersByType = orders.reduce((obj, c) => {
      if (c.typeTitle in obj) {
        const uniqueComponent = obj[c.typeTitle].find(innerComponent => innerComponent.id === c.id)
        if (uniqueComponent) {
          uniqueComponent.count += c.count
        } else {
          c.count = 1
          obj[c.typeTitle].push(c)
        }
      } else {
        obj[c.typeTitle] = [c]
      }
      return obj
    }, {})

    Object.keys(ordersByType).forEach(key => {
      const arrayComponent = ordersByType[key]
      const totalSum = arrayComponent.reduce((sum, c) => {
        return sum + parseInt(c.price.replace(' ', ''))
      }, 0)
      const totalCount =  arrayComponent.reduce((sum, c) => {
        return sum + parseInt(c.count)
      }, 0)
      ordersByType[key].push({
        count: totalCount,
        price: '-',
        title: 'Итого',
        total: totalSum
      })
    })

    setOrders(ordersByType)
  }

  useEffect(() => {
    fetch('http://localhost:3004/orders')
      .then(res => res.json())
      .then((data) => {
        setRawOrders(data)
        filterOrder([])
      })

  }, [])

  return (
    <>
      <h2 className="text-center mt-3">Отчет по продажам</h2>
      <div className="wrapper bg-white d-flex w-50 align-items-center" style={{ height: '40px' }}>
        <p style={{ width: '270px' }} className="m-0">Период:</p>
        <input max={new Date().toISOString().slice(0, 10)} onChange={e => setDateStart(e.target.value)} value={dateStart} type="date" className="form-control mx-3" placeholder="Дата" />
        -
        <input max={new Date().toISOString().slice(0, 10)} onChange={e => setDateEnd(e.target.value)} value={dateEnd} type="date" className="form-control mx-3" placeholder="Дата" />
        <button onClick={() => filterOrder()} className="btn btn-primary" style={{ width: '300px' }}>Отчет</button>
      </div>
      <div className='w-50 mx-auto'>
        <table className='table'>
          <thead>
            <tr className='table-dark'>
              <th style={{width: '35%'}}>Название</th>
              <th className='text-end'>Количество заказов</th>
              <th className='text-end'>Цена за шт. в р.</th>
              <th className='text-end'>Цена общая в р.</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(orders).map(type => {
              return orders[type].map(c => (
                <tr className={c.total ? 'table-dark fw-bold' : ''}>
                  <td style={{width: '35%'}}>{c.title}</td>
                  <td className='text-end'>{c.count}</td>
                  <td className='text-end'>{c.price}</td>
                  <td className='text-end'>
                    {c.total ? formatPrice(c.total) : (
                      formatPrice(parseInt(c.price.replace(' ', '')) * (c.count))
                    )}

                  </td>
                </tr>
              ))
            })}
          </tbody>
        </table>

        <h4 className='mt-4'>Общая стоимость заказов: {formatPrice(totalSum)} р</h4>
      </div>
    </>
  )
}

export default ReportPage
