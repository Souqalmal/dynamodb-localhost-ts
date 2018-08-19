'use strict';

export class Config {

    download_url:string;
    install_path:string;
    jar:string;
    port:number;
    db_path:string;
    in_memory:boolean;
    shared_db:boolean;
    cors:string;
    delay_transient_statuses:boolean;
    optimize_db_before_startup:boolean;
    help:boolean;

    constructor() {
	this.download_url = "https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz";
	this.install_path = "/bin";
	this.jar = "DynamoDBLocal.jar";
	this.port = 8000;
	this.db_path = "";
	this.in_memory = true;
	this.shared_db = false;
	this.cors = "";
	this.delay_transient_statuses = false;
	this.optimize_db_before_startup = false;
	this.help = false;
    };
}
