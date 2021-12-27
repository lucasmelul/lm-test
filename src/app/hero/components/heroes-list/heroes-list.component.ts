import { Component, OnInit, OnDestroy } from '@angular/core';

import { Hero, ResponseHeroes } from '../../../core/models/hero.model';
import { HeroService } from '../../../core/services/hero.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss']
})
export class HeroesListComponent implements OnInit, OnDestroy {
  heroesSubscription: Subscription;
  resetPage: Subject<void> = new Subject<void>();
  heroesTotal$: Observable<number>;
  displayedColumns: string[] = ['id', 'name', 'description', 'age', 'skills', 'inFight', 'actions'];
  heroes: Hero[] = [];
  currentPage: number = 1;
  limitPage: number = 5;
  query: string = '';

  constructor(
    private heroService: HeroService,
    public confirmationDialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.fetchHeroes();
    this.heroesTotal$ = this.heroService.heroesTotal$
  }

  fetchHeroes = () => {
    this.heroesSubscription = this.heroService.getHeroes({ 
      page: this.currentPage, 
      limit: this.limitPage, 
      query: this.query 
    }).subscribe((response: ResponseHeroes) => {
      this.heroes = response.data
    });
  }

  changePage = ($event: PageEvent) => {
    this.currentPage = $event.pageIndex + 1
    this.fetchHeroes()
  }

  removeHero = (id: string): void => {
    this.confirmationDialog
      .open(ConfirmationDialogComponent, {
        data: `¿Estás seguro de eliminar este héroe?`
      })
      .afterClosed()
      .subscribe((confirm: Boolean) => {
        if (confirm) {
          this.heroService.removeHero(id)
            .subscribe(() => this.openSnackBar("Has eliminado al héroe correctamente!"))
        }
      });
  }

  filterHero = ($event: any) => {
    this.query = $event.target.value;
    this.currentPage = 1;
    this.resetPage.next();
    this.fetchHeroes()
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000
    });
  }

  ngOnDestroy() {
    this.heroesSubscription.unsubscribe();
  }
}
