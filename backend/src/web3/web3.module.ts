import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { polygonMumbai, hardhat } from 'viem/chains';
import { VIEM_CLIENT } from './consts';

@Global()
@Module({
  providers: [
    {
      provide: VIEM_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createPublicClient({
          // chain: polygonMumbai,
          chain: hardhat,
          transport: http(config.get('RPC_URL')),
        }),
    },
  ],
  exports: [VIEM_CLIENT],
})
export class Web3Module {}