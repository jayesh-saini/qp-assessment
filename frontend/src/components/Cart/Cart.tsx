import { useEffect, useState } from "react";
import api from "../../Context/interceptor";
import "./style.scss";
import { Button, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])
  const [isFetchingVariationsData, setIsFetchingVariationsData] = useState(false)
  const [total, setTotal] = useState(0);
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);
  const [address, setAddress] = useState("");

  const fetchVariationsData = async (variation_ids: any) => {
    try {
      setIsFetchingVariationsData(true)

      const { data } = await api.post(`/user/variations`, {
        variation_ids
      })

      if (data.status == 200) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "{}")
        let t: any = 0;
        const variants = data.data.map((variant: any) => {
          t += variant.sale_price * localCart[variant.id];
          return { ...variant, quantity: localCart[variant.id] }
        })

        setTotal(t);

        setCartItems(variants)
      } else {
        alert(data.message)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsFetchingVariationsData(false)
    }
  }

  const updateCartHandler = (variant_id: number, index: number, quantity: number) => {
    try {
      const cart: any = [...cartItems]
      const localCart = JSON.parse(localStorage.getItem("cart") || "{}")
      if (quantity == 0) {
        delete localCart[variant_id]
        cart.splice(index, 1)
      } else {
        localCart[variant_id] = quantity
        cart[index].quantity = quantity
      }

      let t: any = 0;
      cart.map((variant: any) => {
        t += variant.sale_price * localCart[variant.id]
      })

      setTotal(t)

      setCartItems(cart)
      localStorage.setItem("cart", JSON.stringify(localCart))
    } catch (error) {
      console.log(error)
    }
  }

  const placeOrderHandler = async () => {
    try {
      setIsOrderPlacing(true);

      if (address.length < 3) {
        alert("Address must be greater then 3 characters")
        return;
      }

      const payload: any = {
        order_items: [],
        delivery_address: address
      }
      cartItems.map((element: any) => {
        payload.order_items.push({ variant_id: element.id, quantity: element.quantity })
      })

      const { data } = await api.post(`/user/order`, payload)

      if (data.status == 200) {
        localStorage.removeItem("cart");
        navigate("/order-success");
      } else {
        alert(data.message)
      }

    } catch (error) {
      alert("Something Went Wrong!")
    }
    finally {
      setIsOrderPlacing(false);
    }
  }

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "{}")

    let variation_ids = []
    for (let id in localCart) {
      variation_ids.push(+id)
    }

    fetchVariationsData(variation_ids)
  }, [])

  return (
    <div className="main-cart-container container pb-5">
      <div className="cart-heading-container">
        <span className="cart-heading">Cart</span>
      </div>
      {
        isFetchingVariationsData ?
          <div className="spinner-container">
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
            />
            <span className="visually-hidden">Loading...</span>
          </div>
          : <div className="inner-cart-container cart-info">
            {
              cartItems.length > 0 ?
                <>
                  <div className="cart-card-container d-flex">
                    <div className="cart-image-container">
                      <div>
                        <span className="cart-info-heading  cart-img-header">#</span>
                      </div>
                    </div>
                    <div className="cart-description-container">
                      <div>
                        <span className="cart-info-heading">Description</span>
                      </div>
                    </div>
                    <div className="cart-price-info-container">
                      <div>
                        <span className="cart-info-heading">Price</span>
                      </div>
                    </div>
                    <div className="cart-price-info-container">
                      <div className="quantity-dropdown-container">
                        <span className="cart-info-heading">Quantity</span>
                      </div>
                    </div>

                    <div className="cart-price-info-container text-right">
                      <div>
                        <span className="cart-info-heading">Total</span>
                      </div>
                    </div>

                    <div className="cart-price-info-container text-right">
                      <div>
                        <span className="cart-info-heading">X</span>
                      </div>
                    </div>

                  </div>
                  {cartItems.map((element: any, index: any) => {
                    return (
                      <>
                        <div key={index} className="cart-card-container d-flex align-items-center">
                          <div className="cart-image-container">
                            <img src={element.image_url} />
                          </div>
                          <div className="cart-description-container">
                            <div>
                              <span className="cart-item-heading">{element.name}</span>
                            </div>
                            <div>
                              <span className="cart-item-variant">Variant: {`${element.pack_size} ${element.unit}`}</span>
                            </div>
                          </div>
                          <div className="cart-price-info-container">
                            <div className="d-flex align-items-center">
                              <span className="cart-info-value sale-price">{element.sale_price}₹</span>
                              <span className="cart-info-value regular-price">{element.regular_price}₹</span>
                            </div>
                          </div>
                          <div className="cart-price-info-container">
                            <div className="quantity-dropdown-container dropdown">
                              <Form.Select aria-label="Default select example" value={element?.quantity} onChange={(e: any) => updateCartHandler(element.id, index, +e.target.value)}>
                                {arr.map((val, index) => {
                                  return <option key={index} value={val}>{index + 1}</option>
                                })}
                              </Form.Select>
                            </div>
                          </div>

                          <div className="cart-price-info-container text-right">
                            <div>
                              <span className="cart-item-variant">{(element?.quantity * element.sale_price)}₹</span>
                            </div>
                          </div>

                          <div className="cart-price-info-container text-right">
                            <div>
                              <Button variant="danger" onClick={() => {
                                updateCartHandler(element.id, index, 0)
                              }}>X</Button>
                            </div>
                          </div>

                        </div>
                      </>
                    )
                  })}
                  <div>
                    <div className="d-flex justify-content-end final-total-container">
                      <div>
                        <span className="final-total">Total: {total}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="cart-heading-container">
                      <span className="cart-heading">Payment</span>
                    </div>
                    <div>
                      <span>Payment Method: Cash On Delivery</span>
                    </div>
                  </div>
                  <div>
                    <div className="cart-heading-container">
                      <span className="cart-heading">Address & Checkout</span>
                    </div>
                    <div>
                      <div>
                        <Form.Control
                          as="textarea"
                          placeholder="Add your address here.."
                          style={{ height: '200px' }}

                          onChange={(event: any) => {
                            setAddress(event.target.value)
                          }}

                        />
                      </div>
                      <div className="d-flex justify-content-end checkout-container">
                        <div>
                          <Button variant="primary" onClick={placeOrderHandler}>
                            {
                              isOrderPlacing ?
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                /> :
                                <span>Place Order</span>
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
                :
                <div>
                  <div className="d-flex justify-content-center">
                    <img src="https://i.pinimg.com/736x/81/c4/fc/81c4fc9a4c06cf57abf23606689f7426.jpg" />
                  </div>
                  <div className="empty-container">
                    <div className="d-flex justify-content-center">
                      <span className="empty-cart-text">Your Cart Is Empty</span>
                    </div>
                    <div className="d-flex justify-content-center">
                      <Button variant="primary" onClick={() => { navigate("/") }}>Start Shopping</Button>
                    </div>
                  </div>
                </div>
            }

          </div>
      }
    </div>
  )
};


export default Cart;
