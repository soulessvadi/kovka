import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DecimalPipe, DatePipe } from '@angular/common';
import { Product, Order } from '../models/main.model';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  providers:   [ ShopService ],
})

export class OrderComponent implements OnInit {

  private order: Order;
  private order_id: number;

  constructor(
    private _service: ShopService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    route.params.subscribe(params => {
      this.order_id = +params['id'];
      this.getOrder();
    });
  }

  getOrder(): void {
    this._service.getOrder(this.order_id).then((res) => {
      this.order = res['order'] as Order
      this.countTotals()
    });
  }

  countTotals(): void {
    this.order.products.forEach((v,i) => {
      this.order.amount = +this.order.amount + (+v.price * +v.quantity);
    })
  }

  updateOrder(order: Order) : void {
    this._service.updateOrder(order);
  }

  close(): void {
    this.location.back();
  }

  ngOnInit() {

  }

}
