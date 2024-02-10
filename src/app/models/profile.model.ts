export interface Skill {
  skillId: number;
  name: string;
  description: string;
  category: string;
  level: number;
  prerequisity: string;
  userId: number;
  user: string;
}

export interface Profile {
  userId: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio: string;
  skillInterested: string;
  token: string;
  role: string;
  skills: Skill[];
}
