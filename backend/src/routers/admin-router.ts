import { Router } from "express"
import { addProduct, addVariant, listProductsAdmin, editProduct, deleteVariant, getProductDetails, deleteProduct, editVariant } from "../controllers/product-controller"
import { login } from "../controllers/admin-controller"
import { verifyUserToken } from "../middlewares/auth"

const router = Router()

router.post('/login', login)
router.post('/product', verifyUserToken, addProduct)
router.put('/product/:product_id', verifyUserToken, editProduct)
router.get('/product/:product_id', verifyUserToken, getProductDetails)
router.delete('/product/:product_id', verifyUserToken, deleteProduct)
router.post('/variation', verifyUserToken, addVariant)
router.delete('/variation/:variation_id', verifyUserToken, deleteVariant)
router.get('/products', verifyUserToken, listProductsAdmin)
router.put('/variant/:variant_id', verifyUserToken, editVariant)

export default router