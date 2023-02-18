import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { authState$, authStateSubject, cartStateSubject } from '../../cart-state/cart-state';
import './navbar.css';
import logoimage from './logo.png'

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(authStateSubject.value === 'admin')
  const [isAuth, setIsAuth] = useState(authStateSubject.value === 'admin' || authStateSubject.value === 'true')
  useEffect(() => {
    const sub = authState$.subscribe(state => {
      const is = state === 'admin';
      setIsAdmin(is)
      

      const auth = state === 'admin' || state === 'true'
      setIsAuth(auth)
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('login')
    authStateSubject.next('false')
    cartStateSubject.next({})
  }

  return (
    <nav className="sticky-top navbar navbar-expand-lg bg-white">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img style = {{maxHeight: '50px'}} src = {logoimage}/>

        </Link>
        {isAuth && (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav w-100 me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">
              Главная
            </Link>
          </li>
          <li className={'nav-item ' + (!isAdmin ? 'flex-grow-1' : '')}>
            <Link className="nav-link" to="/orders">
              Мои заказы
            </Link>
          </li>
          {isAdmin && (
          <><li className="nav-item">
              <Link className="nav-link" to="/report">
                Отчет
              </Link>
            </li><li className="flex-grow-1 nav-item">
                <Link className="nav-link" to="/info">
                  Добавить информацию
                </Link>
              </li></>
          )

          }
          <li className="nav-item">
            <button className="btn btn-link" onClick={() => logout()}>
              Выйти
            </button>
          </li>
        </ul>
      </div>
        )

        }

      </div>
    </nav>
  );
}

export default Navbar;
