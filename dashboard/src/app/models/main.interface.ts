import { Product, Order } from './main.model';

export interface ResponseProducts {
	products: Product[];
	onpage: number;
	total: number;
	page_current: number;
	page_prev: number;
	page_next: number;
	pagi: number[];
}

export interface ResponseOrders {
	orders: Order[];
	onpage: number;
	total: number;
	page_current: number;
	page_prev: number;
	page_next: number;
	pagi: number[];
}