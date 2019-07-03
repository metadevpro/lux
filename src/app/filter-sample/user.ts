export interface User   {
    id: string;
    createdAt: Date;
    modifiedAt: Date;
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
    enabled: boolean;
    role: string;
    urlImage?: string;
    email?: string;
  }
  