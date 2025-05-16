import { User } from '../../../domain/entities/User';
import { SignUpResponseDto } from './SignUpResponseDto';
import { SignUpRequestDto } from './SignUpRequestDto';
import { UserProps } from '../../../domain/entities/User';

export class SignUpMapper {
  static toResponseDto(user: User): SignUpResponseDto {
    return {
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }
  
  static toDomainEntity(dto: SignUpRequestDto): UserProps {
    return {
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName
    };
  }
} 