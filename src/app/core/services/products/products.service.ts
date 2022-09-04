import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl: string = "http://localhost:3000/products"

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product)
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl)
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${product.id}`, product)
  }

  deleteProductById(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/${id}`)
  }
}
