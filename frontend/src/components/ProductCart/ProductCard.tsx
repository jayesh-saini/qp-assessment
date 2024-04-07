import { Card, Button, Dropdown, DropdownButton } from "react-bootstrap";
import "./style.scss"
import { useState } from "react";

function ProductCard({ prod }: any) {
    const [product, setProduct] = useState(prod)

    const updateLocalCartHandler = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "{}")
        if (product.variations[product.selected_index].selected_quantity > 0) {
            cart[product.variations[product.selected_index].id] = product.variations[product.selected_index].selected_quantity
        } else {
            delete cart[product.variations[product.selected_index].id]
        }
        localStorage.setItem("cart", JSON.stringify(cart))
    }

    const addToCartHandler = () => {
        const p = { ...product }
        p.variations[product.selected_index].selected_quantity = p.variations[product.selected_index].selected_quantity >= 10 ? 10 : p.variations[product.selected_index].selected_quantity + 1
        setProduct(p)
        updateLocalCartHandler()
    }

    const removeFromCartHandler = () => {
        const p = { ...product }
        p.variations[product.selected_index].selected_quantity = p.variations[product.selected_index].selected_quantity <= 0 ? 0 : p.variations[product.selected_index].selected_quantity - 1
        setProduct(p)
        updateLocalCartHandler()
    }

    return (
        <Card className="m-2" key={product.id}>
            <Card.Img variant="top" height="250px" width="100px" src={product.variations[product.selected_index]?.image_url} />
            <Card.Body>
                <div className="product-title">
                    <Card.Title>{product.name}</Card.Title>
                </div>
                <Card.Text style={{ height: "120px" }}>{product.description?.substring(0, 100)?.trim() + "..."}</Card.Text>
                <div className="m-2 cart-button">
                    <div>
                        <DropdownButton title={`${product.variations[product.selected_index].pack_size} - ${product.variations[product.selected_index].unit}`} variant="primary">
                            {product.variations.map((variant: any, index: number) => {
                                return (
                                    <Dropdown.Item key={variant.id} onClick={() => {
                                        setProduct((prevState: any) => ({ ...prevState, selected_index: index }))
                                    }}>{`${variant.pack_size} - ${variant.unit}`}</Dropdown.Item>
                                )
                            })}
                        </DropdownButton>
                    </div>
                </div>
                <span style={{ marginLeft: "2px", fontWeight: "bold", fontSize: "16px" }}>{product.variations[product.selected_index].sale_price}₹</span>
                <span style={{ textDecoration: "line-through", marginLeft: "8px", fontSize: "13px" }}>{product.variations[product.selected_index].regular_price}₹</span>
                {product.variations[product.selected_index].selected_quantity > 0 ? <div className="d-flex align-items-center">
                    <Button className="flex-1 m-2" style={{ borderRadius: "10px" }} onClick={removeFromCartHandler}>-</Button>
                    <span className="flex-4 text-center" style={{ padding: "6px 0px", border: "solid #ccc", borderRadius: "10px" }}>{product.variations[product.selected_index]?.selected_quantity}</span>
                    <Button className="flex-1 m-2" style={{ borderRadius: "10px" }} onClick={addToCartHandler}>+</Button>
                </div> :
                    <div className="d-flex">
                        <div className="flex-1 m-1">
                            { product.variations[product.selected_index].stock ?
                                <Button variant="primary" className="cart-button" onClick={addToCartHandler} >Add</Button> :
                                <Button variant="danger" disabled className="cart-button">Out of Stock</Button>
                            }
                        </div>
                    </div>}
            </Card.Body>
        </Card>
    );
}


export default ProductCard