export interface ErrorInterface {
    status_code: number,
    message: string,
    internal_message? :string
}

export interface userPayloadInterface {
    full_name: string,
    email: string,
    contact: string
}

export interface userPayloadRequest extends Request {
    payload: any
}