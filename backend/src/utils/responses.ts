export const RESPONSES = (status: number, message: string, data = null) => {
    return data == null ?  {status, message } : {status, message, data }
}

export const SUCCESS = (data?: any) => {
    return {
        status: 200, 
        message: "Success",
        data
    }
}

export const ISE = () => {
    return {
        status: 500,
        message: "Internal Server Error!"
    }
}

export const BAD_REQ = () => {
    return {
        status: 400,
        message: "Bad Request"
    }
}

export const UNAUTH_ACCESS = () => {
    return {
        status: 401,
        message: "Unauthorised Access"
    }
}