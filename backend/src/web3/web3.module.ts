import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

import { VIEM_CLIENT } from './consts';

@Global()
@Module({
  providers: [
    {
      provide: VIEM_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createPublicClient({
          chain: polygon,
          transport: http(config.get('RPC_URL')),
        }),
    },
  ],
  exports: [VIEM_CLIENT],
})
export class Web3Module {}
