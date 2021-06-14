import AWS from 'aws-sdk';
import createError from 'http-errors';
import { RECORDS } from '../tempData/refbrgy.json';
import chunk from 'lodash.chunk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function initBrgy(event, context){
    try {

        const tableName = process.env.LOCATIONS_BRGY_TABLE_NAME;
        const chunkedRecords = chunk(RECORDS, 25);
        const dataPromises = chunkedRecords.map(async chunked => {
          let datas = [];
          chunked.forEach(item => {
            datas.push({
              PutRequest: {
                Item: {
                  id: item['id'],
                  brgyCode: item['brgyCode'],
                  brgyDesc: item['brgyDesc'],
                  regCode: item['regCode'],
                  regDesc: item['regDesc'],
                  provCode: item['provCode'],
                  citymunCode: item['citymunCode']
                }
              }
            });
          });
          let params = { RequestItems: { [ tableName ]: datas } };
          await dynamodb.batchWrite(params).promise();
        });
        await Promise.all(dataPromises);
    } catch (e) {
        console.log(e);
        throw new createError.InternalServerError(e);
    }
}

export const handler = initBrgy;