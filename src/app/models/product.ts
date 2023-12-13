import { Address } from './address'

export class Product{
    type: string
    address: Address
    price: number
    area: number
    coveredArea: number
    rooms: number
    bathrooms: number
    images: string[]

    constructor(type: string, address: Address, price: number, area: number, coveredArea: number, rooms: number, bathrooms: number, images: string[]){
        this.type = type
        this.address = address
        this.price = price
        this.area = area
        this.coveredArea = coveredArea
        this.rooms = rooms
        this.bathrooms = bathrooms
        this.images = images
    }
}