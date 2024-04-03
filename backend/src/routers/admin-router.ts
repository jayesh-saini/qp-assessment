import { Router } from "express"
import { addProduct, addVariant, listProductsAdmin, editProduct, deleteVariant, getProductDetails, deleteProduct, editVariant } from "../controllers/product-controller"

const router = Router()

router.post('/product', addProduct)
router.put('/product/:product_id', editProduct)
router.get('/product/:product_id', getProductDetails)
router.delete('/product/:product_id', deleteProduct)
router.post('/variation', addVariant)
router.delete('/variation/:variation_id', deleteVariant)
router.get('/products', listProductsAdmin)
router.put('/variant/:variant_id', editVariant)

export default router