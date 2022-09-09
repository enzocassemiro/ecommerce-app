import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResumeCart } from '../../models/resume-cart.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl:string =  "http://localhost:3000/purchase"

  postPurchase(resumePurchased: any): Observable<ResumeCart> {
    return this.http.post<ResumeCart>(`${this.baseUrl}`, resumePurchased)
  }
}
