import { Product } from "./product"
import { Address } from './address'

export const address = new Address(
    "Malabia 1000",
    "Palermo, CABA"
)

export const product = new Product(

).fromTokko({
    id: "1",
    type:{name: "Departamento"},
    address: "address",
    branch: { address: "string" },
    operations: [{
      prices: [{ price: 0,currency:"USD" }],
      operation_type:"Venta"
    }],
    total_surface: 0,
    roofed_surface: 0,
    room_amount: 0,
    rich_description: "asdsa",
    bathroom_amount: 0,
    photos: [{ image: "string" }],
    geo_lat: 0,
    geo_long: 0,
    floors_amount: 0,
    location: { name: "string" },
    parking_lot_amount: 0,
    property_condition:"string",
    publication_title:"string",
    situation:"string",
    tags:[
      {
        id:0,
        name:"string",
        type:0
      }
    ],
    description_only: "string"
})

export const productsMock = [
    product, product,product
]
