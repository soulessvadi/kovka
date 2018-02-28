import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { ImportComponent } from './import/import.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order.component';
import { AuthComponent } from './auth/auth.component';
import { ProductComponent } from './shop/product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
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
