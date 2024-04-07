import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import settings from "../../settings"
import Spinner from 'react-bootstrap/Spinner';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import '../Header/Style.scss';
import "./Style.scss"
// import { useAuth } from '../../Context/AuthContext';

import axios from "axios"

const Products = () => {
    // const { user } = useAuth()

    const navigate = useNavigate()
    const { SERVER_BASE_URL } = settings
    const [show, setShow] = useState(false)
    const [testerShow, setToasterShow] = useState(false)
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProductAdding, setIsProductAdding] = useState(false)
    const [product, setProduct] = useState({ name: "", desription: "" })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchProductsHandler = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`${SERVER_BASE_URL}/admin/products`)
            if (data.status == 200) {
                setProducts(data.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const addProductHander = async () => {
        try {
            setIsProductAdding(true)
            const { data } = await axios.post(`${SERVER_BASE_URL}/admin/product`, {
                ...product
            })
            
            if (data.status == 200) {
                setShow(false)
                setToasterShow(true)
                fetchProductsHandler()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsProductAdding(false)
        }
    }

    useEffect(() => {
        fetchProductsHandler()
    }, [])

    return (
        <div className='product-main-container'>
            <div className='flexRowBWContainer pb-3'>
                <div className="flexRowContainer logo-container">
                    <span className='page-name'>Products</span>
                </div>
                <div className='logout-button-container'>
                    <Button onClick={handleShow} variant="primary" className='flexRowContainer d-flex'>
                        <span>Add Product</span>
                    </Button>
                </div>
            </div>

            <div className='product-table-container'>
                {isLoading ?
                    <div className='d-flex justify-content-center'>
                        <Spinner className='spinner' animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Variation Count</th>
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((product: any, index: number) => {
                                    return (
                                        <tr onClick={() => {
                                            navigate(`/admin/product/${product.id}`, {
                                                state: { product }
                                            })
                                        }} key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.name}</td>
                                            <td>{product.description.length > 100 ? product.description.substring(0, 100).trim() + "..." : product.description}</td>
                                            <td>{product.variations?.length}</td>
                                            {/* <td className='flexRowContainer'>
                                                <Button variant="warning">Warning</Button>{' '}
                                                <Button variant="danger">Danger</Button>{' '}
                                            </td> */}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                }
            </div>
            <Modal centered show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={(e) => setProduct((prevState: any) => ({ ...prevState, name: e.target.value }))}
                                type="text"
                                placeholder="Parle-G Biscuit"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={10} onChange={(e) => setProduct((prevState: any) => ({ ...prevState, description: e.target.value }))} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={addProductHander}>
                        {!isProductAdding ? <span>Add</span> :
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="visually-hidden">Loading...</span>
                            </>
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer className="p-4" position='top-end'>
                <Toast onClose={() => setToasterShow(false)} show={testerShow} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>Woohoo, product added successfully!!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default Products