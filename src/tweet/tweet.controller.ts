import { Controller, Get, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  getTweet(@Req() req: any) {
    const { tweetID } = req.query;
    return this.tweetService.getTweet(tweetID);
  }
}
