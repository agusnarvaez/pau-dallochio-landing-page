import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { ProductsComponent } from './pages/products/products.component'
import { ProductDetailComponent } from './pages/product-detail/product-detail.component'
import { ContactComponent } from './pages/contact/contact.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { HowWeWorkComponent } from './pages/how-we-work/how-we-work.component'
import { SellComponent } from './pages/sell/sell.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'como-trabajamos',
    component: HowWeWorkComponent
  },
  {
    path: 'vender',
    component: SellComponent
  },
  {
    path: 'catalogo',
    component: ProductsComponent
  },
  {
    path: 'catalogo/:id',
    component: ProductDetailComponent
  },
  {
    path:"contacto",
    component: ContactComponent
  },
  { path: '**', redirectTo: 'notFound' },
  { path: 'notFound', component: NotFoundComponent }
]
