import { Injectable } from '@nestjs/common';
import { users } from './users';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(username: string, password: string) {
    const exists = users.find(u => u.username === username);
    if (exists) {
      throw new Error('User already exists');
    }

    const hash = await bcrypt.hash(password, 10);
    users.push({ username, password: hash });
    return { message: 'User registered successfully' };
  }

  async login(username: string, password: string) {
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { username };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '15m' });

    return { token };
  }
}
