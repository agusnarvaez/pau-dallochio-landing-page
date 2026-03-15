import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { ProductsComponent } from './pages/products/products.component'
import { ProductDetailComponent } from './pages/product-detail/product-detail.component'
import { ContactComponent } from './pages/contact/contact.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { HowWeWorkComponent } from './pages/how-we-work/how-we-work.component'
import { SellComponent } from './pages/sell/sell.component'

export interface SeoRouteData {
  title: string
  description: string
  keywords?: string
}

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      seo: {
        title:
          'Paula Dallochio - Martillera y Corredora Inmobiliaria Profesional',
        description:
          'Descubre a Paula Dallochio, Martillera y Corredora Inmobiliaria con enfoque dedicado, preventivo y proactivo para la compra, venta y alquiler de propiedades.',
        keywords:
          'Paula Dallochio, inmobiliaria, bienes raices, propiedades en venta, propiedades en alquiler, corredora inmobiliaria',
      } satisfies SeoRouteData,
    },
  },
  {
    path: 'como-trabajamos',
    component: HowWeWorkComponent,
    data: {
      seo: {
        title: 'Nuestro Método de Trabajo en Bienes Raíces - Paula Dallochio',
        description:
          'Conoce nuestro método de trabajo inmobiliario para ofrecer un proceso claro, eficiente y orientado a resultados para cada cliente.',
        keywords:
          'Metodo inmobiliario, enfoque profesional, estrategia de bienes raices, satisfaccion del cliente, proceso inmobiliario',
      } satisfies SeoRouteData,
    },
  },
  {
    path: 'vender',
    component: SellComponent,
    data: {
      seo: {
        title: 'Vendé tu propiedad - Paula Dallochio Inmobiliaria',
        description:
          'Asesoramiento profesional para vender tu propiedad al mejor precio, con estrategia comercial y acompañamiento personalizado.',
        keywords:
          'Venta de propiedades, vender mi casa, vender mi departamento, vender mi terreno, vender mi local comercial, asesoramiento inmobiliario',
      } satisfies SeoRouteData,
    },
  },
  {
    path: 'catalogo',
    component: ProductsComponent,
    data: {
      seo: {
        title: 'Catálogo de Propiedades - Paula Dallochio Inmobiliaria',
        description:
          'Explora propiedades en venta y alquiler seleccionadas por Paula Dallochio para ayudarte a encontrar la opción ideal.',
        keywords:
          'Catalogo de propiedades, propiedades en venta, propiedades en alquiler, catalogo inmobiliario, inmuebles en Buenos Aires',
      } satisfies SeoRouteData,
    },
  },
  {
    path: 'catalogo/:id',
    component: ProductDetailComponent,
    data: {
      seo: {
        title: 'Detalle de propiedad - Paula Dallochio Inmobiliaria',
        description:
          'Consulta el detalle de esta propiedad con informacion clave, caracteristicas y asesoramiento inmobiliario profesional.',
        keywords:
          'detalle de propiedad, inmueble, ficha de propiedad, Paula Dallochio Inmobiliaria',
      } satisfies SeoRouteData,
    },
  },
  {
    path: 'contacto',
    component: ContactComponent,
    data: {
      seo: {
        title: 'Contáctanos - Paula Dallochio Inmobiliaria',
        description:
          'Contacta a Paula Dallochio para consultas, asesoramiento y acompañamiento inmobiliario personalizado.',
        keywords:
          'Contacto inmobiliario, consulta inmobiliaria, asesoramiento en bienes raices, informacion de contacto, servicios de Paula Dallochio',
      } satisfies SeoRouteData,
    },
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
    data: {
      seo: {
        title: 'Página no encontrada - Paula Dallochio Inmobiliaria',
        description:
          'La página que buscás no existe o fue movida. Volvé al inicio y seguí explorando nuestras propiedades.',
        keywords:
          'pagina no encontrada, error 404, Paula Dallochio Inmobiliaria',
      } satisfies SeoRouteData,
    },
  },
  { path: '**', redirectTo: 'notFound' },
]
