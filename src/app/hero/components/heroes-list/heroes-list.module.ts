import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { HeroesListComponent } from './heroes-list.component';
import { HeroesListRoutingModule } from './heroes-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HeroesListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeroesListRoutingModule,
    SharedModule,
  ],
})
export class HeroesListModule { }
