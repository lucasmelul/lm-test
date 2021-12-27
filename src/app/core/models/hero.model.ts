import { Skill } from './skill.model';

export interface Hero {
  id: string;
  name: string;
  description: string;
  inFight: boolean;
  age: number;
  skills: Skill[]
}

export interface ResponseHeroes {
  data: Hero[];
  total: number;
}

export interface HeroesParams {
  limit?: number;
  page?: number;
  query?: string;
}