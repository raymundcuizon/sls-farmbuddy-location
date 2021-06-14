import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCites(event, context) {
    let cities;
    const { provCode } = event.queryStringParameters;

    try {
        const params = {
            TableName: process.env.LOCATIONS_CITY_MUN_TABLE_NAME,
            FilterExpression: "provCode = :provCode",
            // IndexName: 'RegCodeAndProvCode',
            // KeyConditionExpression: 'provCode = :provCode',
            ExpressionAttributeValues: {
                ':provCode': provCode
            },
        };
        const result = await dynamodb.scan(params).promise();
        cities = result.Items;
      } catch(e){
          console.error(e);
          throw new createError.InternalServerError(e);
      }
      return {
        statusCode: 200,
        body: JSON.stringify(cities),
      };
}

export const handler = getCites;