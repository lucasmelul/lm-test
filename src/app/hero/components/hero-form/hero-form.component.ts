import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import { MyValidators } from '../../../utils/validators';
import { HeroService } from '../../../core/services/hero.service';
import { SkillService } from '../../../core/services/skill.service';
import { switchMap } from 'rxjs/operators'
import { Skill } from 'src/app/core/models/skill.model';
import { 
  MIN_HERO_SKILLS, 
  MAX_HERO_SKILLS,
  MIN_CHARS_HERO_NAME,
  MINIMUM_AGE
} from 'src/app/utils/constant';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss']
})
export class HeroFormComponent implements OnInit {
  heroForm: any;
  id: string = '';
  skills: Skill[] = [];
  isEdition: boolean = false;
  MIN_HERO_SKILLS: number = MIN_HERO_SKILLS;
  MAX_HERO_SKILLS: number = MAX_HERO_SKILLS;
  MIN_CHARS_HERO_NAME: number = MIN_CHARS_HERO_NAME
  MINIMUM_AGE: number = MINIMUM_AGE

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private skillService: SkillService,
    private snackBar: MatSnackBar
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          this.id = params['id'];
          this.isEdition = !!this.id;
          return this.heroService.getHero(this.id)
        })
      )
      .subscribe((hero: any) => {
        this.heroForm.patchValue(hero);
      });

    this.skillService.getSkills$()
      .subscribe((skills: Skill[]) => this.skills = skills);
  }

  saveHero = (event: Event) => {
    event.preventDefault();
    if (this.heroForm.valid) {
      const hero = this.heroForm.value;
      if(this.isEdition) {
        this.heroService.editHero({ hero, id: this.id })
          .subscribe(() => {
            this.openSnackBar('Has editado al héroe correctamente!'); 
            this.router.navigate(['./heroes'])
          })
      } else {
        this.heroService.addHero(hero)
        .subscribe(() => {
          this.openSnackBar('Has agregado al héroe correctamente!'); 
          this.router.navigate(['./heroes'])
        })
      }
    }
  }

  private buildForm = () => {
    this.heroForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(MIN_CHARS_HERO_NAME)]],
      description: ['', [Validators.maxLength(100)]],
      age: ['', [Validators.required, MyValidators.isAgeValid]],
      skills: ['', [Validators.required]],
      inFight: [false],
    }, {
      validator: MyValidators.validSelectedCheckboxes({ 
        controlName: 'skills', 
        min: MIN_HERO_SKILLS, 
        max: MAX_HERO_SKILLS 
      })
    });

    this.validateInFight();
  }

  get ageField() {
    return this.heroForm.get('age');
  }

  get skillsField() {
    return this.heroForm.get('skills');
  }

  get nameField() {
    return this.heroForm.get('name');
  }

  get descriptionField() {
    return this.heroForm.get('description');
  }

  get inFightField() {
    return this.heroForm.get('inFight');
  }

  validateInFight = () => {
    this.ageField.valueChanges
      .subscribe((value: any) => {
        if(value < MINIMUM_AGE) {
          this.inFightField.setValidators([Validators.pattern('false')])
        } else {
          this.inFightField.setValidators(null)
        }
        this.inFightField.updateValueAndValidity()
      })
  }

  compareFn = (c1: Skill, c2: Skill): boolean => {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
}

  changeSkill = (e: any) => {
    this.skillsField.setValue(e.target.value, {
      onlySelf: true
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000
    });
  }
}
