import { Address } from './address'

export class ProductList{
    id: string
    type: string
    address: Address
    price: number
    area: number
    coveredArea: number
    rooms: number
    bathrooms: number
    images: string[]
    currency: string

    constructor(id: string, type: string, address: Address, price: number, currency: string, area: number, coveredArea: number, rooms: number, bathrooms: number, images: string[]){
        this.id = id
        this.type = type
        this.address = address
        this.price = price
        this.currency = currency
        this.area = area
        this.coveredArea = coveredArea
        this.rooms = rooms
        this.bathrooms = bathrooms
        this.images = images
    }
}

export class ProductDetail{
    id: string
    type: string
    address: Address
    price: number
    area: number
    coveredArea: number
    rooms: number
    bathrooms: number
    images: string[]

    constructor(id: string, type: string, address: Address, price: number, area: number, coveredArea: number, rooms: number, bathrooms: number, images: string[]){
        this.id = id
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