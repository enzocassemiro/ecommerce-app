import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [MessageService]
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { this.setupProductForm() }

  componentDestroyer$: Subject<boolean> = new Subject;

  products!: Product[];
  productSelected?: Product;
  productForm!: FormGroup;

  displayCreate: boolean = false;
  displayDelete: boolean = false;
  displayDetail: boolean = false;


  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.componentDestroyer$.next(true);
    this.componentDestroyer$.complete();
  }

  setupProductForm() {
    this.productForm = this.fb.group({
      active: [true],
      name: ['', Validators.required],
      enterprise: ['',Validators.required],
      image: ['', Validators.required],
      quantity: [0, Validators.required],
      quantity_sell: [0],
      price: [0, Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
      stars: [0],
      starts_count: [0]
    })
  }

  copyProductDetail(): void {
    navigator.clipboard.writeText(`
    Id:${this.productSelected!.id}
    Active:${this.productSelected!.active}
    Name:${this.productSelected!.name}
    Enterprise:${this.productSelected!.enterprise}
    Image_Link:${this.productSelected!.image}
    Quantity:${this.productSelected!.quantity}
    Quantity_Sell:${this.productSelected!.quantity_sell}
    Price:${this.productSelected!.price}
    Description:${this.productSelected!.description}
    Tags:${this.productSelected!.tags}
    Stars:${this.productSelected!.stars}
    Stars_Count:${this.productSelected!.stars_count}
    `)
    this.displayDetail = false;
    this.showSuccess('Text Copied!', 'Use CTRL+V to paste');
  }

  showDialogCreateProduct(): void {
    this.displayCreate = true;
  }

  showDialogDetailProduct(productId: number): void {
    this.displayDetail = true;
    this.productSelected = this.products.find(x => x.id === productId)!;
  }

  showDialogDeleteProduct(productId: number): void {
    this.displayDelete = true;
    this.productSelected = this.products.find(x => x.id === productId)!;
  }

  getAllProducts(): void {
    this.productService.getAllProducts()
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: (products) => {
        this.products = products;
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  deleteProductById(id: number): void {
    this.productService.deleteProductById(id)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: (deleted) => {
        console.log('Product has been deleted');
        const indexOfObject = this.products.findIndex(object => {
          return object.id === id;
        });
        this.products.splice(indexOfObject,1);
        this.displayDelete = false;
      }
    })
  }

  showSuccess(title:string, text:string) {
    this.messageService.add({severity:'success', summary: title, detail: text});
  }

}
