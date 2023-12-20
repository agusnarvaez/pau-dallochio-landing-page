import { ProductList } from "./product"
import { Address } from './address'


export const address = new Address(
    "Malabia 1000",
    "Palermo, CABA"
)

export const product = new ProductList(
    "1",
    "Departamento",
    address,
    350000,
    "USD",
    100,
    80,
    3,
    3,
    [
        '../../../assets/backgrounds/home-banner.jpg',
        '../../../assets/backgrounds/aboutLiving.jpg',
        '../../../assets/backgrounds/livingRoom.jpg',
        '../../../assets/backgrounds/home-banner.jpg',
        '../../../assets/backgrounds/aboutLiving.jpg',
        '../../../assets/backgrounds/livingRoom.jpg'
    ]
)

export const productsMock = [
    product, product,product
]
