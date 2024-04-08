import { Request, Response } from 'express'
import { adminCredsSchema } from '../middlewares/schema-validation'
import { RESPONSES, BAD_REQ, ISE, SUCCESS } from '../utils/responses'
import { createUserAuthToken } from "../middlewares/auth"
import bcrypt from "bcrypt"
import prisma from '../db'

export const login = async(req: Request, res: Response) => {
    try {
        const validated_admin_creds = adminCredsSchema.safeParse(req.body)
        if(!validated_admin_creds.success) {
            return res.json(BAD_REQ())
        }

        const admin_details = await prisma.admins.findFirst({
            where: {
                username: validated_admin_creds.data.username
            }
        })

        if(!admin_details) {
            return res.json(RESPONSES(400, "Incorrect username or password!"))            
        }

        if(validated_admin_creds) {
            if(!bcrypt.compareSync(validated_admin_creds.data.password, admin_details?.password))  {
                return res.json(RESPONSES(400, "Incorrect username or password!"))
            }
            const { password, ...admin } = admin_details
            const access_token = await createUserAuthToken({...admin, role: "admin"})
            return res.json(SUCCESS({ admin, access_token }))
        }
        return res.json(RESPONSES(400, "Incorrect username or password!"))
    } catch (error) {
        console.log(error)        
        return res.json(ISE())
    }
}