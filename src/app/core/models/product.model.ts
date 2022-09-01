export interface Product {
  id:            number;
  active:        boolean;
  name:          string;
  enterprise:    string;
  image:         string;
  quantity:      number;
  quantity_sell: number;
  price:         number;
  description:   string;
  tags:          string[];
  stars:         number;
  stars_count:   number;
}

