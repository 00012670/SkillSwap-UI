import { SafeUrl } from "@angular/platform-browser";

export interface Skill {
  skillId: number;
  name: string;
  description: string;
  category: string;
  level: SkillLevel;
  prerequisity: string;
  userId: number;
  skillImage?: SkillImageResponse;
  hasImage?: boolean;
  imageUrl?: SafeUrl;
  Video?: any;
}

export enum SkillLevel {
  Foundational = 0,
  Competent = 1,
  Expert = 2,
  Master = 3,
}

export interface SkillImageResponse {
  SkillImageId: number;
  img: any;
  skillId: number;
  Skill: string;
}

