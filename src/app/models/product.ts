import { Address } from './address'

export class Product{
    id: string = ''
    type: string = ''
    address: Address = new Address("","")
    price: number = 0
    area: number = 0
    coveredArea: number = 0
    rooms: number = 0
    bathrooms: number = 0
    cover: string = ''
    currency: string = ''
    operation_type: string = ''
    title: string = ''
    garage: number = 0
    description: string = ''
    geo_lat: number = 0
    geo_long: number = 0
    images: string[] = []
    videos: string[] = []

    fromTokko( product: TokkoProduct ){
        this.id = product.id
        this.type = product.type.name
        this.address = new Address(
            product.address,
            product.location.name,
            ),
        this.price = product.operations[0].prices[0].price
        this.currency = product.operations[0].prices[0].currency
        this.area = product.total_surface
        this.coveredArea = product.roofed_surface
        this.rooms = product.room_amount
        this.bathrooms = product.bathroom_amount
        this.cover = product.photos[0].image
        this.operation_type = product.operations[0].operation_type
        this.title = product.publication_title
        this.geo_lat = product.geo_lat
        this.geo_long = product.geo_long
        this.garage = product.parking_lot_amount
        this.description = product.description_only
        this.images = product.photos.map( photo => photo.image )
        this.videos = product.videos.map( video => video.url )
        return this
    }

    fromSanity( product: SanityProduct ){
        this.id = product._id
        this.type = product.type.title
        this.address = new Address(
            product.street,
            product.city,
            ),
        this.price = product.price
        this.currency = product.currency.title
        this.area = product.area
        this.coveredArea = product.coveredArea
        this.rooms = product.rooms
        this.bathrooms = product.bathRooms
        this.cover = product.cover.asset.url
        this.operation_type = product.operation_type.title
        this.title = product.title
        this.geo_lat = product.geo_lat
        this.geo_long = product.geo_long
        this.garage = product.garage
        this.description = product.body[0].children[0].text
        this.images = product.images.map( image => image.asset.url )

        return this

    }
}

export interface TokkoProduct {
    id: string
    type: { name: string }
    address: string
    branch: { address: string }
    operations: [{
      prices: [{ price: number,currency:string }]
      operation_type:string
    }]
    total_surface: number
    roofed_surface: number
    room_amount: number
    rich_description: string
    bathroom_amount: number
    photos: { image: string }[]
    geo_lat: number
    geo_long: number
    floors_amount: number
    location: { name: string }
    parking_lot_amount: number
    property_condition:string
    publication_title:string
    situation:string
    tags:[
      {
        id:number,
        name:string
        type:number
      }
    ]
    description_only: string
    videos: { url: string }[]
}
export interface SanityProduct {
    area: number,
    bathRooms: number,
    body: any[],
    city: string,
    cover:{
        asset:{
            path: string,
            url: string
        }
    },
    coveredArea: number,
    currency:{
        title: string
    },
    garage: number,
    geo_lat: number,
    geo_long: number,
    images: {
        asset:{
            path: string,
            url: string
        }
    }[],
    operation_type:{
        title: string
    },
    price: number,
    rooms: number,
    street: string,
    title: string,
    type:{
        title: string
    },
    _id: string
}