import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { HeroService } from 'src/app/core/services/hero.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  newHeroes$: Observable<number>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private heroService: HeroService
  ) {}

  ngOnInit() {
    this.newHeroes$ = this.heroService.newHeroes$
  }

  markAsSeen = () => {
    this.heroService.markAsSeen()
  }

}
