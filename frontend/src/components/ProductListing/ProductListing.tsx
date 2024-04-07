import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { Spinner, Container, Row, Col } from "react-bootstrap"
import settings from "../../settings"
import { AuthContext } from "../../Context/AuthContext"
import ProductCard from "../ProductCart/ProductCard"
import "./style.scss"

const ProductListing = () => {
    const { SERVER_BASE_URL } = settings
    const [products, setProducts] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const { authToken }: any = useContext(AuthContext)

    const fetchProducts = async () => {
        try {
            setIsFetching(true)
            const { data } = await axios.get(`${SERVER_BASE_URL}/user/products`, {
                headers: {
                    "access_token": authToken
                }
            })
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
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
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