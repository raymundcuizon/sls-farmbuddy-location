// import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
// import createError from 'http-errors';

async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
}

export const handler = commonMiddleware(hello);