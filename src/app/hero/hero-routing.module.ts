import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeroesListComponent } from './components/heroes-list/heroes-list.component';
import { HeroFormComponent } from './components/hero-form/hero-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./components/heroes-list/heroes-list.module').then(m => m.HeroesListModule)
      },
      {
        path: 'new',
        loadChildren: () => import('./components/hero-form/hero-form.module').then(m => m.HeroFormModule)
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./components/hero-form/hero-form.module').then(m => m.HeroFormModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroRoutingModule { }
