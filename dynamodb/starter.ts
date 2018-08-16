'use strict';

var spawn = require('child_process').spawn;
import {Utils} from './utils';

export class Starter {
    public start(options: any, config: any):any {
	const utils:Utils = new Utils();
        var additionalArgs = [],
        port = options.port || config.start.port,
        db_dir = options.install_path || utils.absPath(config.setup.install_path),
        jar = config.setup.jar;

        if (options.dbPath) {
	    additionalArgs.push('-dbPath', options.dbPath);
        } else {
	    additionalArgs.push('-inMemory');
        }
        if (options.sharedDb) {
	    additionalArgs.push('-sharedDb');
        }
        if (options.cors) {
	    additionalArgs.push('-cors', options.cors);
        }
        if (options.delayTransientStatuses) {
	    additionalArgs.push('-delayTransientStatuses');
        }
        if (options.optimizeDbBeforeStartup) {
	    additionalArgs.push('-optimizeDbBeforeStartup');
        }
        if (options.help) {
	    additionalArgs.push('-help');
        }

        var args = ['-Djava.library.path=' + db_dir + '/DynamoDBLocal_lib', '-jar', jar, '-port', port];
        args = args.concat(additionalArgs);

        var child = spawn('java', args, {
	    cwd: db_dir,
	    env: process.env,
	    stdio: ['pipe', 'pipe', process.stderr]
        });

        if (!child.pid) {
	    throw new Error('Unable to start DynamoDB Local process!');
        }

        child.on('error', function (code:any) {
	    throw new Error(code);
        });

        return {
	    proc: child,
	    port: port
        };
    }
}
