'use strict';

import * as installer from './dynamodb/installer';
import * as starter from './dynamodb/starter';
import * as utils from './dynamodb/utils';
import * as config from './dynamodb/config.json';

const dbInstances = {};

const dynamodb = {
    install: function(callback, path) {
        if (path) {
            config.setup.install_path = path;
        }
        installer.install(config, function(msg: string) {
            console.log(msg);
            callback();
        });
    },
    start: function(options) {
        const instance = starter.start(options, config);
        dbInstances[instance.port] = {
            process: instance.proc,
            options: options
        };
        instance.proc.on('close', function(code) {
            if (code !== null && code !== 0) {
                console.log('DynamoDB Local failed to start with code', code);
            }
        });
        console.log('Dynamodb Local Started, Visit: http://localhost:' + (options.port || config.start.port) + '/shell');
    },
    stop: function(port: number) {
        if (dbInstances[port]) {
            dbInstances[port].process.kill('SIGKILL');
            delete dbInstances[port];
        }
    },
    restart: function(port: number) {
        const options = dbInstances[port].options;
        this.stop(port);
        this.start(options);
        console.log('Successfully restarted dynamodb local on port: ' + port);
    },
    remove: function(callback) {
        utils.removeDir(config.setup.install_path, function() {
            console.log('Successfully removed dynamodb local!');
            callback();
        });
    }
};
export = { dynamodb };
