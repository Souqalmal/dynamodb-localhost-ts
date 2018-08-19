'use strict';

import * as tar from 'tar';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import ProgressBar from 'progress';
import {Utils} from './utils';
import {Config} from './config';

export class Installer {
    public download(config:Config, callback:any):void {
	console.log("Started downloading Dynamodb-local. Process may take few minutes.");
	console.log("Installation path is: " + config.install_path + ".");

	http.get(config.download_url, function (response) {
            let len = parseInt(response.headers['content-length'] || '0', 10);
            let bar:ProgressBar = new ProgressBar('Downloading dynamodb-local [:bar] :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 40,
                total: len
            });

            if (200 != response.statusCode) {
		throw new Error('Error getting DynamoDb local latest tar.gz location ' + response.headers.location + ': ' + response.statusCode);
            }
            response
		.pipe(tar.x({
		    C: config.install_path // alias for cwd:'some-dir', also ok
		}))
		.on('data', function (chunk:any) {
                    bar.tick(chunk.length);
		})
		.on('end', function () {
                    callback("\n Installation complete!");
		})
		.on('error', function (err:Error) {
                    throw new Error("Error in downloading Dynamodb local " + err);
		});
	})
            .on('error', function (err:Error) {
		throw new Error("Error in downloading Dynamodb local " + err);
            });
    };

    public install(config:Config, callback:any):void {
	const utils:Utils = new Utils();
	config.install_path = utils.absPath(config.install_path);
	try {
            if (fs.existsSync(path.join(config.install_path, config.jar))) {
		callback("Dynamodb is already installed on path!");
            } else {
		utils.createDir(config.install_path);
		this.download(config, callback);
            }
	} catch (e) {}
    };
}
