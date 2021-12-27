import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { JoinPipe } from './pipes/join/join.pipe';
import { UppercaseDirective } from './directives/uppercase/uppercase.directive';
import { MaterialModule } from './../material/material.module';
import { NavComponent } from './components/nav/nav.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { TableComponent } from './components/table/table.component';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';

@NgModule({
  declarations: [
    JoinPipe,
    UppercaseDirective,
    NavComponent,
    LoadingComponent,
    ConfirmationDialogComponent,
    PaginatorComponent,
    TableComponent,
    TruncatePipe
  ],
  exports: [
    JoinPipe,
    UppercaseDirective,
    NavComponent,
    MaterialModule,
    LoadingComponent,
    ConfirmationDialogComponent,
    PaginatorComponent,
    TableComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
