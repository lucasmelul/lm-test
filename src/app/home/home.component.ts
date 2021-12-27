import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeroService } from '../core/services/hero.service';
import { Hero } from '../core/models/hero.model';
import { Skill } from '../core/models/skill.model';
import { SkillService } from '../core/services/skill.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  heroesTotal$: Observable<number>;
  heroesInFightTotal$: Observable<number>;
  lastAddedHeroes$: Observable<Hero[]>;
  skillsTotal$: Observable<Skill[]>;

  constructor(
    private heroService: HeroService,
    private skillService: SkillService
    ) {}

  ngOnInit() {
    this.heroesTotal$ = this.heroService.getHeroesTotal()
    this.heroesInFightTotal$ = this.heroService.getHeroesInFightTotal();
    this.lastAddedHeroes$ = this.heroService.getLastAddedHeroes()
    this.skillsTotal$ = this.skillService.getSkillsTotal();
  }
}
