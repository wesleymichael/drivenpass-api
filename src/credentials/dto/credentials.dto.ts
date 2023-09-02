import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CredentialDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Social midia name',
    description: 'Title for credential',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'wesleymichaelps',
    description: 'username for credential',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@MyPassword',
    description: 'Password for credential',
  })
  password: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://mysocialmidia.com',
    description: 'Url for credential',
  })
  url: string;
}
