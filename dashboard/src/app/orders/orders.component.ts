import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DecimalPipe, DatePipe } from '@angular/common';
import { Product, Order } from '../models/main.model';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  providers:   [ ShopService ],
})

export class OrdersComponent implements OnInit {

  private page_current: number = 1;
  private page_prev: number = 1;
  private page_next: number = 1;
  private pagination: number[];
  private orders: Order[];
  private orders_count: number;
  private orders_per_page: number;
  private keyword: string;

  constructor(
    private _service: ShopService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    route.params.subscribe(params => {
      this.page_current = +params['page'] || 1;
    });
  }

  findOrders() : void {
    this._service.getOrders(this.page_current, this.keyword).then((res) => {
      this.orders = res.orders as Order[]
      this.orders_count = res.total
      this.orders_per_page = res.onpage
      this.pagination = res.pagi
      this.page_current = res.page_current
      this.page_prev = res.page_prev
      this.page_next = res.page_next
    });
  }

  updateOrder(order: Order) : void {
    this._service.updateOrder(order);
  }

  ngOnInit() {
    this.findOrders();
  }

  searchtyping(event: any) : void {
    this.keyword = event.target.value;
    this.findOrders();
  }

  navtopage(page: number) : void {
    this.page_current = page;
    this.findOrders();
  }

  viewDetails(order: Order): void {
  	this._service.storeOrder(order);
    this.router.navigate(['/orders/entity', order.id]);
  }

}
