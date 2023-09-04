import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CardsDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Bank card X',
    description: 'Title for card',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1111222233334444',
    description: 'Card number',
  })
  @Length(13, 19, {
    message: 'O número do cartão deve ter entre 13 e 19 dígitos',
  })
  @Matches(/^[0-9]*$/, {
    message: 'O número do cartão deve conter apenas dígitos numéricos.',
  })
  number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Wesley Michael',
    description: 'Name on the card',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123',
    description: 'Card CVV',
  })
  cvv: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '12/30',
    description: 'Card expiration date',
  })
  exp: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1234',
    description: 'Card password',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Is virtual card',
  })
  isVirtual: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Is a credit card',
  })
  isCredit: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description: 'Is a debit card',
  })
  isDebit: boolean;
}
