import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const OrderSuccess = () =>{

    const  navigate = useNavigate();

    return (
        <div className="container py-5">
            <div className="success-main-container">
                <div className="inner-success">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcby6EW0ZkNt8VgoGos26WsYhXNcUjoDJt9hD3leSiQA&s" />
                </div>
                <div className="inner-success pt-5">
                    <span className="success-heading">Order Success</span>
                </div>
                <div className="inner-success pb-5">
                    <span className="sub-success-heading">Thankyou for your order!</span>
                </div>
                <div className="inner-success">
                    <Button variant="primary" onClick={()=>{navigate("/")}}>Continue shopping!</Button>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess;