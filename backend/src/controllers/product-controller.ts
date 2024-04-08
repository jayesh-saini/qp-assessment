import { Request, Response, response } from 'express'
import { productSchema, variantSchema, productIdSchema, orderPaylodSchema, updateVariantSchema, variationIdsSchema } from '../middlewares/schema-validation'
import { RESPONSES, BAD_REQ, ISE, SUCCESS } from '../utils/responses'
import { ErrorInterface } from '../utils/interfaces'
import prisma from '../db'

export const addProduct = async (req: Request, res: Response) => {
    try {
        const validated_product = productSchema.safeParse(req.body)
        if (!validated_product.success) {
            console.log(validated_product.error?.issues || validated_product.error)
            return res.json(BAD_REQ())
        }
        const addResp = await prisma.products.create({
            data: {
                name: validated_product.data.name,
                description: validated_product.data.description,
            }
        })

        if (addResp.id > 0) {
            return res.json(SUCCESS({ id: addResp.id }))
        }
        console.log(addResp)
        return res.json(ISE())
    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}

export const addVariant = async (req: Request, res: Response) => {
    try {
        const validated_variant = variantSchema.safeParse(req.body)
        if (!validated_variant.success) {
            console.log(validated_variant.error?.issues || validated_variant.error)
            return res.json(BAD_REQ())
        }
        const addResp = await prisma.variations.create({
            data: {
                name: validated_variant.data.name,
                regular_price: validated_variant.data.regular_price,
                sale_price: validated_variant.data.sale_price,
                stock: validated_variant.data.stock,
                pack_size: validated_variant.data.pack_size,
                unit: validated_variant.data.unit,
                product_id: validated_variant.data.product_id,
                image_url: validated_variant.data?.image_url || ""
            }
        })

        if (addResp.id > 0) {
            return res.json(SUCCESS({ id: addResp.id }))
        }
        console.log(addResp)
        return res.json(ISE())
    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}

export const deleteVariant = async (req: Request, res: Response) => {
    try {
        const parsed_variant_id = productIdSchema.safeParse(+req.params.variation_id)

        if (!parsed_variant_id.success) {
            console.log(parsed_variant_id.error);

            return res.json(BAD_REQ())
        }

        const delete_resp = await prisma.variations.update({
            data: {
                visibility: false
            }, where: {
                id: parsed_variant_id.data,
                visibility: true
            }
        })

        if (delete_resp) {
            return res.json(SUCCESS())
        }
        console.log(delete_resp)
        throw new Error("Can not delete variation!")
    } catch (error: any) {
        if (error.code == "P2025") {
            return res.json(RESPONSES(404, "Variation ID not found!"))
        }
        console.log(error)
        return res.json(ISE())
    }
}

export const listProductsAdmin = async (req: Request, res: Response) => {
    try {
        const products = await prisma.products.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                variations: {
                    select: {
                        id: true,
                        name: true,
                        regular_price: true,
                        sale_price: true,
                        pack_size: true,
                        unit: true,
                        image_url: true,
                        stock: true,
                    }, where: {
                        visibility: true
                    }
                }
            }, where: {
                visibility: true
            }, orderBy: {
                id: "desc"
            }
        })

        return res.json(SUCCESS(products))
    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}

export const listProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.products.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                variations: {
                    select: {
                        id: true,
                        name: true,
                        regular_price: true,
                        sale_price: true,
                        pack_size: true,
                        unit: true,
                        image_url: true,
                        stock: true,
                    }, where: {
                        visibility: true
                    }
                }
            }, where: {
                visibility: true,
                variations: {
                    some: {
                        visibility: true
                    }
                }
            }, orderBy: {
                id: "desc"
            }
        })

        products.map((product: any) => {
            product.variations.map((variant: any) => {
                variant.stock = variant.stock > 0 ? 1 : 0
            })
            return
        })

        return res.json(SUCCESS(products))
    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const validated_product_id = productIdSchema.safeParse(+req.params.product_id)
        if (!validated_product_id.success) {
            return res.json(BAD_REQ())
        }

        await prisma.variations.updateMany({
            data: {
                visibility: false
            }, where: {
                product_id: validated_product_id.data,
                visibility: true
            }
        })

        await prisma.products.update({
            data: {
                visibility: false
            }, where: {
                visibility: true,
                id: validated_product_id.data
            }
        })
        res.json(SUCCESS())
    } catch (error: any) {
        if (error.code == "P2025") {
            return res.json(RESPONSES(404, "Product not found!"))
        }
        console.log(error)
        return res.json(ISE())
    }
}

