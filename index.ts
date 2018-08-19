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

    public start(optional_config?:Config):void {
	const starter:Starter = new Starter();
	let starting_config = this.config;
	if (optional_config)
	    starting_config = optional_config;
        const instance = starter.start(starting_config);
        this.dbInstances[instance.port] = {
            process: instance.proc,
            config: starting_config
        };
        instance.proc.on('close', function(code: any) {
            if (code !== null && code !== 0) {
                console.log('DynamoDB Local failed to start with code', code);
            }
        });
        console.log('Dynamodb Local Started, Visit: http://localhost:' + (this.config.port) + '/shell');
    }

    public stop(port: number):void {
        if (this.dbInstances[port]) {
            this.dbInstances[port].process.kill('SIGKILL');
            delete this.dbInstances[port];
        }
    }

    public restart(port: number):void {
        const restart_config = this.dbInstances[port].config;
        this.stop(port);
        this.start(restart_config);
        console.log('Successfully restarted dynamodb local on port: ' + port);
    }

    public remove():void {
	const utils:Utils = new Utils();
        utils.removeDir(this.config.install_path);
    }
}
