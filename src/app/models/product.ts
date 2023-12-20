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
    cover: string
    currency: string
    operation_type: string

    constructor(id: string, type: string, address: Address, price: number, currency: string, area: number, coveredArea: number, rooms: number, bathrooms: number, cover: string, operation_type: string){
        this.id = id
        this.type = type
        this.address = address
        this.price = price
        this.currency = currency
        this.area = area
        this.coveredArea = coveredArea
        this.rooms = rooms
        this.bathrooms = bathrooms
        this.cover = cover
        this.operation_type = operation_type
    }
}

export class ProductDetail extends ProductList{
    title: string
    garage: number
    description: string
    geo_lat: number
    geo_long: number
    images: string[]
    constructor(
        id: string,
        type: string,
        address: Address,
        price: number,
        currency: string,
        area: number,
        coveredArea: number,
        rooms: number,
        bathrooms: number,
        cover: string,
        operation_type: string,
        title:string,
        geo_lat: number,
        geo_long: number,
        garage: number,
        description: string,
        images: string[]
        ){
        super( id, type, address, price, currency, area, coveredArea, rooms, bathrooms, cover, operation_type )

        this.title = title
        this.geo_lat = geo_lat
        this.geo_long = geo_long
        this.garage = garage
        this.description = description
        this.images = images
    }
}