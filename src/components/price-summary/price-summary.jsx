import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartState$ } from '../../cart-state/cart-state'
import { formatPrice } from '../../utils/format-price'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './price-summary.css'

function PriceSummary() {
  const [price, setPrice] = useState(0)
  const [disabled, setDisabled] = useState(true)

  const subs = cartState$.subscribe((data) => {
    const sum = Object.values(data).reduce((sum, c) => 
      sum + parseInt(c.price.replace(' ', '')),
    0)
    if (price !== sum) {
      setPrice(sum)
    }
    // @HACK update length when add new type component
    const COUNT_ALL_COMPONENTS = 8
    const isDisabled = Object.keys(data).length !== COUNT_ALL_COMPONENTS
    if (isDisabled !== disabled) {
      setDisabled(isDisabled);
    } 
  })

  useEffect(() => {
    return () => {
      subs.unsubscribe()
    }
  }, [])

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/build')
  }

  return (
    <div className="d-flex flex-column mx-3 shadow bg-white p-3 mb-5 bg-body-tertiary rounded" style={{
      minHeight: '200px',
      maxWidth: '350px',
      position: 'sticky',
      top: '70px'
    }}>
      <h3 className='fs-5 fw-normal'>Стоимость компьютера</h3>
      <div className='flex-grow-1 fs-5'>
        <p className='mb-0 d-flex alig'>
          <span className='text-secondary flex-grow-1 text-start'>Общая стоимость: </span>
          <span className='fs-4'> {formatPrice(price)} p</span>
        </p>
        <p className='d-flex'>
          <span className='text-secondary flex-grow-1 text-start'>Стоимость сборки: </span>
          <span className='fs-4'> {formatPrice(price === 0 ? 0 : price + 1000)} p</span>
        </p>
      </div>
      <OverlayTrigger
        placement="bottom"
        overlay={
          disabled ? (
          <Tooltip>
            Выберите все комплектующие
          </Tooltip>)
          : <></>
        }>
          <div>
            
          <button onClick={handleClick} className='btn btn-primary w-100' disabled={disabled}>Собрать</button>
          </div>
        </OverlayTrigger>
    </div>
  )
}

export default PriceSummary
