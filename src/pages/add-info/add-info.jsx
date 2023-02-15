import { useState } from 'react'
import { useEffect } from 'react'
import './add-info.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import showNotification from '../../components/notification/notification'

function AddInfoPage() {
  const [show, setShow] = useState(false)
  const [selectItems, setSelectItems] = useState([])
  const [selectedComponentTitle, setSelectedComponentTitle] = useState('')
  const [titleType, setTitleType] = useState('')

  const [selectedComponent, setSelectedComponent] = useState('')
  const [selectedErrorComponent, setSelectedErrorComponent] = useState(false)
  const [countInput, setCountInput] = useState('')
  const [countErrorInput, setCountErrorInput] = useState(false)
  const [priceInput, setPriceInput] = useState('')
  const [priceErrorInput, setPriceErrorInput] = useState(false)
  const [dateInput, setDateInput] = useState('')
  const [dateErrorInput, setDateErrorInput] = useState(false)


  const validateForm = () => {
    const isSelectError = !selectedComponent
    const isPriceError = !parseInt(priceInput) || parseInt(priceInput) <= 0
    const isCountError = (!parseInt(countInput) && parseInt(countInput) !== 0) || parseInt(countInput) < 0
    const isDateError = !dateInput
    setSelectedErrorComponent(isSelectError)
    setCountErrorInput(isCountError)
    setPriceErrorInput(isPriceError)
    setDateErrorInput(isDateError)
    return isSelectError || isPriceError || isCountError || isDateError
  }

  const submitForm = () => {
    const [type, id] = selectedComponent.split('@')
    const isError = validateForm()
    if (isError) {
      return
    }

    const date = new Date(dateInput).toLocaleDateString()
    const formData = {
      count: parseInt(countInput),
      price: priceInput + ' р',
      date
    }

    fetch(`http://localhost:3004/${type}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(formData)
    }).then(() => {
      handleClose()
      setSelectedComponent('')
      setCountInput('')
      setPriceInput('')
      setDateInput('')
      
      showNotification('Информация успешно обновлена')
   });
  }



  const handleClose = () => setShow(false)
  const handleShow = (type, title) => {
    setSelectedErrorComponent(false)
    setCountErrorInput(false)
    setPriceErrorInput(false)
    setDateErrorInput(false)
    setTitleType(title)
    fetch(`http://localhost:3004/${type}`)
      .then(res => res.json())
      .then((data) => {
        setSelectItems(data.map(c => ({ type, ...c })))
        setSelectedComponentTitle(data[0].title)
        setSelectedComponent(type + '@' + data[0].id + '@' + data[0].title)
      })

    setShow(true)
  }

  const [components, setComponents] = useState([])
  useEffect(() => {
    fetch('http://localhost:3004/components')
      .then(res => res.json())
      .then((data) => setComponents(data))
  }, [])
  return (
    <>
      <h2 className="text-center mt-3">Ввод информации о комплектующих</h2>
      <div className='form'>
        {components.map(c => (
          <div key={c.id} className="d-flex align-items-center mb-3">
            <div className="label mx-3">{c.title}</div>
            <button style={{
              width: '300px'
            }} className="btn btn-primary" onClick={() => handleShow(c.type, c.title)}>Выбрать</button>
          </div>
        ))}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ввод информации о комплектующих</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex'>
            <h4 className='fw-normal fs-4'>{titleType}</h4>
            <select
              className="ms-4 form-select"
              aria-label="Default select example"
              value={selectedComponent}
              onChange={(e) => {
                setSelectedComponent(e.target.value)
                setSelectedComponentTitle(e.target.value.split('@').at(-1))
              }}
            >
              {selectItems.map((c) => (
                <option key={c.id} value={c.type + '@' + c.id + '@' + c.title}>{c.title}</option>
              ))}
            </select>
          </div>
          <h4 className='mt-3 fs-5'>{selectedComponentTitle}</h4>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Количество</label>
            <input 
              onChange={e => setCountInput(e.target.value)} 
              type="number" 
              value={countInput}
              className={countErrorInput ? 'form-control is-invalid' : 'form-control'} id="exampleInputPassword1" />
            {countErrorInput && (
              <small className="text-danger">
                Введите количество товара на складе
              </small>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Цена</label>
            <input onChange={e => setPriceInput(e.target.value)} type="number" 
              value={priceInput}
              className={priceErrorInput ? 'form-control is-invalid' : 'form-control'}
              id="exampleInputPassword1" />
            {priceErrorInput && (
              <small className="text-danger ">
                Введите цену товара
              </small>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Дата поступления:</label>
            <input
              onChange={e => setDateInput(e.target.value)}
              type="date"
              value={dateInput}
              className={dateErrorInput ? 'form-control is-invalid' : 'form-control'}
              id="exampleInputPassword1"
              max={new Date().toISOString().slice(0, 10)}
            />
            {dateErrorInput && (
              <small className="text-danger ">
                Укажите дату постулпения товара на склад
              </small>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={submitForm}>
            Обновить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddInfoPage