import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ProofService } from './proof.service';

@UseGuards(ThrottlerGuard)
@Controller('proof')
export class ProofController {
  constructor(private readonly svc: ProofService) {}

  @Throttle(1, 5)
  @Post('/generate')
  async generate(@Body() body: { account: string; word: string; day: number }) {
    return this.svc.generateProof(body.account, body.word, body.day).catch(() => {
      throw new HttpException('Invalid proof', 400);
    });
  }
}
