import { Router } from "express"
import { listProducts, createOrder } from "../controllers/product-controller"
import { register, login } from "../controllers/user-controller"
import { verifyUserToken } from "../middlewares/auth"

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/products', verifyUserToken , listProducts)
router.post('/order', verifyUserToken, createOrder)

export default router