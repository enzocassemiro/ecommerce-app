import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Product } from 'src/app/core/models/product.model';
import { ResumeCart } from 'src/app/core/models/resume-cart.model';
import { User } from 'src/app/core/models/user.model';
import { PurchaseService } from 'src/app/core/services/purchase/purchase.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [MessageService]
})
export class CartComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private purchaseService: PurchaseService,
    private messageService: MessageService
  ) { }

  componentDestroyer$ = new Subject<boolean>;

  ProductQuantity$ = new Subject<Cart>;

  displayDelete: boolean = false;

  productDelete!: Cart;

  resumeCart: ResumeCart = {
    price: 0,
    user_id: 0,
    cart_products: []
  };

  user: User = {
    id: 0,
    name: '',
    last_name: '',
    adress: '',
    adress_number: 0,
    cart: [],
    cart_purchase: []
  }

  ngOnInit(): void {
    this.checkUserLogged();
    this.ProductQuantity$.pipe(debounceTime(900))
    .subscribe({next:(value) => {
      this.updateCart(value);
    }})
  }

  ngOnDestroy(): void {
    this.componentDestroyer$.next(true);
    this.componentDestroyer$.complete();
  }

  changeQuantityProduct(product: Cart): void {
    this.ProductQuantity$.next(product);
  }

  updateCart(product: Cart): void {
    const indexPut = this.user.cart.findIndex(id => id.product_id === product.id)
    this.user.cart[indexPut].quantity = product.quantity
    this.userService.putCartProduct(this.user)
    .pipe(takeUntil(this.componentDestroyer$),
    debounceTime(600))
    .subscribe({
      complete: () => {
        this.resumeCartPrice();
      }
    })
  }

  showSuccess(title: string, content: string): void {
    this.messageService.add({severity:'success', summary: title, detail: content});
  }

  showInfo(title: string, content: string): void {
    this.messageService.add({severity:'info', summary: title, detail: content});
  }

  showDeleteDialog(product: Cart): void {
    this.productDelete = product;
    this.displayDelete = true;
  }

  paymentCart(): void {
    this.purchaseService.postPurchase(this.resumeCart)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: () => {
      },
      complete: () => {
        this.showSuccess('Payment Completed!', 'Your Products is in your way! Check your e-mail')
        this.user.cart.splice(0, this.user.cart.length)
        this.userService.putCartProduct(this.user)
        .pipe(takeUntil(this.componentDestroyer$))
        .subscribe({
          complete: () => {
          this.showSuccess('Cart Updated!','You buyed some products!')
          this.resumeCartPrice();
          }
        })
      }
    })
  }

  resumeCartPrice(): void {
    let priceResumeCart: number = 0
    for (let index = 0; index < this.user.cart.length; index++) {
      this.resumeCart.cart_products.push(this.user.cart[index])
      const element = this.user.cart[index];
      priceResumeCart += element.product_info.price * element.quantity;
    }
    this.resumeCart.price = priceResumeCart;
    this.resumeCart.user_id = this.user.id
  }

  removeProductCart(): void {
    const indexDelete = this.user.cart.findIndex(id => id.product_id === this.productDelete.id)
    this.user.cart.splice(indexDelete, 1)
    this.userService.putCartProduct(this.user)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      complete: () => {
        this.showSuccess('Item Removed!','You remove item from cart!')
        this.resumeCartPrice();
      }
    })
    this.displayDelete = false;
  }

  checkUserLogged(): void {
    this.userService.getUserInfoById(1)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: (value) => {
        this.user = value;
        this.resumeCartPrice();
      }
    })
  }

}
