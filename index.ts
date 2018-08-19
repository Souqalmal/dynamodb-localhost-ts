'use strict';

import {Installer} from './dynamodb/installer';
import {Starter} from './dynamodb/starter';
import {Utils} from './dynamodb/utils';
import {Config} from './dynamodb/config';

export class DynamodbLocalManager {

    private dbInstances:any;
    config:Config;

    constructor() {
	this.dbInstances = {};
	this.config = new Config();
    }

    public install(callback: any):void {
	const installer:Installer = new Installer();
        installer.install(this.config, function(msg: string) {
            console.log(msg);
            callback();
        });
    }

    public start(options: any):void {
	const starter:Starter = new Starter();
        const instance = starter.start(options, this.config);
        this.dbInstances[instance.port] = {
            process: instance.proc,
	    options: options,
            config: this.config
        };
        instance.proc.on('close', function(code: any) {
            if (code !== null && code !== 0) {
                console.log('DynamoDB Local failed to start with code', code);
            }
        });
        console.log('Dynamodb Local Started, Visit: http://localhost:' + (options.port || this.config.port) + '/shell');
    }

    public stop(port: number):void {
        if (this.dbInstances[port]) {
            this.dbInstances[port].process.kill('SIGKILL');
            delete this.dbInstances[port];
        }
    }

    public restart(port: number):void {
        const options = this.dbInstances[port].options;
        this.stop(port);
        this.start(options);
        console.log('Successfully restarted dynamodb local on port: ' + port);
    }

    public remove():void {
	const utils:Utils = new Utils();
        utils.removeDir(this.config.install_path);
    }
}
