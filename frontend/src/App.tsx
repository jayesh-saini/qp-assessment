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

const UserProtectedRoute = ({ children }: any) => {
  const { role }: any = useContext(AuthContext)

  return role == "user" ? children : <Navigate to="/login" />;
}

const Root = () => {
  const { role }: any = useContext(AuthContext)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <UserProtectedRoute>
            <Header />
            <ProductListing />
          </UserProtectedRoute>}>
        </Route>
        <Route path='/login' element={ role == "user" ? <Navigate to="/" /> : <Login />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/admin/products' element={<Products />} />
        <Route path='/admin/product/:product_id' element={<ProductDetails />} />
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