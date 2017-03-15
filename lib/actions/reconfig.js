var nodemiral = require('nodemiral');
var fs = require('fs');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var SCRIPT_DIR = path.resolve(__dirname, '../../scripts/reconfig');
var TEMPLATES_DIR = path.resolve(__dirname, '../../templates/push');
exports.reconfig = function(config) {
    var taskList = nodemiral.taskList('Reconfig ' + config.appName + ' application');
    var appName = config.appName;
    var rootPath = config.setup.path;
    var rootPort = config.deploy.env.PORT;

    //上传settings.json
    if(config.settingsJson){
      taskList.copy('Uploading settings.json', {
          src: config.settingsJson,
          dest: rootPath + appName + '/settings.json'
      });
    }

    //重新生成启动脚本并上传: app.json
    taskList.copy('Re-Initializing start script', {
        src: path.resolve(TEMPLATES_DIR, 'app.json'),
        dest: rootPath + appName + '/app.json',
        vars: {
            appName: appName,
            env: config.deploy.env,
            rootPath: rootPath
        }
    });

    // 用pm2重新启动应用
    taskList.executeScript('Reconfig app.json', {
        script: path.resolve(SCRIPT_DIR, 'reconfig.sh'),
        vars: {
            appName: appName,
            rootPath: rootPath,
            rootPort: rootPort
        }
    });

    return taskList;
};
