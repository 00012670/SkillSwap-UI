export interface Skill {
  skillId: string;
  name: string;
  description: string;
  category: string;
  level: SkillLevel;
  prerequisity: string;
  userId: string;
  user: {
    userId: string;
    username: string;
    email: string;
    password: string;
    fullName: string;
    bio: string;
    skillInterested: string;
    token: string;
    role: string;
  };
}

export enum SkillLevel {
  Foundational = 0,
  Competent = 1,
  Expert = 2,
  Master = 3,
}


