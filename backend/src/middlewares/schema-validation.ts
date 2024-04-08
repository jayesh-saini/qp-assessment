import zod from 'zod'

export const productIdSchema = zod.number().positive()

export const productSchema = zod.object({
    name: zod.string().trim().min(1).max(100),
    description: zod.string().trim().min(1)
})

export const variantSchema = zod.object({
    name: zod.string().trim().min(1).max(100),
    regular_price: zod.number().positive(),
    sale_price: zod.number().positive(),
    stock: zod.number().int().positive(),
    pack_size: zod.number().int().positive(),
    unit: zod.string().max(10),
    product_id: zod.number().int().positive(),
    image_url: zod.string().max(190).optional()
})

export const updateVariantSchema = zod.object({
    name: zod.string().trim().min(1).max(100),
    regular_price: zod.number().positive(),
    sale_price: zod.number().positive(),
    stock: zod.number().int().min(0).max(999999),
    pack_size: zod.number().int().positive(),
    unit: zod.string().max(10),
    image_url: zod.string().max(190).optional()
}) 

export const orderPaylodSchema = zod.object({
    order_items: zod.array(zod.object({
        variant_id: zod.number().int().positive(),
        quantity: zod.number().int().positive()
    })),
    delivery_address: zod.string().trim().min(1).max(190)
})

export const userSchema = zod.object({
    full_name: zod.string().trim().min(1).max(100),
    email: zod.string().trim().email().max(50),
    password: zod.string().trim().min(8).max(50),
    contact: zod.string().trim().min(10).max(10)
})

export const userCredsSchema = zod.object({
    email: zod.string().email().max(100),
    password: zod.string().max(50)
})

export const adminCredsSchema = zod.object({
    username: zod.string().max(100),
    password: zod.string().max(50)
})

export const variationIdsSchema = zod.array(
    zod.number().int().positive()
)