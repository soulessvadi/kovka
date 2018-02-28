import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../models/main.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  providers:   [ ProductsService ],
})

export class ProductComponent implements OnInit {
  constructor(
    private _service: ProductsService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    route.params.subscribe(params => {
      this.product_id = +params['id'] || 1;
    });
  }

  @Input() product_id: number;
  @Input() product: Product;

  ngOnInit(): void {
    this._service.getProduct(this.product_id).then((res) => {
      this.product = res['product'] as Product
    });
  }

  goBack(): void {
      this.location.back();
  }

}
