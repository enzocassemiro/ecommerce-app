import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [
    ProfileComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    InputNumberModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    DialogModule
  ]
})
export class UserModule { }
