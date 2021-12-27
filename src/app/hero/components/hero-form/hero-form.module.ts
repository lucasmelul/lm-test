import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { HeroFormComponent } from './hero-form.component';
import { HeroFormRoutingModule } from './hero-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HeroFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeroFormRoutingModule,
    SharedModule,
  ],
})
export class HeroFormModule { }
