import Button from 'react-bootstrap/Button';
import './Style.scss';
import Logo from '../../assets/images/logo.png';
import LogoutIcon from '../../assets/images/icons/logout-icon.svg';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const AdminHeader = () => {
    const navigate = useNavigate()
    const { setAuthToken, setRole }: any = useContext(AuthContext);

    return (
        <div className="flexRowBWContainer main-header-container">
            <div className="flexRowContainer logo-container" onClick={() => { navigate("/admin/products") }}>
                <div>
                    <img className='logo' src={Logo} />
                </div>
                <div>
                    <span className='store-title'>Grocery Store</span>
                </div>
            </div>
            <div className='logout-button-container'>
                <Button variant="primary" className='flexRowContainer d-flex' onClick={() => {
                    localStorage.removeItem("access_token")
                    setRole(null)
                    setAuthToken(null)
                    navigate("/admin/login")
                }}>
                    <span>Logout</span>
                    <img src={LogoutIcon} className='logout-img' />
                </Button>
            </div>
        </div>
    )
}

export default AdminHeader