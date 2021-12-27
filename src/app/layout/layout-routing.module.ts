import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'heroes',
        loadChildren: () => import('../hero/hero.module').then(m => m.HeroModule)
      },
      {
        path: '**',
        loadChildren: () => import('../page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
