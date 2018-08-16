'use strict';

import * as path from 'path';
import * as fs from 'fs-extra';

export class Utils {
    public absPath(p: string):string {
	if (path.isAbsolute(p)) {
	    return p;
	} else {
	    return path.join(path.dirname(__filename), p);
	}
    };

    public removeDir(relPath: string):void {
	var path = this.absPath(relPath);
	fs.removeSync(path);
    };

    public createDir(relPath: string):void {
	if (!fs.existsSync(this.absPath(relPath))) {
            fs.mkdirSync(this.absPath(relPath));
	}
    };
}
