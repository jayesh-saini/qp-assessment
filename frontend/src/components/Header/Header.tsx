import Button from 'react-bootstrap/Button';
import './Style.scss';
import Logo from '../../assets/images/logo.png';
import LogoutIcon from '../../assets/images/icons/logout-icon.svg';
import cartIcon from '../../assets/images/icons/cart-icon.png';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const Header = () => {
    const navigate = useNavigate()
    const { setAuthToken, setRole }: any = useContext(AuthContext);

    return (
        <div className="flexRowBWContainer main-header-container">
            <div className="flexRowContainer logo-container" onClick={()=>{navigate("/")}}>
                <div>
                    <img className='logo' src={Logo} />
                </div>
                <div>
                    <span className='store-title'>Grocery Store</span>
                </div>
            </div>
            <div className='logout-button-container'>
                <Button variant="primary" className='flexRowContainer d-flex mx-2 cart-header-button' onClick={() => { navigate("/cart") }}>
                    <span>Cart</span>
                    <img src={cartIcon} className='cart-img' />
                </Button>
                <Button variant="primary" className='flexRowContainer d-flex mx-2 cart-header-button' onClick={() => { navigate("/orders") }}>
                    <span>Orders</span>
                    <img src={cartIcon} className='cart-img' />
                </Button>
                <Button variant="primary" className='flexRowContainer d-flex' onClick={() => {
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("cart")
                    setRole(null)
                    setAuthToken(null)
                    navigate("/login")
                }}>
                    <span>Logout</span>
                    <img src={LogoutIcon} className='logout-img' />
                </Button>
            </div>
        </div>
    )
}

export default Header