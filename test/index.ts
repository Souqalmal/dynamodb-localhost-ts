'use strict';

import { DynamodbLocalManager } from '../dist';

let dynamo:DynamodbLocalManager = new DynamodbLocalManager();

console.log(dynamo.config);
dynamo.config.install_path = "/tmp";
dynamo.config.download_url = "http://192.168.1.105:8080/dynamodb_local_latest.tar.gz";
dynamo.install(function() {console.log(arguments);});
