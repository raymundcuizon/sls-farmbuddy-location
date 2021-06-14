import AWS from 'aws-sdk';
import createError from 'http-errors';
import { RECORDS } from '../tempData/refregion.json';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function initRegion(event, context){
    try {
        const tableName = process.env.LOCATIONS_REGIONS_TABLE_NAME;
        let datas = [];
        RECORDS.forEach(item => {
            datas.push({
              PutRequest: {
                Item: {
                  id: item['id'],
                  psgcCode: item['psgcCode'],
                  regDesc: item['regDesc'],
                  regCode: item['regCode'],
                }
              }
            });
          });

        let params = { RequestItems: { [ tableName ]: datas } };
        await dynamodb.batchWrite(params).promise();
    } catch (e) {
        console.log(e);
        throw new createError.InternalServerError(e);
    }
}

export const handler = initRegion;