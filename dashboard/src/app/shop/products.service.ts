import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Product } from '../models/main.model';

@Injectable()

export class ProductsService {

	constructor(private http: Http) {}

	api: string = 'http://localhost:3000/api';

	getProducts(): Promise<Product[]> {
		return this.http.get(`${this.api}/products`)
		.toPromise()
		.then(res => res.json() as Product[])
		.catch(err => {console.log(err)});
	}

	getProduct(id: number): Promise<Product> {
	  return this.getProducts().then(products => products.find(product => product.id === id));
	}
}
