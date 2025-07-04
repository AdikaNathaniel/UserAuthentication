import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { users } from './users';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(username: string, password: string) {
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(' Hashed password:', hashedPassword); //  Logging the hashed password

    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    return { 
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    };
  }

  async login(username: string, password: string) {
    const user = users.find(u => u.username === username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id,
      username: user.username 
    };

    const token = await this.jwtService.signAsync(payload, { 
      expiresIn: '15m' 
    });

    return { 
      access_token: token,
      token_type: 'Bearer',
      expires_in: '15m'
    };
  }

  async getProfile(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      const user = users.find(u => u.id === payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
