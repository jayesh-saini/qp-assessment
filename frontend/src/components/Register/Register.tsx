import { useState } from 'react';
import { Form, Button, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import api from '../../Context/interceptor';
import "./sytle.scss"

const Register = () => {
    const [user, setUser]: any = useState({})
    const [isRegistering, setIsRegistering] = useState(false)
    const [toasterShow, setToasterShow] = useState(false)
    const [toasterMessage, setToasterMessage] = useState({ message: "" })

    const navigate = useNavigate()

    const validateRegisterForm = () => {
        if (!user.full_name || user.full_name == "") {
            alert("Name is mandatory!")
            throw new Error("Name is mandatory!")
        } else if (!user.email || user.email == "") {
            alert("Email is mandatory!")
            throw new Error("Email is mandatory!")
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            alert("Invalid Email!")
            throw new Error("Invalid Email!")
        } else if (!user.password || user.password.length < 8) {
            alert("Password should be minimum 8 chars long!")
            throw new Error("Password should be minimum 8 chars long!")
        } else if (!user.contact || user.contact.length != 10) {
            alert("Invalid mobile number")
            throw new Error("Invalid mobile number")
        }
    }

    const registerHandler = async () => {
        try {
            setIsRegistering(true)

            validateRegisterForm()

            const { data } = await api.post(`/user/register`, {
                ...user
            })

            if (data.status == 200) {
                setToasterShow(true)
                setToasterMessage({message: "Registered Successfully!"})
                setTimeout(() => {
                    navigate("/login")
                }, 2500)
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <div className='auth-main-container'>
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
            <div className="d-flex justify-content-center" >
                <Form className='register-form-container'>
                    <h1 className='text-center'>Register</h1>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" placeholder="Shaktiman" onChange={(e) => { setUser((prevState: any) => ({ ...prevState, full_name: e.target.value })) }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="shaktiman@example.com" onChange={(e) => { setUser((prevState: any) => ({ ...prevState, email: e.target.value })) }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Label>Contact</Form.Label>
                        <Form.Control type="text" placeholder='9999999999' onChange={(e) => { setUser((prevState: any) => ({ ...prevState, contact: e.target.value })) }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="********" onChange={(e) => { setUser((prevState: any) => ({ ...prevState, password: e.target.value })) }} />
                    </Form.Group>
                    <Button onClick={registerHandler}>{!isRegistering ? <span>Register</span> :
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
                    }</Button>
                    <div className='p-2'>
                        <span>Already have an account? <Link to={"/login"}>Login here</Link></span>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Register