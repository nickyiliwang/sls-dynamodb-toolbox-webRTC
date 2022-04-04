const { Table, Entity } = require("dynamodb-toolbox");

// Require AWS SDK and instantiate DocumentClient
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});
const { v4: uuid } = require("uuid");
const tableName = process.env.POSTS_TABLE;

// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

// Instantiate a table
const MyTable = new Table({
  // Specify table name (used by DynamoDB)
  name: tableName,

  // Define partition and sort keys
  partitionKey: "pk",
  // sortKey: "sk",

  // Add the DocumentClient
  DocumentClient,
});

const Customer = new Entity({
  // Specify entity name
  name: "Customer",

  // Define attributes
  attributes: {
    id: { partitionKey: true }, // flag as partitionKey
    // sk: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden
    name: { map: "data" }, // map 'name' to table attribute 'data'
    co: { alias: "company" }, // alias table attribute 'co' to 'company'
    age: { type: "number" }, // set the attribute type
    // status: ["sk", 0], // composite key mapping
    // date_added: ["sk", 1], // composite key mapping
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
    name: "Jane Smith",
    company: "ACME",
    age: 35,
    // status: "active",
    // date_added: "2020-04-24",
  };

  // let result = await Customer.put(item)

  return Customer.put(item)
    .then(() => {
      return callback(null, response(201, objectSaved));
    })
    .catch((err) => {
      return response(null, response(err.statusCode, err));
    });
};

// Get a single post
module.exports.getPost = (event, context, callback) => {
  const id = event.pathParameters.id;

  return Customer.get({ id: id, status: "active" })
    .then((myItem) => {
      // the item was found
      return callback(null, response(200, myItem));
    })
    .catch((err) => {
      // the item was not found or other errors
      return callback(null, response(404, { error: err }));
    });
};
