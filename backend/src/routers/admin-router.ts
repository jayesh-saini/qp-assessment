import { Router } from "express"
import { addProduct, addVariant, listProductsAdmin, editProduct, deleteVariant, getProductDetails } from "../controllers/product-controller"

const router = Router()

router.post('/product', addProduct)
router.put('/product/:product_id', editProduct)
router.get('/product/:product_id', getProductDetails)
router.post('/variation', addVariant)
router.delete('/variation/:variation_id', deleteVariant)
router.get('/products', listProductsAdmin)

export default router