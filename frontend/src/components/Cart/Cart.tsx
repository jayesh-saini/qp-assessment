import axios from "axios";
import { useContext, useEffect, useState } from "react";
import settings from "../../settings";
import { AuthContext } from "../../Context/AuthContext"

const Cart = () => {
  const { SERVER_BASE_URL } = settings
  const { authToken }: any = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [isFetchingVariationsData, setIsFetchingVariationsData] = useState(false)

  const fetchVariationsData = async (variation_ids: any) => {
    try {
      setIsFetchingVariationsData(true)

      const { data } = await axios.post(`${SERVER_BASE_URL}/user/variations`, {
        variation_ids
      }, {
        headers: {
          "access_token": authToken
        }
      })

      if (data.status == 200) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "{}")

        const variants = data.data.map((variant: any) => {
          return { ...variant, quantity: localCart[variant.id]}
        })

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

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "{}")

    let variation_ids = []
    for (let id in localCart) {
      variation_ids.push(+id)
    }

    fetchVariationsData(variation_ids)
  }, [])

  return (
    <div>
      {cartItems.length == 0 ? 
        <span>No items present in cart 🛒!</span> :
        cartItems.map((variant: any) => {
          return <div>
            <p>{variant.name}</p>
            <p style={{textDecoration: "line-through"}}>{variant.regular_price}</p>
            <p>{`${variant.sale_price} x ${variant.quantity} = ${variant.sale_price * variant.quantity}`}</p>
          </div>
        })
      }
    </div>
  );
};


export default Cart;
