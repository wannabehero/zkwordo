import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Address } from 'viem';

import { ProofService } from './proof.service';

@UseGuards(ThrottlerGuard)
@Controller('proof')
export class ProofController {
  constructor(private readonly svc: ProofService) {}

  @Throttle({
    default: {
      limit: 1,
      ttl: 5000,
    },
  })
  @Post('/generate')
  async generate(@Body() body: { account: string; word: string }) {
    return this.svc.generateProof(body.account, body.word).catch(() => {
      throw new HttpException('Unable to generate a valid proof. Guess again', 400);
    });
  }

  @Throttle({
    default: {
      limit: 1,
      ttl: 5000,
    },
  })
  @Post('/generate-signed')
  async generateSigned(@Body() body: { word: string; signature: Address }) {
    const { account, word } = await this.svc.extractFromSignature(body.word, body.signature);

    return this.svc.generateProof(account, word).catch(() => {
      throw new HttpException('Unable to generate a valid proof. Guess again', 400);
    });
  }
}
