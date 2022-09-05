import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { User } from 'src/app/core/models/user.model';
import { ProductsService } from 'src/app/core/services/products/products.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private productsService: ProductsService
  ) { }

  componentDestroyer$ = new Subject<boolean>;

  user?: User;

  products!: Product[];

  ngOnInit(): void {
    this.getUserById();
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.componentDestroyer$.next(true);
    this.componentDestroyer$.complete();
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
        console.log(this.products);

      }
    })
  }
}
