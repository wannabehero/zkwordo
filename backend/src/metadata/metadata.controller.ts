import { Controller, Get, Param } from '@nestjs/common';

import { MetadataService } from './metadata.service';
import { ContractMetadata, TokenMetadata } from './types';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly svc: MetadataService) {}

  @Get('contract')
  getContractMetadata(): ContractMetadata {
    return this.svc.getContractMetadata();
  }

  @Get('token/:day')
  getTokenMetadata(@Param('day') day: string): TokenMetadata {
    return this.svc.getTokenMetadata(parseInt(day));
  }
}
