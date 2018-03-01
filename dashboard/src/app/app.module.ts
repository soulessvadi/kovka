import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule }     from './routes.module';

import { AppComponent } from './app.component';
import { SiteMenuComponent } from './site/menu.component';
import { SiteSliderComponent } from './site/slider.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ShopComponent } from './shop/shop.component';
import { ProductComponent } from './shop/product.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImportComponent } from './import/import.component';
import { AuthComponent } from './auth/auth.component';
import { ProductsService } from './shop/products.service';
import { ShopService } from './services/shop.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ShopComponent,
    OrdersComponent,
    OrderComponent,
    DashboardComponent,
    ImportComponent,
    AuthComponent,
    ProductComponent,
    SiteMenuComponent,
    SiteSliderComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [
    ProductsService,
    ShopService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
