import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { cartStateSubject } from '../../cart-state/cart-state'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './total-build.css'
import { formatPrice } from '../../utils/format-price'

const reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function TotalBuildPage() {
  const navigate = useNavigate()

  const cartState = cartStateSubject.value
  const summarySum = Object.values(cartState).reduce((sum, c) =>
    sum + parseInt(c.price.replace(' ', '')),
    0)

  const [phoneInput, setPhoneInput] = useState('')
  const [phoneErrorInput, setPhoneErrorInput] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailErrorInput, setErrorEmailInput] = useState(false)
  const [addressInput, setAddressInput] = useState('')
  const [addressErrorInput, setAddressErrorInput] = useState(false)

  const validateForm = () => {
    const isPhoneError = phoneInput.length < 11
    const isEmailError = !reg.test(emailInput)
    const isAddressError = addressInput.length < 10
    setPhoneErrorInput(isPhoneError)
    setErrorEmailInput(isEmailError)
    setAddressErrorInput(isAddressError)
    return isPhoneError || isEmailError || isAddressError
  }

  const submitForm = () => {
    const isError = validateForm()
    if (isError) {
      return
    }

    const build = cartStateSubject.value

    const formData = {
      telephone: phoneInput,
      email: emailInput,
      address: addressInput,
      date: new Date().toLocaleDateString(),
      build
    }

    fetch('http://localhost:3004/orders', {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(formData)
    }).then(() => {
      handleClose()
      setPhoneInput('')
      setEmailInput('')
      setAddressInput('')

      cartStateSubject.next({})
      
      navigate('/orders')
   });
  }


  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <div className='container  w-50'>
      <h2 className="text-center mt-3">Ваша конфигурация</h2>
      <table className="table table-striped" >
        <tbody>
          {Object.values(cartState).map((c) => (
            <tr key={c.typeTitle}>
              <td>{c.typeTitle}</td>
              <td>{c.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className='text-end fs-5'>Общая сумма вместе с сборкой: <span className='fw-bold fs-3'>
        {formatPrice(summarySum + 1000)} р
        </span>
      </p>
      <div className='d-flex justify-content-end'>
        <button onClick={handleBackClick} className='btn btn-outline-secondary'>Продолжить выбор</button>
        <button onClick={handleShow} className='ms-3 btn btn-primary'>Купить компьютер</button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Данные покупателя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Телефон</label>
            <PhoneInput
              className={phoneErrorInput ? 'form-control is-invalid' : 'form-control'}
              country={'ru'}
              value={phoneInput}
              onChange={setPhoneInput}
            />
            {phoneErrorInput && (
              <small className="text-danger">
                Введите полный номер телефона
              </small>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Email</label>
            <input
              className={emailErrorInput ? 'form-control is-invalid' : 'form-control'}
              type="email"
              onChange={e => setEmailInput(e.target.value)}
              value={emailInput}
              id="exampleInputPassword1" />
            {emailErrorInput && (
              <small className="text-danger">
                Введите коррекнтую электронную почту
              </small>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Адрес доставки</label>
            <input
              onChange={e => setAddressInput(e.target.value)}
              value={addressInput}
              type="text" className={addressErrorInput ? 'form-control is-invalid' : 'form-control'} id="exampleInputPassword1" />
            {addressErrorInput && (
              <small className="text-danger">
                Введите полный адрес доставки
              </small>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={submitForm}>
            Заказать
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TotalBuildPage