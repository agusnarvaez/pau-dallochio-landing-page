

export class Address{
    street: string
    number: string
    locality: string
    city: string
    province: string
    constructor(street: string, number: string, locality: string, city: string, province: string){
        this.street = street
        this.number = number
        this.locality = locality
        this.city = city
        this.province = province
    }
}