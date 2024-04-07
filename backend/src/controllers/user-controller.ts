import { Request, Response, response } from 'express'
import { userSchema, userCredsSchema } from '../middlewares/schema-validation'
import { RESPONSES, BAD_REQ, ISE, SUCCESS } from '../utils/responses'
import { createUserAuthToken } from "../middlewares/auth"
import { ErrorInterface } from '../utils/interfaces'
import bcrypt from "bcrypt"
import prisma from '../db'

export const register = async(req: Request, res: Response) => {
    try {
        const validated_user = userSchema.safeParse(req.body)
        if(!validated_user.success) {
            return res.json(BAD_REQ())
        }

        validated_user.data.password = bcrypt.hashSync(validated_user.data.password, 10)

        await prisma.users.create({
            data: {
                ...validated_user.data
            }
        })

        return res.json(SUCCESS())
    } catch (error: any) {
        if(error.code == "P2002") {
            return res.json(RESPONSES(409, "Email already registered!"))
        }
        console.log(error)
        res.json(ISE())
    }
}

export const login = async(req: Request, res: Response) => {
    try {
        const validated_user_creds = userCredsSchema.safeParse(req.body)
        if(!validated_user_creds.success) {
            return res.json(BAD_REQ())
        }

        const user_details = await prisma.users.findUnique({
            where: {
                email: validated_user_creds.data.email
            }
        })

        if(!user_details) {
            return res.json(RESPONSES(400, "Email not registered or password is incorrect!"))            
        }

        if(validated_user_creds) {
            if(!bcrypt.compareSync(validated_user_creds.data.password, user_details?.password))  {
                return res.json(RESPONSES(400, "Email not registered or password is incorrect!"))
            }
            const { password, ...user } = user_details
            const access_token = await createUserAuthToken({...user, role: "user"})
            return res.json(SUCCESS({ user, access_token }))
        }
        return res.json(RESPONSES(400, "Email not registered or password is incorrect!"))
    } catch (error) {
        console.log(error)        
        return res.json(ISE())
    }
}