import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TweetService {
  constructor(private configService: ConfigService) {}

  async getTweet(tweetID: string) {
    const quotes = await axios({
      method: 'GET',
      baseURL: `https://api.twitter.com/2/tweets/${tweetID}/quote_tweets?expansions=author_id&tweet.fields=created_at&user.fields=created_at&max_results=100`,
      headers: {
        Authorization: `Bearer ${this.configService.get(
          'TWITTER_BEARER_TOKEN',
        )}`,
      },
    });

    const retweets = await axios({
      method: 'GET',
      baseURL: `https://api.twitter.com/2/tweets/${tweetID}/retweeted_by?user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=created_at&max_results=100`,
      headers: {
        Authorization: `Bearer ${this.configService.get(
          'TWITTER_BEARER_TOKEN',
        )}`,
      },
    });

    const userIds = [];

    for (const user of quotes.data.data) {
      userIds.push(user.author_id);
    }

    for (const user of quotes.data.data) {
      userIds.push(user.id);
    }

    const unique_userID = [...new Set(userIds)];

    return {
      status: 200,
      quotes: quotes.data,
      retweets: retweets.data,
      unique_userID,
    };
  }
}
