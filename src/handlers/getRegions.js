import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getRegions(event, context) {
    let regions;

    try {
        const params = {
            TableName: process.env.LOCATIONS_REGIONS_TABLE_NAME,
        };
        const result = await dynamodb.scan(params).promise();
        regions = result.Items.sort((a, b) => (a.id > b.id) ? 1 : -1);
      } catch(e){
          console.error(e);
          throw new createError.InternalServerError(e);
      }
      return {
        statusCode: 200,
        body: JSON.stringify(regions),
      };
}

export const handler = getRegions;