// Lo que se manda a mailing-api (/mail/form): sólo datos. El remitente, el destinatario y el HTML
// los arma la API según el sitio, así nadie puede usarla para mandar mails a su gusto.
export interface Mail {
  site: 'pauladallochio'
  subject: string
  name?: string
  email?: string
  phone?: string
  message?: string
  fields?: { label: string; value: string }[]
  link?: string
}
