import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getProfile(user: any) {
    return {
      message: 'Profile data',
      user,
    };
  }
}
