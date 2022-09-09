import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { User } from 'src/app/core/models/user.model';
import { ProductsService } from 'src/app/core/services/products/products.service';
import { SearchService } from 'src/app/core/services/search/search.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [MessageService]
})
export class ProductsComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private productsService: ProductsService,
    private searchService: SearchService,
    private messageService: MessageService
  ) { }

  componentDestroyer$ = new Subject<boolean>;

  user?: User;

  products!: Product[];

  ngOnInit(): void {
    this.getUserById();
    this.getAllProducts();
    this.searchService.searchValue$
      .pipe(takeUntil(this.componentDestroyer$))
      .subscribe(value =>  this.productsService.getProductByNameLike(value)
      .subscribe(value => {
        this.products = value
      }));
  }

  ngOnDestroy(): void {
    this.componentDestroyer$.next(true);
    this.componentDestroyer$.complete();
  }

  showSuccess(title: string, content: string) {
    this.messageService.add({severity:'success', summary: title, detail: content});
  }
  showInfo(title: string, content: string) {
    this.messageService.add({severity:'info', summary: title, detail: content});
  }

  getUserById(): void {
    this.userService.getUserInfoById(1)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: (value) => {
        this.user = value
      }
    })
  }

  getAllProducts(): void {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: (value) => {
        this.products = value;
      }
    })
  }

  AddProductCart(product: Product): void {
    const newUserData = {
      id: product.id,
      product_id: product.id,
      product_info: product,
      quantity: 1
    }

    if(!this.user?.cart.find(x => x.id === product.id)) {
      this.user?.cart.push(newUserData)
      this.userService.putCartProduct(this.user!)
      .pipe(takeUntil(this.componentDestroyer$))
      .subscribe({
        next: () => {},
        complete: () => {
          this.showSuccess('Product added!', 'Your Product has been added to your cart!');
        }

      })
      return
    }
    this.showInfo('Visit your cart!','Product already in your Cart!')
  }
}