export const getProductDetails = async (req: Request, res: Response) => {
    try {
        const validated_product_id = productIdSchema.safeParse(+req.params.product_id)
        if (!validated_product_id.success) {
            return res.json(BAD_REQ())
        }
        const product_data = await prisma.products.findUnique({
            select: {
                id: true,
                name: true,
                description: true,
                variations: {
                    select: {
                        id: true,
                        name: true,
                        sale_price: true,
                        regular_price: true,
                        pack_size: true,
                        unit: true,
                        stock: true,
                        image_url: true,
                    }, where: {
                        visibility: true
                    }
                }

            }, where: {
                id: validated_product_id.data,
                visibility: true
            }
        })
        
        if (product_data) {
            res.json(SUCCESS(product_data))
        } else {
            res.json(RESPONSES(404, "Product data not found!"))
        }
    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}

export const editProduct = async (req: Request, res: Response) => {
    try {
        const validated_product_id = productIdSchema.safeParse(+req.params.product_id)
        const validated_product_details = productSchema.safeParse(req.body)

        if (!validated_product_id.success || !validated_product_details.success) {
            console.log(JSON.stringify(validated_product_id))
            console.log(validated_product_details);

            return res.json(BAD_REQ())
        }

        const update_resp = await prisma.products.update({
            data: {
                ...validated_product_details.data
            }, where: {
                id: validated_product_id.data
            }
        })

        res.json(SUCCESS())

    } catch (error) {
        console.log(error)
        return res.json(ISE())
    }
}

export const editVariant = async (req: Request, res: Response) => {
    try {
        const validated_variant_id: any = productIdSchema.safeParse(+req.params.variant_id)
        const update_payload: any = updateVariantSchema.safeParse(req.body)
        if (!validated_variant_id.success || !update_payload.success) {
            console.log(update_payload?.error)
            return res.json(BAD_REQ())
        }

        await prisma.variations.update({
            data: {
                ...update_payload.data
            }, where: {
                id: validated_variant_id.data
            }
        })

        return res.json(SUCCESS())

    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}

export const getMultiProductDetails = async (req: Request, res: Response) => {
    try {
        const variation_ids = variationIdsSchema.safeParse(req.body.variation_ids)

        if (!variation_ids.success) {
            return res.json(BAD_REQ())
        }

        if (variation_ids.data.length == 0) {
            return res.json(SUCCESS([]))
        }

        const variations_data = await prisma.variations.findMany({
            select: {
                id: true,
                name: true,
                sale_price: true,
                regular_price: true,
                image_url: true,
                unit: true,
                pack_size: true
            }, where: {
                visibility: true,
                stock: {
                    gt: 0
                },
                id: {
                    in: variation_ids.data
                }
            }
        })
        return res.json(SUCCESS(variations_data))
    } catch (error) {
        console.log(error)
        return res.json(ISE())
    }
}

export const createOrder = async (req: any, res: Response) => {
    try {
        const user_id = req.payload.id
        const validated_order_payload = orderPaylodSchema.safeParse(req.body)
        if (!validated_order_payload.success) {
            console.log(validated_order_payload.error?.issues || validated_order_payload.error)
            return res.json(BAD_REQ())
        }

        const variant_ids: number[] = validated_order_payload.data.order_items.map((variant) => variant.variant_id)

        const order_resp = await prisma.$transaction(async (txn: any) => {
            const current_quantities = await txn.variations.findMany({
                select: {
                    id: true,
                    name: true,
                    stock: true,
                    sale_price: true
                }, where: {
                    id: {
                        in: variant_ids
                    }, visibility: true
                }
            })

            // Check if variant_id is available or not
            if (current_quantities.length != variant_ids.length) {
                let err: ErrorInterface = {
                    status_code: 1001,
                    message: 'One or more variant is not available'
                }
                throw err
            }

            // Create order
            const order_resp = await txn.orders.create({
                data: {
                    delivery_address: validated_order_payload.data.delivery_address,
                    user_id: user_id,
                    status: 'pending'
                }
            })

            // Check of required quantity of each item are present or not
            for (let variant of current_quantities) {
                const d = validated_order_payload.data.order_items.find((v) => v.variant_id == variant.id)
                if (d) {
                    if (d.quantity > variant.stock) {
                        let err: ErrorInterface = {
                            status_code: 1002,
                            message: `'${variant.name}' is not present in required quantity`
                        }
                        throw err
                    }

                    // Deduct quantities from variations data
                    await txn.variations.update({
                        data: {
                            stock: {
                                decrement: d?.quantity
                            }
                        }, where: {
                            id: d?.variant_id
                        }
                    })

                    // Insert order items
                    await txn.order_items.create({
                        data: {
                            order_id: order_resp.id,
                            variation_id: d?.variant_id,
                            quantity: d?.quantity,
                            price: variant.sale_price
                        }
                    })
                }
            }

            await txn.orders.update({
                data: {
                    status: 'placed'
                }, where: {
                    id: order_resp.id,
                    status: 'pending'
                }
            })

            return order_resp
        })
        return res.json(SUCCESS({ order_id: order_resp.id }))
    } catch (error: any) {
        console.log(error)
        if (error?.status_code) {
            return res.json(RESPONSES(error.status_code, error.message))
        }
        return res.json(ISE())
    }
}

export const listOrders = async (req: any, res: Response) => {
    try {
        const { id } = req.payload

        const order_details:any = await prisma.orders.findMany({
            select: {
                id: true,
                order_items: {
                    select: {
                        price: true,
                        quantity: true,
                        variations: {
                            select: {
                                name: true,
                                image_url: true
                            }
                        }
                    }
                },
                created_at: true
            }, where: {
                user_id: id
            }, orderBy: {
                id: "desc"
            }
        })

        for (let order of order_details) {
            let total = 0
            for (let order_item of order.order_items) {
                total += (order_item.price * order_item.quantity)
                order_item.name = order_item.variations.name
                order_item.image_url = order_item.variations.image_url
                delete order_item.variations
            }
            order.total = total
        }

        return res.json(SUCCESS(order_details))
    } catch (error) {
        console.log(error)
        res.json(ISE())
    }
}