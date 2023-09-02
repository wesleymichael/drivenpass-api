import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WifiDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Neighbor's wifi",
    description: 'Title for wifi',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Wesley_5G',
    description: 'Network name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'password123',
    description: 'Password',
  })
  password: string;
}
