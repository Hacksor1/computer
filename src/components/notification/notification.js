import './notifications.css';

const alertContainer = document.getElementsByClassName('notifications__container')[0]

function showNotification(text) {
  const alertElem = document.createElement('div')
  alertElem.textContent = text
  alertElem.classList.add('notification')
  alertContainer.appendChild(alertElem)
  
  const transition = [{
    opacity: 0, 
    transform: 'translate(400px, 0)'
  }, {
    opacity: 1, 
    transform: 'translate(0, 0)'
  }]

  const animate = alertElem.animate(transition, {
    duration: 700,
    easing: 'ease-out'
  })
  
  setTimeout(() => {
    animate.reverse()
    animate.onfinish = () => {
      alertElem.remove()
    }
  }, 1000)
}

export default showNotification;