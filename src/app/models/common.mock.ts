import { Product } from "./product"
import { Address } from './address'


export const address = new Address(
    "Malabia",
    "1000",
    "Palermo",
    "CABA",
    "Buenos Aires"
)

export const product = new Product(
    "1",
    "Departamento",
    address,
    350000,
    100,
    80,
    3,
    3,
    [
        '../../../assets/backgrounds/stock-image.jpg',
        '../../../assets/backgrounds/stock-image.jpg',
        '../../../assets/backgrounds/stock-image.jpg',
        '../../../assets/backgrounds/stock-image.jpg'
    ]
)

export const productsMock = [
    product, product,product
]
