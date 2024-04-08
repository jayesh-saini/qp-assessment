import { useContext, useState } from "react"
import { AuthContext } from "../../Context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Form, Button, Spinner } from 'react-bootstrap';
import api from "../../Context/interceptor";
import "./sytle.scss"
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [creds, setCreds]: any = useState({})
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const navigate = useNavigate()
    const { setAuthToken, setRole }: any = useContext(AuthContext)

    const validateLoginForm = () => {
        if(!creds.email || creds.email == "") {
            alert("Email is mandatory!")
            throw new Error("Email is mandatory!")
        } else if(!/\S+@\S+\.\S+/.test(creds.email)) {
            alert("Invalid Email!")
            throw new Error("Invalid Email!")
        } else if (!creds.password || creds.password == "") {
            alert("Invalid Password!")
            throw new Error("Invalid Password!")
        }
    }

    const loginHandler = async () => {
        try {
            setIsLoggingIn(true)

            validateLoginForm()

            const { data } = await api.post(`/user/login`, {
                ...creds
            })

            if (data.status == 200) {
                localStorage.setItem("access_token", data.data.access_token)
                let token:any = jwtDecode(data.data.access_token)
                setRole(token?.role)
                setAuthToken(data.data.access_token)
                navigate("/")
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
                    <h1 className='text-center'>Login</h1>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="shaktiman@example.com" onChange={(e) => { setCreds((prevState: any) => ({ ...prevState, email: e.target.value })) }} />
                    </Form.Group>
                   <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="********" onChange={(e) => { setCreds((prevState: any) => ({ ...prevState, password: e.target.value })) }} />
                    </Form.Group>
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
                    <div className='p-2'>
                        <span>Don't have an account? <Link to={"/register"}>Register here</Link></span>
                    </div>
                    <div className='p-2'>
                        <Link to={"/admin/login"}>Login as admin</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Login