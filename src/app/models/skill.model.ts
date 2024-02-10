export interface Skill {
  skillId: number;
  name: string;
  description: string;
  category: string;
  level: SkillLevel;
  prerequisity: string;
  userId: number;
}

export enum SkillLevel {
  Foundational = 0,
  Competent = 1,
  Expert = 2,
  Master = 3,
}


