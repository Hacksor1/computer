import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import Navbar from './components/navbar/navbar'
import MainPage from './pages/main/main'
import ReportPage from './pages/report/report'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AddInfoPage from './pages/add-info/add-info'
import TotalBuildPage from './pages/total-build/total-build'
import OrdersPage from './pages/orders/orders'
import LoginPage from "./pages/login/login";
import { authState$, authStateSubject, cartState$ } from './cart-state/cart-state';
import { useEffect, useState } from "react";
import RegisterPage from "./pages/register/register";
import PrivateRoute from "./private-route";


function App() {
  const [isAuth, setIsAuth] = useState(authStateSubject.value === 'admin' || authStateSubject.value === 'true');
  const nagivate = useNavigate();
  useEffect(() => {
    const subCart = cartState$.subscribe()
    const subAuth = authState$.subscribe(state => {
      const auth = state === 'admin' || state === 'true'
      if (auth !== isAuth) {
        setIsAuth(true)
      }

      if (!auth) {
        nagivate('/login')
      }
    })

    return () => {
      subAuth.unsubscribe();
      subCart.unsubscribe();
    }
  }, [])
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuth ? <MainPage /> : <Navigate replace to='/login' />} />
        <Route path="/report" element={isAuth ? <ReportPage /> : <Navigate replace to='/login' />} />
        <Route path="/info" element={isAuth ? <AddInfoPage /> : <Navigate replace to='/login' />} />
        <Route path="/orders" element={isAuth ? <OrdersPage /> : <Navigate replace to='/login' />} />
        <Route path="/build" element={isAuth ? <TotalBuildPage /> : <Navigate replace to='/login' />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>  
    </>

  );
}

export default App;
