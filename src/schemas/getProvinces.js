export default {
    type: 'object',
    properties: {
      queryStringParameters: {
        type: 'object',
        properties: {
          regCode: {
            type: 'string',
            default: '',
          },
        },
      },
    },
    required: [
      'queryStringParameters',
    ],
};