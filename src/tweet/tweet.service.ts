import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TweetService {
  constructor(private configService: ConfigService) {}

  async getTweet(tweetID: string) {
    const quotes = await axios({
      method: 'GET',
      baseURL: `https://api.twitter.com/2/tweets/${tweetID}/quote_tweets?expansions=author_id&tweet.fields=created_at&user.fields=created_at`,
      headers: {
        Authorization: `Bearer ${this.configService.get(
          'TWITTER_BEARER_TOKEN',
        )}`,
      },
    });

    const retweets = await axios({
      method: 'GET',
      baseURL: `https://api.twitter.com/2/tweets/${tweetID}/retweeted_by?user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=created_at`,
      headers: {
        Authorization: `Bearer ${this.configService.get(
          'TWITTER_BEARER_TOKEN',
        )}`,
      },
    });

    return {
      status: 200,
      quotes: quotes.data,
      retweets: retweets.data,
    };
  }
}
