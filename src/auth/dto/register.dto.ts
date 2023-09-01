import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(10, { message: 'A senha deve ter pelo menos 10 caracteres' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/, {
    message:
      'A senha deve conter pelo menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial',
  })
  password: string;

  constructor(params?: Partial<RegisterDto>) {
    if (params) Object.assign(this, params);
  }
}
