import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { ImportComponent } from './import/import.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order.component';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './shop/product.component';
import { SiteMenuComponent } from './site/menu.component';
import { SiteSliderComponent } from './site/slider.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/orders/1',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'site-menu',
    component: SiteMenuComponent
  },
  {
    path: 'site-slider',
    component: SiteSliderComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'shop/:page',
    component: ShopComponent
  },
	{
  	path: 'shop/entity/:id',
  	component: ProductComponent
	},
  {
    path: 'shop',
    redirectTo: '/shop/1',
  },
  {
    path: 'import',
    component: ImportComponent
  },
  {
    path: 'orders/:page',
    component: OrdersComponent
  },
  {
    path: 'orders/entity/:id',
    component: OrderComponent
  },
  {
    path: 'orders',
    redirectTo: '/orders/1',
  },
  {
    path: '**',
    component: OrdersComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {

}
