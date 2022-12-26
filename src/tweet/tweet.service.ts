import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TweetService {
  constructor(private configService: ConfigService) {}

  async getTweet(tweetID: string) {
    const headers = {
      Authorization: `Bearer ${this.configService.get('TWITTER_BEARER_TOKEN')}`,
    };

    //RETWEETS STARTS
    const allRetweets = [];
    let rCount = 0;

    async function callRetweets(token: string) {
      rCount++;
      const retweets = await axios({
        method: 'GET',
        baseURL: `https://api.twitter.com/2/tweets/${tweetID}/retweeted_by?user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=created_at&max_results=100${
          token ? `&pagination_token=${token}` : ''
        }`,
        headers,
      });

      const resRetweets = retweets.data.data;

      if (resRetweets && resRetweets.length > 0) {
        allRetweets.push(...resRetweets);

        const nextToken = retweets.data.meta.next_token;

        if (nextToken && rCount < 30) {
          await callRetweets(nextToken);
        }

        rCount = 0;
        return;
      }

      return;
    }

    await callRetweets(undefined);

    //RETWEETS ENDS

    //QUOTES START
    const allQuotes = [];
    let qCount = 0;

    async function callQuotes(token: string) {
      qCount++;
      const quotes = await axios({
        method: 'GET',
        baseURL: `https://api.twitter.com/2/tweets/${tweetID}/quote_tweets?expansions=author_id&tweet.fields=created_at&user.fields=created_at&max_results=100${
          token ? `&pagination_token=${token}` : ''
        }`,
        headers,
      });

      console.log(quotes.data.data.length);

      const resQuotes = quotes.data.data;

      if (resQuotes && resQuotes.length > 0) {
        allQuotes.push(...resQuotes);

        const nextToken = quotes.data.meta.next_token;

        if (nextToken && qCount < 30) {
          await callQuotes(nextToken);
        }

        qCount = 0;
        return;
      }

      return;
    }

    await callQuotes(undefined);

    //QUOTES END

    const retweets = {
      data: allRetweets,
      meta: {
        result_count: allRetweets.length,
      },
    };

    const quotes = {
      data: allQuotes,
      meta: {
        result_count: allQuotes.length,
      },
    };

    const userIds = [];

    for (const user of allRetweets) {
      userIds.push(user.id);
    }

    for (const user of allQuotes) {
      userIds.push(user.author_id);
    }

    const unique_userID = [...new Set(userIds)];

    return {
      status: 200,
      retweets,
      quotes,
      unique_userID,
    };
  }
}
