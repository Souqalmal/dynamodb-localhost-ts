'use strict';

var spawn = require('child_process').spawn;
import {Utils} from './utils';
import {Config} from './config';

export class Starter {
    public start(config: Config):any {
	const utils:Utils = new Utils();
        var additionalArgs = [],
        port = config.port,
        db_dir = utils.absPath(config.install_path),
        jar = config.jar;

        if (config.in_memory == true) {
	    additionalArgs.push('-inMemory');
        } else {
	    additionalArgs.push('-dbPath', config.db_path);
        }
        if (config.shared_db == true) {
	    additionalArgs.push('-sharedDb');
        }
        if (config.cors != "") {
	    additionalArgs.push('-cors', config.cors);
        }
        if (config.delay_transient_statuses == true) {
	    additionalArgs.push('-delayTransientStatuses');
        }
        if (config.optimize_db_before_startup == true) {
	    additionalArgs.push('-optimizeDbBeforeStartup');
        }
        if (config.help == true) {
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
