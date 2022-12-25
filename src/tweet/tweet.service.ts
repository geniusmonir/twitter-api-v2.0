import { Injectable } from '@nestjs/common';

@Injectable()
export class TweetService {
  getTweet(tweetID: string) {
    return {
      status: 200,
      message: `Congratulations! We Can have a look on ID ${tweetID} now!`,
    };
  }
}
