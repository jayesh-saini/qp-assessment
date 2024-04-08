import { useContext, useState } from "react"
import { AuthContext } from "../../Context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Form, Button, Spinner } from 'react-bootstrap';
import api from "../../Context/interceptor";
import "./sytle.scss"
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
    const [creds, setCreds]: any = useState({})
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [showAdminCreds, setShowAdminCreds] = useState(true)
    const navigate = useNavigate()
    const { setAuthToken, setRole }: any = useContext(AuthContext)

    const validateLoginForm = () => {
        if (!creds.username || creds.username == "") {
            alert("username is mandatory!")
            throw new Error("Email is mandatory!")
        } else if (!creds.password || creds.password == "") {
            alert("Invalid Password!")
            throw new Error("Invalid Password!")
        }
    }

    const loginHandler = async () => {
        try {
            setIsLoggingIn(true)

            validateLoginForm()

            const { data } = await api.post(`/admin/login`, {
                ...creds
            })

            if (data.status == 200) {
                localStorage.setItem("access_token", data.data.access_token)
                let token: any = jwtDecode(data.data.access_token)
                setRole(token?.role)
                setAuthToken(data.data.access_token)
                navigate("/admin/products")
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoggingIn(false)
        }
    }

    return (
        <div className='auth-main-container'>
            <div className="d-flex justify-content-center" >
                <Form className='login-form-container'>
                    <h1 className='text-center'>Admin Login</h1>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="gangadhar" onChange={(e) => { setCreds((prevState: any) => ({ ...prevState, username: e.target.value })) }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="********" onChange={(e) => { setCreds((prevState: any) => ({ ...prevState, password: e.target.value })) }} />
                    </Form.Group>
                    <div>
                        <Button variant="link" onClick={() => {
                            setShowAdminCreds(!showAdminCreds)
                        }}>hint?</Button>
                    </div>
                    <div hidden={showAdminCreds}>
                        <div>
                            <span>🚨DEMO PROJECT🚨</span>
                        </div>
                        <div>
                            <span><b>username</b>: admin</span>
                        </div>
                        <div>
                            <span><b>password</b>: admin123</span>
                        </div>
                    </div>
                    <Button onClick={loginHandler}>{!isLoggingIn ? <span>Login</span> :
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
                </Form>
            </div>
        </div>
    );
}

export default AdminLogin