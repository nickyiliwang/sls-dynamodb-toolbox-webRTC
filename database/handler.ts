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
  // client: new DynamoDB({ region: "us-east-1" }),
  client: new DynamoDB({
    region: "localhost",
    endpoint: "http://localhost:3002",
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

// Create a post
module.exports.createPost = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  if (
    !reqBody.title ||
    reqBody.title.trim() === "" ||
    !reqBody.body ||
    reqBody.body.trim() === ""
  ) {
    return callback(
      null,
      response(400, {
        error: "Post must have a title and body and they must not be empty",
      })
    );
  }

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
      console.log("put success!");
      callback(null, response(201, objectSaved));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

// Get a single post
module.exports.getPost = (event, context, callback) => {
  const id = event.pathParameters.id;

  return mapper
    .get(
      Object.assign(new Post(), {
        id: id,
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

// Test
module.exports.test = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const post = {
    id: uuid(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body,
    completed: false,
  };
  const toSave = Object.assign(new Post(), post);

  console.log("triggered!", post);

  return mapper
    .put(toSave)
    .then((objectSaved) => {
      // the record has been saved
      console.log("put success!");
      // callback(null, response(201, objectSaved));
      return {
        statusCode: 201,
        body: JSON.stringify(objectSaved),
      };
    })
    .catch((err) => {
      console.log("triggered error !", err);
      return response(null, response(err.statusCode, err));
    });
};
