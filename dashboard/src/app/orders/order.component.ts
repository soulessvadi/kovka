import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DecimalPipe } from '@angular/common';
import { Product, Order } from '../models/main.model';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  providers:   [ ShopService ],
})

export class OrderComponent implements OnInit {

  public order: Order;

  constructor(
    private _service: ShopService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    _service.selectedOrder.subscribe(order => this.order = order )
  }

  ngOnInit() {

  }

}
