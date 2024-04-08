import { Button, Form, Table, ToastContainer, Toast, Modal, Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../Context/interceptor";
import "./Style.scss";

const ProductDetails = () => {
    let { product_id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct]: any = useState({ name: "", description: "" })
    const [newVariant, setNewVariant] = useState({ name: "", regular_price: 0, sale_price: 0, pack_size: 0, unit: "gm", stock: 0, image_url: "", product_id: -1 })
    const [showModel, setShowModel] = useState(false)
    const [showSaveLoader, setShowSaveLoader] = useState(false)
    const [toasterShow, setToasterShow] = useState(false)
    const [toasterMessage, setToasterMessage] = useState({ message: "" })
    const [isVariantAdding, setIsVariantAdding] = useState(false)
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [isVariantDeleting, setIsVariantDeleting] = useState(false)
    const [variantIdToDelete, setVariantIdToDelete] = useState({ id: 0, index: -1 })
    const [isProductDeleting, setIsProductDeleting] = useState(false)
    const [isVariantEditing, setIsVariantEditing] = useState(false)
    const [showProductDeleteConfirmationModal, setShowProductDeleteConfirmationModal] = useState(false)

    const fetchProductData = async () => {
        try {
            const { data } = await api.get(`/admin/product/${product_id}`)

            if (data.status == 200) {
                const variation = data.data.variations.map((v: any) => {
                    v["isDisabled"] = true;
                    return v;
                })
                data.data.variations = variation;
                setProduct(data.data)
                setNewVariant((prevState: any) => ({ ...prevState, product_id: data.data.id }))
            } else {
                alert(data.message)
                navigate('/admin/products')
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    const handleClose = () => setShowModel(false);
    const handleShow = () => setShowModel(true);

    const variantEditableHandler = (index: number, isDisabled: Boolean) => {
        const p = { ...product }
        p.variations[index]["isDisabled"] = isDisabled
        setProduct(p)
    }

    const variantOnChangeHandler = (index: number, key: string, value: any) => {
        const p = { ...product }
        if (["regular_price", "sale_price", "stock", "pack_size"].includes(key)) {
            p.variations[index][key] = parseInt(value)
        } else {
            p.variations[index][key] = value
        }
        setProduct(p)
    }

    const productOnChangeHandler = (key: string, value: any) => {
        const p = { ...product }
        p[key] = value
        setProduct(p)
    }

    const validateUpdateProduct = () => {
        if(!product.name || product.name == "") {
            alert("Name is mandatory!")
            throw new Error("Name is mandatory!")
        } else if (!product.description || product.description == "") {
            alert("Description is mandatory!")
            throw new Error("Description is mandatory!")
        }
    }

    const validateVariantData = (newVar: any) => {
       if(!newVar.name || newVar.name == "") {
            alert("Name is mandatory!")
            throw new Error("Name is mandatory!")
        } else if (!newVar.regular_price || newVar.regular_price < 0) {
            alert("Invalid regular price!")
            throw new Error("Invalid regular price!")
        } else if (!newVar.sale_price || newVar.sale_price < 0) {
            alert("Invalid sale price!")
            throw new Error("Invalid sale price!")
        } else if (!newVar.stock || newVar.stock < 0) {
            alert("Invalid stock!")
            throw new Error("Invalid stock!")
        } else if (!newVar.pack_size || newVar.pack_size < 0) {
            alert("Invalid pack size!")
            throw new Error("Invalid pack size!")
        }
    }

    const updateProductHandler = async () => {
        setShowSaveLoader(true)
        validateUpdateProduct()
        const { data } = await api.put(`/admin/product/${product.id}`, {
            name: product.name,
            description: product.description
        })
        if (data.status) {
            setToasterMessage((prevState: any) => ({ ...prevState, message: "Woohoo, product updated successfully!!" }))
            setToasterShow(true)
            setShowSaveLoader(false)
        }
    }

    const updateVariantHandler = async (updatePayload: any, index: number) => {
        try {
            setIsVariantEditing(true)
            const { id, isDisabled, ...variant } = updatePayload
            
            validateVariantData(variant)
            
            const { data } = await api.put(`/admin/variant/${id}`, {
                ...variant
            })

            if (data.status == 200) {
                variantEditableHandler(index, true)
                setToasterShow(true)
                setToasterMessage((prevState: any) => ({ ...prevState, message: "Variant updated successfully!!" }))
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsVariantEditing(false)
        }
    }

    const addVariantHandler = async () => {
        try {
            setIsVariantAdding(true)
console.log(newVariant);

            validateVariantData(newVariant)

            const { data } = await api.post(`/admin/variation`, {
                ...newVariant
            })

            if (data.status == 200) {
                setToasterShow(true)
                setToasterMessage((prevState: any) => ({ ...prevState, message: "Variant added successfully!!" }))
                setShowModel(false)
                const p = { ...product }
                p.variations.push({ ...newVariant, isDisabled: true, id: data.data.id })
                setProduct(p)
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsVariantAdding(false)
        }
    }

    const deleteVariantHandler = async () => {
        try {
            setIsVariantDeleting(true)
            const { data } = await api.delete(`/admin/variation/${variantIdToDelete.id}`)
            if (data.status == 200) {
                setToasterShow(true)
                setToasterMessage((prevState: any) => ({ ...prevState, message: "Variant deleted successfully!!" }))
                setShowDeleteConfirmationModal(false)
                setVariantIdToDelete({ id: 0, index: -1 })
                setShowModel(false)
                const p = { ...product }
                p.variations.splice(variantIdToDelete.index, 1)
                setProduct(p)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsVariantDeleting(false)
        }
    }

    const deleteProductHandler = async () => {
        try {
            setIsProductDeleting(true)
            const { data } = await api.delete(`/admin/product/${product.id}`)

            if (data.status == 200) {
                setToasterShow(true)
                setToasterMessage((prevState: any) => ({ ...prevState, message: "Product deleted successfully!!" }))
                setShowProductDeleteConfirmationModal(false)
                setShowModel(false)
                navigate("/admin/products")
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsProductDeleting(false)
        }
    }

    return (
        <div className="product-details-container">
            <ToastContainer className="p-4" position='top-end'>
                <Toast onClose={() => setToasterShow(false)} show={toasterShow} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>{toasterMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Modal centered show={showDeleteConfirmationModal} onHide={() => { setShowDeleteConfirmationModal(false) }} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Delete variant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Do you really want to delete this variant ?</Form.Label>
                                <div>
                                    <Button variant="danger" className="m-2" onClick={deleteVariantHandler}>
                                        {!isVariantDeleting ? <span>Delete</span> :
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
                                    <Button variant="primary" onClick={() => { setShowDeleteConfirmationModal(false) }}>Cancle</Button>
                                </div>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal centered show={showProductDeleteConfirmationModal} onHide={() => { setShowProductDeleteConfirmationModal(false) }} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Do you really want to delete this delete ?</Form.Label>
                                <div>
                                    <Button variant="danger" className="m-2" onClick={deleteProductHandler}>
                                        {!isProductDeleting ? <span>Delete</span> :
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
                                    <Button variant="primary" onClick={() => { setShowDeleteConfirmationModal(false) }}>Cancle</Button>
                                </div>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal centered show={showModel} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Variant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="d-flex justify-content-center">
                            {newVariant.image_url ? <img className="variant-thumbnail" src={newVariant.image_url} /> : ""}
                        </div>
                        <div>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control onChange={(e) => setNewVariant((prevState: any) => ({ ...prevState, name: e.target.value }))} type="text" autoFocus />
                            </Form.Group>
                        </div>
                        <div className="flexRowContainer">
                            <Form.Group className="mb-3 flex-fill" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Regular Price</Form.Label>
                                <Form.Control onChange={(e) => {
                                    setNewVariant((prevState: any) => ({ ...prevState, regular_price: parseInt(e.target.value) }))
                                }
                                } type="number" />
                            </Form.Group>
                            <Form.Group className="mb-3 flex-fill odd-form-group" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Sale Price</Form.Label>
                                <Form.Control onChange={(e) => setNewVariant((prevState: any) => ({ ...prevState, sale_price: parseInt(e.target.value) }))} type="number" />
                            </Form.Group>
                        </div>
                        <div className="flexRowContainer d-flex">
                            <Form.Group className="mb-3 flex-fill" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Pack Size</Form.Label>
                                <Form.Control onChange={(e) => setNewVariant((prevState: any) => ({ ...prevState, pack_size: parseInt(e.target.value) }))} type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3 flex-fill odd-form-group" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Unit</Form.Label>
                                <Form.Select value={newVariant.unit} onChange={(e) => {
                                    setNewVariant((prevState: any) => ({ ...prevState, unit: e.target.value }))
                                }}>
                                        <option value="gm">gm</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Ltr">Ltr</option>
                                        <option value="ml">ml</option>
                                        <option value="Pack">Pack</option>
                                        <option value="Piece">Piece</option>
                                        <option value="Box">Box</option>
                                </Form.Select>
                                {/* <Form.Control onChange={(e) => setNewVariant((prevState: any) => ({ ...prevState, unit: e.target.value }))} type="text" /> */}
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control onChange={(e) => setNewVariant((prevState: any) => ({ ...prevState, stock: parseInt(e.target.value) }))} type="number" />
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control onChange={(e) => setNewVariant((prevState: any) => ({ ...prevState, image_url: e.target.value }))} type="text" />
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={addVariantHandler}>
                        {!isVariantAdding ? <span>Add</span> :
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
            </Modal >
            <div className="flexRowBWContainer p-4 product-details-header">
                <div className="flex-fill">
                    <Form>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" placeholder="" value={product.name} onChange={(e) => { productOnChangeHandler("name", e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Control as="textarea" rows={5} value={product.description} onChange={(e) => { productOnChangeHandler("description", e.target.value) }} />
                        </Form.Group>
                    </Form>
                </div>
                <div className="button-controls-container">
                    <div className="d-flex">
                        <Button variant="success" onClick={updateProductHandler} className="flex-fill" disabled={showSaveLoader}>{showSaveLoader ? "Loading.." : "Save"}</Button>
                    </div>
                    <div>
                        <Button className="mt-3" variant="danger" onClick={() => {
                            setShowProductDeleteConfirmationModal(true)
                        }}>Delete Product</Button>
                    </div>
                    <div>
                        <Button className="mt-3" onClick={handleShow}>Add Variant</Button>
                    </div>
                </div>
            </div>
            <div className="p-4">
                {product.variations?.length == 0 ? <span>No Variations to display!</span> :
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Thumbnail</th>
                                <th>Name</th>
                                <th>Regular Price</th>
                                <th>Sale Price</th>
                                <th>Pack Size</th>
                                <th>Unit</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                product.variations?.map((variant: any, index: number) => {
                                    return (
                                        <tr className="table-row" key={index}>
                                            <td><img src={variant.image_url} className="variant-thumbnail" /></td>
                                            <td><Form.Control type="text" onChange={(e) => { variantOnChangeHandler(index, "name", e.target.value) }} value={variant.name} disabled={variant.isDisabled} /></td>
                                            <td><Form.Control type="text" onChange={(e) => { variantOnChangeHandler(index, "regular_price", e.target.value) }} value={variant.regular_price} disabled={variant.isDisabled} /> {variant.isDisabled}</td>
                                            <td><Form.Control type="text" onChange={(e) => { variantOnChangeHandler(index, "sale_price", e.target.value) }} value={variant.sale_price} disabled={variant.isDisabled} /></td>
                                            <td><Form.Control type="text" onChange={(e) => { variantOnChangeHandler(index, "pack_size", e.target.value) }} value={variant.pack_size} disabled={variant.isDisabled} /></td>
                                            <td><Form.Control type="text" onChange={(e) => { variantOnChangeHandler(index, "unit", e.target.value) }} value={variant.unit} disabled={variant.isDisabled} /></td>
                                            <td><Form.Control type="text" onChange={(e) => { variantOnChangeHandler(index, "stock", e.target.value) }} value={variant.stock} disabled={variant.isDisabled} /></td>
                                            <td className="flexRowContainer">
                                                <Button variant="primary" hidden={!variant.isDisabled} onClick={() => { variantEditableHandler(index, false) }}>Edit</Button>
                                                <Button variant="success" onClick={() => {
                                                    updateVariantHandler(variant, index)
                                                }} hidden={variant.isDisabled}>{isVariantEditing ? (
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
                                                ) : "Save"}</Button>
                                                <Button variant="danger" onClick={() => {
                                                    setVariantIdToDelete({ id: variant.id, index: index });
                                                    setShowDeleteConfirmationModal(true)
                                                }
                                                }>Delete</Button>
                                            </td>
                                        </tr>

                                    )
                                })
                            }
                        </tbody>
                    </Table>
                }
            </div>
        </div >
    )
}

export default ProductDetails