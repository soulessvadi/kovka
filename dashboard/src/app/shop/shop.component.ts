import { Component, OnInit } from '@angular/core';
import { Product } from '../models/main.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor(private _service: ProductsService) {
      this._service.getProducts().then(products => this.products = products);
  }

  products: Product[];

  ngOnInit() {

  }

}
