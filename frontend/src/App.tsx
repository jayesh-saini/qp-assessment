import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header'
import Products from './components/Products/Products';
import ProductDetails from './components/ProductDetail/ProductDetails';
import Auth from "./components/Register/Register"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthContext, AuthProvider } from "./Context/AuthContext"
import { useContext } from 'react';
import ProductListing from "./components/ProductListing/ProductListing"
import Login from './components/Login/Login';
import Cart from "./components/Cart/Cart"
import OrderSuccess from './components/OrderSuccess/OrderSuccess';
import Orders from './components/Orders/Orders';
import AdminLogin from './components/Login/AdminLogin';
import AdminHeader from './components/Header/AdminHeader';

const UserProtectedRoute = ({ children }: any) => {
  const { role }: any = useContext(AuthContext)

  return role == "user" ? children : <Navigate to="/login" />;
}

const Root = () => {
  const { role }: any = useContext(AuthContext)
console.log(role);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <UserProtectedRoute>
            <Header />
            <ProductListing />
          </UserProtectedRoute>}>
        </Route>
        <Route path='/cart' element={ role == "user" ? <><Header /><Cart /></> : <Login />} />
        <Route path='/orders' element={ role == "user" ? <><Header /><Orders /></> : <Login />} />
        <Route path='/order-success' element={ role == "user" ? <><Header /><OrderSuccess /></> : <Login />} />
        <Route path='/login' element={ role == "user" ? <Navigate to="/" /> : <Login />} />
        <Route path='/register' element={<Auth />} />

        <Route path='/admin/login' element={ <><AdminHeader/><AdminLogin /> </> } />
        <Route path='/admin/products' element={role == "admin" ? <><AdminHeader/><Products /> </>: <Navigate to="/admin/login" />} />
        <Route path='/admin/product/:product_id' element={role == "admin" ? <><AdminHeader/><ProductDetails /> </>:  <Navigate to="/admin/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <>
      <AuthProvider>
        {/* <Header /> */}
        <Root></Root>
      </AuthProvider>
    </>
  )
}

export default App