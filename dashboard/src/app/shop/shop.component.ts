import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../models/main.model';
import { ProductsService } from './products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

  private page_current: number = 1;
  private page_prev: number = 1;
  private page_next: number = 1;
  private pagination: number[];
  private products: Product[];
  private products_count: number;
  private products_per_page: number;
  private keyword: string;
  private sub: any;

  constructor(
    private _service: ProductsService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    route.params.subscribe(params => {
      this.page_current = +params['page'] || 1;
    });
  }

  findProducts() : void {
    this._service.getProducts(this.page_current, this.keyword).then((res) => {
      this.products = res.products as Product[]
      this.products_count = res.total
      this.pagination = res.pagi
      this.products_per_page = res.onpage
      this.page_current = res.page_current
      this.page_prev = res.page_prev
      this.page_next = res.page_next
    });
  }

  updateProduct(product: Product) : void {
    this._service.updateProduct(product);
  }

  ngOnInit() : void {
    this.findProducts();
  }

  navtopage(page: number) : void {
    this.page_current = page;
    this.findProducts();
  }

  searchtyping(event: any) : void {
    this.keyword = event.target.value;
    this.findProducts();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/shop/entity', id]);
  }

}
