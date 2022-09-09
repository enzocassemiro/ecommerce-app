import { Product } from "./product.model";

export interface Cart {
  id: number,
  product_id: number,
  product_info: Product,
  quantity: number
}
