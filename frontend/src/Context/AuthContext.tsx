import { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
    role: null,
    setRole: () => {},
    authToken: null,
    setAuthToken: ({}) => {}
})

// export const useAuth = () => {
//     return useContext(AuthContext)
// }

export const AuthProvider = (props: any) => { 
    const [role, setRole]:any = useState(null)
    const [authToken, setAuthToken]:any = useState(null)

    const value = {
        role,
        setRole,
        authToken,
        setAuthToken
    }

    useEffect(() => {
        try {
            const token: any = localStorage.getItem("access_token")

            if(token) {
                setAuthToken(token)
                let decoded_token:any = jwtDecode(token)
                                
                setRole(decoded_token?.role)
            }
        } catch (error) {
            localStorage.removeItem("access_token")            
        }
    }, [])

    return (
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
    )
}