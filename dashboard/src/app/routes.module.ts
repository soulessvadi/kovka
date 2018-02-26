import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { ImportComponent } from './import/import.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'import',
    component: ImportComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {

}
