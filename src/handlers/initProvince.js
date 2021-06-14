import AWS from 'aws-sdk';
import createError from 'http-errors';
import { RECORDS } from '../tempData/refprovince.json';
import chunk from 'lodash.chunk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function initProvince(event, context){
    try {

      const chunkedRecords = chunk(RECORDS, 25);
      const tableName = process.env.LOCATIONS_PROVINCE_TABLE_NAME;
      const savedPromises = chunkedRecords.map(async chunked => {
        let datas = [];
        chunked.forEach(item => {
          datas.push({
            PutRequest: {
              Item: {
                id: item['id'],
                psgcCode: item['psgcCode'],
                provDesc: item['provDesc'],
                regCode: item['regCode'],
                provCode: item['provCode'],
              }
            }
          });
        });
        let params = { RequestItems: { [ tableName ]: datas } };
        await dynamodb.batchWrite(params).promise();
      });
      await Promise.all(savedPromises);
    } catch (e) {
        console.log(e);
        throw new createError.InternalServerError(e);
    }
}

export const handler = initProvince;