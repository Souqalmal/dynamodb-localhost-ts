'use strict';

import { DynamodbLocalManager } from '../dist';

let dynamo:DynamodbLocalManager = new DynamodbLocalManager();

console.log(dynamo.config);
dynamo.config.path = "/tmp";
dynamo.install(() => {console.log(arguments);});
