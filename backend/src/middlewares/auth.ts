import jwt from "jsonwebtoken"
const AUTH_SECRET = process.env.AUTH_SECRET!
const { USER_AUTH_TOKEN_EXPIRY } = process.env
import { userPayloadInterface, userPayloadRequest } from "../utils/interfaces"
import { RequestHandler, Response, NextFunction } from "express"
import { UNAUTH_ACCESS } from "../utils/responses"

export const createUserAuthToken = (payload: userPayloadInterface) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = jwt.sign(payload, AUTH_SECRET, {
                expiresIn: USER_AUTH_TOKEN_EXPIRY
            })
            return resolve(token)
        } catch (error) {
            return reject(error)            
        }    
    })
}

export const verifyUserToken: RequestHandler = (req: any, res, next) => {
    try {
        const { access_token }: any = req.headers
        if(access_token != null) {
            const { payload }: any = jwt.verify(access_token, AUTH_SECRET)
            req.payload = payload
            return next()
        }
        return res.json(UNAUTH_ACCESS())
    } catch (error) {
        console.log(error)
        res.json(UNAUTH_ACCESS())
    }
}