# webRTC_terraform

Initial plan
1. Following a guide to learn the basics
2. See if I can provision an EC2 instance with docker installed and setup an signaling server running with peerJS at port 9000
3. Write the terraform template for it


sls_ddb package:
1. @aws/dynamodb-data-mapper
2. serverless-plugin-typescript

***Make sure you call: sls offline start or ddb won't run

What did I learn from trying to make something so simple work in DynamoDB:
1. Almost always to great know when it's appropriate to use DDB or something else.
2. Tried to figure out how to put an JSON/object into DDB
3. Spent a ton of time figuring out unrelated errors when trying to make dynamodb offline work
4. Spent a ton of time trying out different packages, adding layers of complexity to development when I should've just learned the DDB syntax and design pattern better
5. Discovered many past and current packages:
   1. DDB DataMapper For JS: I wanted to put an object into DDB, and found this package, it is depreciated, and maintainer recommended TypeDORM, like TypeORM, I need to learn more about Object relational mapping
   2. dynamodb-toolbox: promised to make single table design easy, wonder if I'm not understanding where I can use this package because we are defining the ddb table in yaml file, and this pkg can define a table and create entities from the function, there are very little documentation on where I can use this package. Big mystery
   3. Dynamoose: did not spend a lot of time on this package, but the funny thing is on dev.to there was an comment telling people to not use this package if they value their hair.
6. Finally, I managed to make dynamodb-toolbox work, it was a lot of trial and error, but I think you can't create any tables because it has to be created with yaml file. But you can develop it once the config is matching, needs more testing.
7. In conclusion, before using DDB, you must learn the basics or you will have a bad time. oh well.


Credits:
1. [WebRTC in 100 Seconds](https://www.youtube.com/watch?v=WmR9IMUD_CY)
2. [crub db](https://github.com/hidjou/classsed-lambda-dynamodb-api/blob/master/.gitignore)