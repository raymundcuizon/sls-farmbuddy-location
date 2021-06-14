import AWS from 'aws-sdk';
import createError from 'http-errors';
import { RECORDS } from '../tempData/refcitymun.json';
import chunk from 'lodash.chunk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function initCityMun(event, context){
    try {

      const tableName = process.env.LOCATIONS_CITY_MUN_TABLE_NAME;
      const chunkedRecords = chunk(RECORDS, 25);

      const dataPromises = chunkedRecords.map(async chunked => {
        let datas = [];
        chunked.forEach(item => {
            datas.push({
              PutRequest: {
                Item: {
                  id: item['id'],
                  psgcCode: item['psgcCode'],
                  citymunDesc: item['citymunDesc'],
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

export const handler = initCityMun;