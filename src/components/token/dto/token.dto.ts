import { UserRole } from '@prisma/client';

export class UserTokenDto {
  id: string;
  email: string;
  isVerified: boolean;
  userName: string;
  role: UserRole;

  constructor(entity) {
    this.id = entity.id;
    this.email = entity.email;
    this.isVerified = entity.isVerified;
    this.role = entity.role;
    this.userName = entity.userName;
  }
}
