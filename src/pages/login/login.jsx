import './login.css'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import {  authStateSubject } from '../../cart-state/cart-state';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [error, setError] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const editLogin = (login) => {
    setError(false)
    setLogin(login)
  }

  const editPassword = (password) => {
    setError(false)
    setPassword(password)
  }

  const submit = () => {
    fetch('http://localhost:3004/users')
      .then(res => res.json())
      .then((users) => {
        const user = users.find(user => user.login === login && user.password === password);
        if (user) {
          if (user.login === 'admin') {
            authStateSubject.next('admin')
          } else {
            authStateSubject.next('true')
          }
          navigate('/')
          setError(false)
        } else {
          authStateSubject.next('false')
          setError(true)
        }
      })
  }

  const register = () => {
    navigate('/register')
  }

  return (
    <div className="mt-5 container text-center">
      <div className='row'>
        <div className="bg-white w-50 mx-auto p-4 px-5">
          <h3 className='mb-3'>Авторизация</h3>
        <InputGroup className="mb-3">
        <Form.Control
          placeholder="Логин"
          className={error ? 'is-invalid' : ''}
          aria-label="Логин"
          onChange={e => editLogin(e.target.value)}
          value={login}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <Form.Control
          type='password'
          className={error ? 'is-invalid' : ''}
          placeholder="Пароль"
          aria-label="Пароль"
          onChange={e => editPassword(e.target.value)}
          value={password}
        />
      </InputGroup>
      <div className='text-start'>
        <Button className='w-50' variant="primary" onClick={() => submit()}>
          Войти
        </Button>
        <Button className='w-50' variant="link" onClick={() => register()}>
          Зарегистрироваться
        </Button>
      </div>

        </div>
      </div>

    </div>
  )
}

export default LoginPage
