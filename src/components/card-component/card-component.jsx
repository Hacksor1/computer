import { useEffect } from 'react'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { cartState$, cartStateSubject } from '../../cart-state/cart-state'
import './card-component.css'

function CardComponent({ title, description, image, type, id }) {
  const [show, setShow] = useState(false)
  const [listComponents, setListComponents] = useState([])

  const [titleCard, setCardTitle] = useState(title);
  const [descriptionCard, setDescriptionCard] = useState(description);
  const [imageCard, setImageCard] = useState(image);
  const [isChoose, setIsChoose] = useState(false);

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    fetch(`http://localhost:3004/${type}`)
      .then(res => res.json())
      .then(data => setListComponents(data))
  }

  const handleChoose = (component) => {
    handleClose()
    const prevState = cartStateSubject.value;
    cartStateSubject.next({
      ...prevState,
      [type]: component,
    })
  }

  const deleteBtn = () => {
    const prevState = cartStateSubject.value;
    delete prevState[type]
    cartStateSubject.next(prevState)
  }

  const sub = cartState$.subscribe(data => {
    if (show) {
      return
    }

    if (Object.keys(data).includes(type)) {
      if (!isChoose) {
        setIsChoose(true);
      }

      const c = data[type];
      if (c.title !== titleCard) {
        setCardTitle(c.title);
      }
      if (c.image !== imageCard) {
        setImageCard(c.image)
      }
      const subscriptions = Object.entries(c.properties).reduce(
        (string, [key, value]) => string + `${key}: ${value}\n`,
        ''
      )
      if (subscriptions !== descriptionCard) {
        setDescriptionCard(subscriptions)
      }
      if (show) {
        handleClose()
      }
    } else {
      if (isChoose) {
        setIsChoose(false);
      }
      if (titleCard !== title) {
        setCardTitle(title);
      }
      if (imageCard !== image) {
        setImageCard(image);
      }
      if (descriptionCard !== description) {
        setDescriptionCard(description);
      }
        
    }
  });

  useEffect(() => {
    return () => {
      sub.unsubscribe();
    }
  }, [])

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="card-image col-md-4">
          <img style={{
            maxWidth: '100%',
            maxHeight: '220px',
          }} src={imageCard} alt="processor" />
        </div>
        <div className="col-md-8">
          <div className="card-body text-start">
            <h5 className="card-title">{titleCard}</h5>
            <p className="card-text" style={{
              whiteSpace: 'pre-line'
            }}>
              {descriptionCard}
            </p>
            <p className="card-text">
              <button onClick={handleShow} className='me-3 btn btn-outline-primary'>
                {isChoose ? 'Изменить' : 'Добавить'}
              </button>
              {isChoose && (
                <button onClick={deleteBtn} className='btn btn-outline-danger'>
                {'Удалить'}
                </button>
              )}
             
            </p>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w" >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            {listComponents.map(c => (c.count > 0 && (
               <div key={c.id} className="mt-3 mx-auto card mb-3" style={{ maxWidth: '100%' }}>
               <div className="row g-0">
                 <div className="col-md-4 card-image px-3">
                   <img src={c.image} className="img-fluid rounded-start" alt="" />
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
                     <button onClick={() => handleChoose(c)} className="mt-2 btn btn-primary">Выбрать</button>
                   </div>
                 </div>
               </div>
             </div>
            )
             
            ))}

          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CardComponent
