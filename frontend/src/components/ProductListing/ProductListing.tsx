import { useEffect, useState } from "react"
import { Spinner, Container, Row, Col } from "react-bootstrap"
import ProductCard from "../ProductCart/ProductCard"
import "./style.scss"
import api from "../../Context/interceptor"

const ProductListing = () => {
    const [products, setProducts] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    
    const fetchProducts = async () => {
        try {
            setIsFetching(true)
            const { data } = await api.get(`/user/products`,)
            if (data.status == 200) {
                const localCart = JSON.parse(localStorage.getItem("cart") || "{}")
                const prods = data.data.map((p: any) => {
                    p.selected_index = p.variations.length > 0 ? 0 : -1
                    p.variations.map((v: any) => {
                        v.selected_quantity = localCart[v.id] || 0
                        return v
                    })
                    return p
                })                
                setProducts(prods)
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className="p-5"> {
            isFetching ?
                (<>
                    <div className="spinner-container">
                    <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                    </div>
                </>)
                :
                <Container>
                    <Row>
                        {products.map((product: any, index: number) => {
                            return <Col key={index} sm={6} md={3} lg={3}>
                                <ProductCard prod={product}/>
                            </Col>
                        })}
                    </Row>
                </Container>
        }
        </div>
    )
}

export default ProductListing