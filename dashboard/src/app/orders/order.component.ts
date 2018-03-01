import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DecimalPipe, DatePipe } from '@angular/common';
import { Product, Order, OrderProduct } from '../models/main.model';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  providers:   [ ShopService ],
})

export class OrderComponent implements OnInit {

  private order: Order
  private order_id: number
  private add_sku: string
  private response_message: string;

  constructor(
    private _service: ShopService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    route.params.subscribe(params => {
      this.order_id = +params['id']
      this.getOrder()
    });
  }

  getOrder() : void {
    this._service.getOrder(this.order_id).then((res) => {
      this.order = res['order'] as Order
      this.countTotals()
    });
  }

  countTotals() : void {
    this.order.amount = 0
    this.order.products.forEach((v, i) => {
      this.order.amount = +this.order.amount + (+v.price * +v.quantity)
    })
  }

  updateOrder(order: Order) : void {
    this._service.updateOrder(order)
  }

  public add() : void {
    if(this.add_sku.length > 3) {
      this._service.getOrderProduct(this.add_sku).then((res) => {
        if(res.product) {
          this.order.products.push(res.product as OrderProduct)
          this.countTotals()
        }
      });
    }
  }

  public remove(product: OrderProduct) : void {
    this.order.products = this.order.products.filter(op => op !== product);
    this.countTotals()
  }

  public saveOrder() : void {
    this._service.saveOrderChanged(this.order).then((res) => {
      this.response_message = 'Сохранил';
      setTimeout(() => { this.response_message = '' }, 2000);
    });
  }

  close(): void {
    this.location.back()
  }

  ngOnInit() {

  }

}
