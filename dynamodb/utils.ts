'use strict';

import * as path from 'path';
import * as fs from 'fs-extra';


var absPath = function (p: string) {
  if (path.isAbsolute(p)) {
    return p;
  } else {
    return path.join(path.dirname(__filename), p);
  }
};

var removeDir = function (relPath: string, callback) {
    var path = absPath(relPath);
    fs.removeSync(path, callback);
};

var createDir = function (relPath: string) {
    if (!fs.existsSync(absPath(relPath))) {
        fs.mkdirSync(absPath(relPath));
    }
};

export = {
    absPath: absPath,
    removeDir: removeDir,
    createDir: createDir
};
