'use strict';

import * as tar from 'tar';
import {Unzip} from 'zlib';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';
import ProgressBar from 'progress';
import {Utils} from './utils';

export class Installer {
    public download(downloadUrl: string, installPath: string, callback: any):void {
	console.log("Started downloading Dynamodb-local. Process may take few minutes.");
	http.get(downloadUrl, function (response) {
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
		.pipe(Unzip())
		.pipe(tar.Extract({
                    path: installPath
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

    public install(config:any, callback:any):void {
	const utils:Utils = new Utils();
	var install_path = utils.absPath(config.setup.install_path),
        jar = config.setup.jar,
        download_url = config.setup.download_url;

	try {
            if (fs.existsSync(path.join(install_path, jar))) {
		callback("Dynamodb is already installed on path!");
            } else {
		utils.createDir(config.setup.install_path);
		this.download(download_url, install_path, callback);
            }
	} catch (e) {}
    };
}
