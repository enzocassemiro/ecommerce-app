import { Cart } from "./cart.model";

export interface ResumeCart {
  price: number,
  user_id: number,
  cart_products: Cart[]
}
