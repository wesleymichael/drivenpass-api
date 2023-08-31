import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CredentialDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
