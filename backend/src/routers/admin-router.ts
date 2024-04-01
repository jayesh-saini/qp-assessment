import { Router } from "express"
import { addProduct, addVariant, listProducts, editProduct } from "../controllers/product-controller"

const router = Router()

router.post('/product', addProduct)
router.put('/product/:product_id', editProduct)
router.post('/variation', addVariant)
router.get('/products', listProducts)

export default router