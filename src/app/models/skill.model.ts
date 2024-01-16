export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  level: SkillLevel;
  prerequisity: string;

}

export enum SkillLevel {
  Foundational = 0,
  Competent = 1,
  Expert = 2,
  Master = 3,
}
