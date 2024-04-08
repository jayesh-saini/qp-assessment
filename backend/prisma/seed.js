const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")

const seed_db = async () => {

    const data = await prisma.products.findMany({})

    if(data.length > 0) {
        return
    }

    await prisma.admins.create({
        data: {
            username: "admin",
            password: bcrypt.hashSync("admin123", 10)
        }
    })

    const products = [
        {
            "name": "Nescafe Classic Instant Coffee Powder",
            "description": "To take your coffee experiences to the next level, Nescafe, the world's favourite instant coffee brand, brings forth a rich and aromatic coffee in the form of Nescafe Classic. The unmistakable flavour of Nescafe Classic is what makes this signature coffee so loved all over the world. Start your day right with the first sip of this classic 100% pure coffee and let the intense taste and wonderfully refreshing aroma of Nescafe instant coffee awaken your senses to new opportunities. With over 75 years of experience and working with coffee farmers, to help them grow more sustainable coffee through improved crop techniques, we deliver the best coffee produced by the best selecting, roasting and blending methods.",
            "variations": [
                {
                    "name": "Nescafe Classic Instant Coffee Powder 45 g Dawn Jar",
                    "regular_price": 175,
                    "sale_price": 160,
                    "pack_size": 45,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/267381_8-nescafe-classic-100-pure-instant-coffee.jpg",
                    "stock": 85
                },             {
                    "name": "Nescafe Classic Instant Coffee Powder 100 gm ",
                    "regular_price": 350,
                    "sale_price": 330,
                    "pack_size": 100,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/267381_8-nescafe-classic-100-pure-instant-coffee.jpg",
                    "stock": 20
                }
            ]
        },
        {
            "name": "Glucon-D Instant Energy Health Drink",
            "description": "Summers can be daunting and especially when there's an enormous scorching sun always ready to drain out your energy and stop you from being the best of you. But thank god there is Glucon-D! Glucon-D contains glucose that helps replenish body glucose and fills you with the energy required to stay active. It is easily absorbed by the body, thus giving out an instant energy boost and refreshment.\n\nEnriched with Vitamin-C and Minerals, including Calcium and Phosphorus, this glucose drink helps charge you up to fight tiredness and promotes mental alertness. What's better? Added Orange flavour makes it loved by children as well as adults. Add Glucon-D to a glass of water every day to provide growing active children with the energy that keeps them going and adults, refreshment after a long day.",
            "variations": [
                {
                    "name": "Glucon-D Instant Energy Health Drink 1Kg",
                    "regular_price": 380,
                    "sale_price": 330,
                    "pack_size": 1,
                    "unit": "kg",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/40164541_9-glucon-d-glucose-based-beverage-mix-orange.jpg",
                    "stock": 16
                },            {
                    "name": "Glucon-D Instant Energy Health Drink 500 gm",
                    "regular_price": 200,
                    "sale_price": 180,
                    "pack_size": 500,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/40164541_9-glucon-d-glucose-based-beverage-mix-orange.jpg",
                    "stock": 0
                }
            ]
        },
        {
            "name": "Cadbury Bournvita",
            "description": "Cadbury Bournvita Chocolate Nutrition Drink is a scientifically designed formula, crafted by nutritionists with a bundle of nutrients that are known to support Physical strength (Calcium, Vitamin D and Magnesium are known to maintain Bone and Muscle health); Mental Strength (Iron, Iodine and Zinc which help in normal cognitive functions); Immune strength (Vitamin C, Vitamin D, Zinc and Iron to support the immune functions). Thus, supporting strength and providing high energy. 2 servings of Bournvita provide 50% RDA of Vitamin D (Recommended Dietary Allowance requirement for children (7-9 years), ICMR -NIN, 2020). Bournvita chocolate drink to be consumed as a part of a daily balanced diet and healthy lifestyle.",
            "variations": [
                {
                    "name": "Cadbury Bournvita 750 g Pouch",
                    "regular_price": 365,
                    "sale_price": 270,
                    "pack_size": 750,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/40019371_29-bournvita-chocolate-health-drink-bournvita.jpg",
                    "stock": 176
                },
                {
                    "name": "Cadbury Bournvita 500 g Jar",
                    "regular_price": 1245,
                    "sale_price": 230,
                    "pack_size": 500,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/206980_30-cadbury-chocolate-health-drink-bournvita.jpg",
                    "stock": 0
                },
                {
                    "name": "asd",
                    "regular_price": 123,
                    "sale_price": 123,
                    "pack_size": 123,
                    "unit": "gm",
                    "image_url": "",
                    "stock": 123
                }
            ]
        },
        {
            "name": "Parle - G",
            "description": "Parle - G is a small, flat-baked, sweet biscuit made by Parle Foods that combines milk and wheat. The 'G' in Parle-G stands for glucose, and the biscuit is said to provide strength for the body and mind. Parle-G has been a source of nourishment for the nation since 1939, and in 2003 Nielsen named it the world's largest selling biscuit brand",
            "variations": [
                {
                    "name": "Parle-G, 800 g Pouch",
                    "regular_price": 110,
                    "sale_price": 80,
                    "pack_size": 800,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/102102_4-parle-gluco-biscuits-parle-g.jpg",
                    "stock": 32
                },
                {
                    "name": "Parle-G, 100 g Pouch",
                    "regular_price": 10,
                    "sale_price": 9,
                    "pack_size": 100,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/302110_6-parle-gluco-biscuits-parle-g.jpg",
                    "stock": 89
                },
                {
                    "name": "Parle-G, 50 g Pouch",
                    "regular_price": 5,
                    "sale_price": 4.5,
                    "pack_size": 50,
                    "unit": "gm",
                    "image_url": "https://www.bigbasket.com/media/uploads/p/l/40019272_3-parle-gluco-biscuits-parle-g.jpg",
                    "stock": 3
                }
            ]
        },
        {
            "name": "Monacoo Biscuit Small Pack",
            "description": "Crispy light salty snack 8 stay fresh packs inside A light and crunchy biscuit sprinkled with salt, Monaco includes a namkeen twist to sweet dominated biscuit world. It is the ideal namkeen twist you can include to your ordinary boring instants",
            "variations": [
                {
                    "name": "Monacoo Biscuit SM",
                    "regular_price": 20,
                    "sale_price": 10,
                    "pack_size": 200,
                    "unit": "gm",
                    "image_url": "https://m.media-amazon.com/images/I/51lyJwurJjL._SX300_SY300_QL70_FMwebp_.jpg",
                    "stock": 6
                }
            ]
        }
    ]

    for(const product of products) {
        const { name, description, variations } = product
        const addResp = await prisma.products.create({
            data: {
                name, 
                description
            }
        })
        for(const variant of variations) {
            variant.product_id = addResp.id
        }

        await prisma.variations.createMany({
            data: variations
        })
    }
}

seed_db().then((data) => {
    console.log(data)
}).catch((err) => {
    console.log(err)
}).finally(async () => {
    await prisma.$disconnect()
})