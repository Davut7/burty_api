import { UserRole } from '@prisma/client';

export class UserTokenDto {
  id: string;
  email: string;
  isVerified: boolean;
  role: UserRole;

  constructor(entity) {
    this.id = entity.id;
    this.email = entity.email;
    this.isVerified = entity.isVerified;
    this.role = entity.role;
  }
}
