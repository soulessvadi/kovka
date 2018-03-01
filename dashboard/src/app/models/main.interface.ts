import { Product, Order, Menu, Slide } from './main.model';

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

export interface ResponseMenus {
	menus: Menu[];
	onpage: number;
	total: number;
	page_current: number;
	page_prev: number;
	page_next: number;
	pagi: number[];
}

export interface ResponseSlides {
	slides: Slide[];
	onpage: number;
	total: number;
	page_current: number;
	page_prev: number;
	page_next: number;
	pagi: number[];
}
