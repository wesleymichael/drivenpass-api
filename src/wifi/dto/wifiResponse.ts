import { ApiProperty } from '@nestjs/swagger';
import { WifiDTO } from './wifi.dto';

export class WifiResponse extends WifiDTO {
  @ApiProperty({ type: 'number', example: 7 })
  id: number;

  @ApiProperty({ type: 'number', example: 1 })
  userId: number;

  @ApiProperty({ type: 'string', example: '2023-09-02T03:39:44.766Z' })
  createdAt: string;

  @ApiProperty({ type: 'string', example: '2023-09-02T03:39:44.766Z' })
  updatedAt: string;
}
