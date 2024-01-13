

export class Mail{
    to: string
    from: string
    subject: string
    message: string
    html: string
    cc: string | null = null
    constructor(to: string, from: string, subject: string, message: string, html: string){
        this.to = to
        this.from = from
        this.subject = subject
        this.message = message
        this.html = html
    }

}