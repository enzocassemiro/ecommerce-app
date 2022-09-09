import { Cart } from "./cart.model";

export interface User {
  id:            number;
  name:          string;
  last_name:     string;
  adress:        string;
  adress_number: number;
  cart:          Cart[];
  cart_purchase: any[];
}
