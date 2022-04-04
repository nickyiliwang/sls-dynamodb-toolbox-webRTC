const { Table, Entity } = require("dynamodb-toolbox");

// Require AWS SDK and instantiate DocumentClient
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

const tableName = process.env.POSTS_TABLE;

// Instantiate a table
const MyTable = new Table({
  // Specify table name (used by DynamoDB)
  name: tableName,
  partitionKey: "id",

  // Add the DocumentClient
  DocumentClient,
});

// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}
const Customer = new Entity({
  // Specify entity name
  name: "Customer",

  // Define attributes
  attributes: {
    id: { partitionKey: true }, // flag as partitionKey
    age: { type: "number" }, // set the attribute type
  },

  // Assign it to our table
  table: MyTable,
});

// Create a post
module.exports.createPost = async (event, context, callback) => {
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

  // Create my item (using table attribute names or aliases)
  let item = {
    id: 123,
    age: 35,
  };

  // let result = await Customer.put(item)

  return Customer.put(item)
    .then((objectSaved) => {
      return callback(null, response(201, objectSaved));
    })
    .catch((err) => {
      return callback(null, response(err.statusCode, err));
    });
};

// Get a single post
module.exports.getPost = (event, context, callback) => {
  //   const id = event.pathParameters.id;

  let item = {
    id: 123,
    status: "active",
    date_added: "2020-04-24",
  };

  return Customer.get(item)
    .then((myItem) => {
      // the item was found
      return callback(null, response(200, myItem));
    })
    .catch((err) => {
      // the item was not found or other errors
      return callback(null, response(404, { error: err }));
    });
};
