import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import settings from '../../settings';
import { Link } from "react-router-dom";
import "./sytle.scss"

const Register = () => {
    const { SERVER_BASE_URL } = settings
    const [user, setUser] = useState({})
    const [isRegistering, setIsRegistering] = useState(false)

    const registerHandler = async () => {
        try {
            setIsRegistering(true)

            const { data } = await axios.post(`${SERVER_BASE_URL}/user/register`, {
                ...user
            })

            if (data.status == 200) {
                alert(data.message)

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