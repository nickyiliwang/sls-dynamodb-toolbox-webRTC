import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from "@aws/dynamodb-data-mapper-annotations";

const tableName = process.env.POSTS_TABLE;
const { v4: uuid } = require("uuid");

@table(tableName)
class Post {
  @hashKey()
  id: string;

  @rangeKey({ defaultProvider: () => new Date() })
  createdAt: Date;

  @attribute()
  title: string;

  @attribute()
  userId: number;

  @attribute()
  body: string;

  @attribute()
  completed?: boolean;
}

import { DataMapper } from "@aws/dynamodb-data-mapper";
import DynamoDB = require("aws-sdk/clients/dynamodb");

const mapper = new DataMapper({
  client: new DynamoDB({
    region: "localhost",
    endpoint: "http://localhost:8000",
  }),
  // tableNamePrefix: "dev_",
});

// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

// Get a single post
module.exports.getPost = (event, context, callback) => {
  const id = event.queryStringParameters.id;
  const createdAt = event.queryStringParameters.createdAt;

  console.log(createdAt);

  return mapper
    .get(
      Object.assign(new Post(), {
        id: id,
        createdAt: createdAt,
      })
    )
    .then((myItem) => {
      // the item was found
      callback(null, response(200, myItem));
    })
    .catch((err) => {
      // the item was not found or other errors
      callback(null, response(404, { error: err }));
    });
};

module.exports.createPost = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const post = {
    id: uuid(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body,
    completed: false,
  };
  const toSave = Object.assign(new Post(), post);

  return mapper
    .put(toSave)
    .then((objectSaved) => {
      // the record has been saved
      callback(null, response(201, objectSaved));
    })
    .catch((err) => {
      callback(null, response(err.statusCode, err));
    });
};
