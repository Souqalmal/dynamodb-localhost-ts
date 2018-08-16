'use strict';

import {Installer} from './dynamodb/installer';
import {Starter} from './dynamodb/starter';
import {Utils} from './dynamodb/utils';
import * as config from './dynamodb/config.json';

export class DynamodbManager {

    private dbInstances:any;
    
    constructor() {
	this.dbInstances = {};
    }
    
    public install(callback: any, path: string):void {
        if (path) {
            config.setup.install_path = path;
        }
	const installer:Installer = new Installer();
        installer.install(config, function(msg: string) {
            console.log(msg);
            callback();
        });
    }
    
    public start(options: any):void {
	const starter:Starter = new Starter();
        const instance = starter.start(options, config);
        this.dbInstances[instance.port] = {
            process: instance.proc,
            options: options
        };
        instance.proc.on('close', function(code: any) {
            if (code !== null && code !== 0) {
                console.log('DynamoDB Local failed to start with code', code);
            }
        });
        console.log('Dynamodb Local Started, Visit: http://localhost:' + (options.port || config.start.port) + '/shell');
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
    
    public remove(callback: any):void {
	const utils:Utils = new Utils();
        utils.removeDir(config.setup.install_path);
    }
}
