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
  products: Product[];
}
