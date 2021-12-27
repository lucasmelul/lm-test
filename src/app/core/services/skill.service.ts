import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, combineLatest, } from 'rxjs/operators';

import { Skill, SkillHome } from '../models/skill.model';

import dataSkills from '../../../assets/dataSkills.json';
import { HeroService } from './hero.service';
import { Hero } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private skills: Skill[] = dataSkills;

  private skillsObservable = new BehaviorSubject<Skill[]>(this.skills);

  skills$ = this.skillsObservable.asObservable();

  constructor(private heroService: HeroService) { }

  getSkills$ = (): Observable<Skill[]> => {
    return this.skills$;
  }

  getSkillsTotal = (): Observable<any> => {
    return this.skills$
      .pipe(
        combineLatest(
          this.heroService.heroes$
            .pipe(
              map((heroes: Hero[]) => heroes
                .reduce((skills: Skill[], hero: Hero) => 
                  skills.concat(hero.skills), [])
                ),
            )
          ),
        map(([skills, heroesSkills]) => 
          skills.map((skill: Skill) => ({
              ...skill,
              total: heroesSkills.filter((heroSkill: Skill) => skill.name === heroSkill.name).length
            })
          )
        ),
        map((skills: SkillHome[]) => skills
          .filter((skills: SkillHome) => skills.total > 0)
          .sort((a, b) => a.total > b.total ? -1 : 1)
        ),
      );
  }
}
