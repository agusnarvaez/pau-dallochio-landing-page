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
    title: string
    address: Address
    price: number
    currency: string
    area: number
    coveredArea: number
    rooms: number
    bathrooms: number
    garage: number
    images: string[]
    description: string
    geo_lat: number
    geo_long: number

    constructor(
        id: string,
        title:string,
        type: string,
        address: Address,
        geo_lat: number,
        geo_long: number,
        price: number,
        currency:string,
        area: number,
        coveredArea: number,
        rooms: number,
        bathrooms: number,
        garage: number,
        images: string[],
        description: string
        ){
        this.id = id
        this.title = title
        this.type = type
        this.address = address
        this.geo_lat = geo_lat
        this.geo_long = geo_long
        this.price = price
        this.currency = currency
        this.area = area
        this.coveredArea = coveredArea
        this.rooms = rooms
        this.bathrooms = bathrooms
        this.garage = garage
        this.images = images
        this.description = description
    }
}