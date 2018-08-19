'use strict';

export class Config {

    download_url:string;
    install_path:string;
    jar:string;
    port:number;

    constructor() {
	this.download_url = "https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz";
	this.install_path = "/bin";
	this.jar = "DynamoDBLocal.jar";
	this.port = 8000;
    };
}
