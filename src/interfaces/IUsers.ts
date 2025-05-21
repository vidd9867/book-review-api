export interface IUsers {
  id?: string;
  email: string | null;
  password?: string | null;
  sessiontoken?: string | null;
  createdAt?: Date | null;
  updated_at?: Date | null;
}

export interface IUsersToken {
    id: string;
    email: string | null;
    sessiontoken?: string | null;
    updatedAt?: Date | null;
}
