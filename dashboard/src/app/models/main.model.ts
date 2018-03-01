export class Product {
	id: number;
  cat_id: number;
  cat_name: string;
  alias: string;
  name: string;
  sku: string;
  description: string;
  cover: string;
  publish: number;
  price: number;
  rank: number;
  is_stock: boolean;
  is_new: boolean;
  is_bestseller: boolean;
}

export class OrderProduct {
	id: number;
  cat_id: number;
  cat_name: string;
  alias: string;
  name: string;
  sku: string;
  description: string;
  cover: string;
  publish: number;
  price: number;
  rank: number;
  is_stock: boolean;
  is_new: boolean;
	is_bestseller: boolean;
  quantity: number;

}

export class Order {
  id: number;
  guest_id: string;
  user_id: number;
  number: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
  carrier: number;
  created: string;
  modified: string;
  amount: number;
  count: number;
  status: number;
  products: OrderProduct[];
}

export class Menu {
  id: number;
  name: string;
  alias: string;
  order: number;
  publish: number;
  in_header: number;
  in_footer: number;
  catalog: number;
  seo_title: string;
  seo_keys: string;
  seo_desc: string;
}

export class Slide {
  id: number;
  name: string;
  alias: string;
  cover: string;
  title: string;
  subtitle: string;
  description: string;
  buttons: string;
  publish: number;
  order: number;
}