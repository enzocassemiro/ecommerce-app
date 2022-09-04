import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, take, takeUntil } from 'rxjs';
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
  ) {
      this.setupProductForm()
    }

  componentDestroyer$: Subject<boolean> = new Subject;

  products!: Product[];
  productSelected?: Product;
  productSelectedEdit: Product = {
    id: 0,
    active: false,
    name: '',
    enterprise: '',
    image: '',
    quantity: 0,
    quantity_sell: 0,
    price: 0,
    promotion: false,
    promotion_percentage: 0,
    description: '',
    tags: '',
    stars: 0,
    stars_count: 0
  };
  productForm!: FormGroup;

  displayCreate: boolean = false;
  displayDelete: boolean = false;
  displayDetail: boolean = false;
  displayEdit: boolean = false;


  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.componentDestroyer$.next(true);
    this.componentDestroyer$.complete();
  }

  test() {
    console.log(this.productSelectedEdit);

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
      promotion: [false, Validators.required],
      promotion_percentage: [0],
      description: ['', Validators.required],
      tags: ['', Validators.required],
      stars: [0],
      starts_count: [0]
    })
  }

  sendFormProduct() {
    console.log('Clicou?');
    this.productService.createProduct(this.productForm.value)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: (value) => {
        console.log('Product Created!');
      },
      complete: () => {
        this.getAllProducts();
        this.showSuccess("Success!",'Product created!');
        this.displayCreate = false;
      }
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

  showDialogEditProduct(productId: number): void {
    this.displayEdit = true;
    this.productSelectedEdit = this.products.find(x => x.id === productId)!;
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
      },
      complete: () => {
        this.showSuccess('Success!','Your product has been deleted!')
      }

    })
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product)
    .pipe(takeUntil(this.componentDestroyer$))
    .subscribe({
      next: () => {

      },
      complete: () => {
        this.displayEdit = false;
        this.showSuccess('Success Updated!',`Product with id ${product.id} updated!`)
      }
    })
  }

  showSuccess(title:string, text:string): void {
    this.messageService.add({severity:'success', summary: title, detail: text});
  }

}
