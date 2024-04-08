import { Button } from "react-bootstrap";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../Context/interceptor";
import { format } from "date-fns"

const Orders = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext)

    const [orders, setOrders] = useState([])
    const [isFetchingOrders, setIsFetchingOrders] = useState(false)

    const fetchOrders = async () => {
        try {
            setIsFetchingOrders(true)
            const { data } = await api.get(`/user/order`, {
                headers: {
                    "access_token": authToken
                }
            })

            if (data.status == 200) {
                setOrders(data.data)
            } else {
                alert(data.message)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsFetchingOrders(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className="order-main-container container py-5">
            <div className="order-heading-container">
                <span>My Orders</span>
            </div>
            {orders.length > 0 ?
                (
                    orders.map((order: any) => {
                        return (
                            <div className="order-card-container">
                                <div className="order-card">
                                    <div className="order-header d-flex">
                                        <div>
                                            <span className="order-id">Order Id: {order.id}</span>
                                        </div>
                                        <div>
                                            <span className="order-id">Order Total: {order.total} ₹</span>
                                        </div>
                                        <div>
                                            <span className="order-id">Created At: {format(order.created_at, "dd-MM-yy hh:mm aa")}</span>
                                        </div>
                                    </div>
                                    <div className="order-body">
                                        <div className="order-item-container">
                                            <div className="item-img-container heading-img-container">
                                                <span className="font-weight-bold">#</span>
                                            </div>
                                            <div className="item-description-container">
                                                <span className="font-weight-bold">Name</span>
                                            </div>
                                            <div className="item-other-container">
                                                <span className="font-weight-bold">Quantity</span>
                                            </div>
                                            <div className="item-other-container text-end">
                                                <span className="font-weight-bold">Price</span>
                                            </div>
                                        </div>
                                        {order.order_items.map((element: any) => (<div className="order-item-container">
                                                <div className="item-img-container">
                                                    <img src={element.image_url} />
                                                </div>
                                                <div className="item-description-container">
                                                    <span>{element.name}</span>
                                                </div>
                                                <div className="item-other-container">
                                                    <span>{element.quantity}</span>
                                                </div>
                                                <div className="item-other-container text-end">
                                                    <span>{element.price} ₹</span>
                                                </div>
                                            </div>)
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) :
                (
                    <div className="no-orders-container">
                        <div className="d-flex justify-content-center mt-3">
                            <img src="https://rsrc.easyeat.ai/mweb/no-orders2.webp" />
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <span className="no-orders-text">No Orders Found</span>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" onClick={() => {
                                navigate("/")
                            }}>Start Ordering</Button>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Orders;  