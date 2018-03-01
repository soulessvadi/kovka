import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Product, Order, OrderProduct, Menu, Slide } from '../models/main.model';
import { ResponseProducts, ResponseOrders, ResponseMenus, ResponseSlides } from '../models/main.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class ShopService {

  private orderStorage = new BehaviorSubject<Order>(new Order());
  selectedOrder = this.orderStorage.asObservable();

  storeOrder(order: Order) {
    this.orderStorage.next(order)
  }

	constructor(private http: Http) {}

	api: string = 'http://localhost:3000/dashboard/api';

  public saveSlideChanged(formData): Promise<any> {
    let options = this.getOpts({});
    return this.http.post(`${this.api}/saveSlideChanged`, formData, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public updateSlide(slide: Slide): Promise<any> {
    let options = this.getOpts({});
    return this.http.post(`${this.api}/updateSlide`, slide, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getSlides(page : number, keyword: string): Promise<ResponseSlides> {
    let options = this.getOpts({p:page, q:keyword});
    return this.http.get(`${this.api}/getSlides`, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getMenus(page : number, keyword: string): Promise<ResponseMenus> {
    let options = this.getOpts({p:page, q:keyword});
    return this.http.get(`${this.api}/getMenus`, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public saveOrderChanged(order: Order): Promise<any> {
    let options = this.getOpts({});
    return this.http.post(`${this.api}/saveOrderChanged`, order, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getOrders(page : number, keyword: string): Promise<ResponseOrders> {
    let options = this.getOpts({p:page, q:keyword});
    return this.http.get(`${this.api}/getOrders`, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getOrder(id: number): Promise<Order> {
    let options = this.getOpts({ p: id });
    return this.http.get(`${this.api}/getOrder`, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getOrderProduct(sku: string): Promise<any> {
    let options = this.getOpts({s: sku});
    return this.http.get(`${this.api}/getOrderProduct`, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

	public getProducts(page : number, keyword: string): Promise<ResponseProducts> {
    let options = this.getOpts({p:page, q:keyword});
		return this.http.get(`${this.api}/getProducts`, options)
		  .toPromise()
		    .then(res => res.json())
		      .catch(err => {console.log(err)});
	}

  public updateProduct(product: Product): Promise<any> {
    let options = this.getOpts({});
    return this.http.post(`${this.api}/updateProduct`, product, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public updateMenu(menu: Menu): Promise<any> {
    let options = this.getOpts({});
    return this.http.post(`${this.api}/updateMenu`, menu, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public updateOrder(order: Order): Promise<any> {
    let options = this.getOpts({});
    return this.http.post(`${this.api}/updateOrder`, order, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getProduct(id: number): Promise<Product> {
    let options = this.getOpts({ p: id });
    return this.http.get(`${this.api}/getProduct`, options)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getPricelist(): Promise<any> {
    return new Promise((resolve) => {
      resolve(`${this.api}/buildPricelist`);
    });
  }

  public uploadPricelist(formData): Promise<any> {
    return this.http.post(`${this.api}/uploadPricelist`, formData)
      .toPromise()
        .then(res => res.json())
          .catch(err => {console.log(err)});
  }

  public getOpts(params: any): any {
    let options = {
      search: new URLSearchParams()
    };
    for (let key in params) {
      options.search.set(key, params[key] || '');
    }
    return options;
  }

}
