import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ProofService } from './proof.service';
import { Address } from 'viem';

@UseGuards(ThrottlerGuard)
@Controller('proof')
export class ProofController {
  constructor(private readonly svc: ProofService) {}

  @Throttle(1, 5)
  @Post('/generate')
  async generate(@Body() body: { account: string; word: string }) {
    return this.svc.generateProof(body.account, body.word).catch(() => {
      throw new HttpException('Unable to generate a valid proof. Guess again', 400);
    });
  }

  @Throttle(1, 5)
  @Post('/generate-signed')
  async generateSigned(@Body() body: { word: string; signature: Address }) {
    const { account, word } = await this.svc.extractFromSignature(body.word, body.signature);

    return this.svc.generateProof(account, word).catch(() => {
      throw new HttpException('Unable to generate a valid proof. Guess again', 400);
    });
  }
}
