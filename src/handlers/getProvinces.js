import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import schema from '../schemas/getProvinces';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getProvinces(event, context) {
    let provinces;
    let result;
    let params = {
      TableName: process.env.LOCATIONS_PROVINCE_TABLE_NAME,
    };
    const { regCode } = event.queryStringParameters;
    try {
      if(regCode) {
        params.IndexName = 'RegCodeAndProvCode';
        params.KeyConditionExpression = 'regCode = :regCode';
        params.ExpressionAttributeValues = { ':regCode': regCode };
        result = await dynamodb.query(params).promise();
      } else {
        result = await dynamodb.scan(params).promise();
      }

      provinces = result.Items;
    } catch(e){
      console.error(e);
      throw new createError.InternalServerError(e);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(provinces),
    };
}

export const handler = commonMiddleware(getProvinces)
.use(validator({
  inputSchema: schema,
  useDefaults: true,
}));
