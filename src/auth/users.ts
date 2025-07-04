export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}

export const users: User[] = [];