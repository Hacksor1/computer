import './register.css'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { InputGroup } from 'react-bootstrap';
import { useState } from 'react'
import {  authStateSubject } from '../../cart-state/cart-state';
import { useNavigate } from 'react-router-dom';

const reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function RegisterPage() {
  const [error, setError] = useState(false);
  const [login, setLogin] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const editLogin = (login) => {
    setError(false)
    setLoginError(false)
    setLogin(login)
  }

  const editPassword = (password) => {
    setError(false)
    setPassword(password)
  }

  const submit = () => {
    if (!reg.test(login)) {
      setLoginError(true);
      return;
    }

    fetch('http://localhost:3004/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password
      })
    })
    .then(() => {
      authStateSubject.next('true')
      localStorage.setItem('login', login)
      navigate('/')
    });
  }

  const loginNavigate = () => {
    navigate('/login')
  }

  return (
    <div className="mt-5 container text-center">
      <div className='row'>
        <div className="bg-white w-50 mx-auto p-4 px-5">
          <h3 className='mb-3'>Регистрация</h3>
          <div className="mb-3">
            <input
              className={loginError ? 'form-control is-invalid' : 'form-control'}
              type="email"
              onChange={e => editLogin(e.target.value)}
              placeholder="Email"
              value={login}
              id="exampleInputPassword1" />
            {loginError && (
              <small className="text-danger">
                Введите корректную электронную почту
              </small>
            )}
        </div>
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
          Зарегистрироваться
        </Button>
        <Button className='w-50' variant="link" onClick={() => loginNavigate()}>
          Войти
        </Button>
      </div>
        </div>
      </div>

    </div>
  )
}

export default RegisterPage
