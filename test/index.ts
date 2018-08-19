'use strict';

import { DynamodbLocalManager } from '../dist';

let dynamo:DynamodbLocalManager = new DynamodbLocalManager();

dynamo.config.install_path = "/tmp/toto";
dynamo.config.download_url = "http://192.168.1.105:8080/dynamodb_local_latest.tar.gz";
console.log(dynamo.config);
dynamo.install(function() {console.log(arguments);});
dynamo.start();
dynamo.restart(dynamo.config.port);
dynamo.stop(dynamo.config.port);
