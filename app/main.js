const {app, BrowserWindow, ipcMain, shell} = require('electron')
const path = require('path')
const url = require('url')
const execFile = require('child_process').execFile
const settings = require('./shared/configuration')
const moment = require('./bower_components/moment/min/moment.min.js')
const jsonfile = require('jsonfile')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  if (!settings.readSettings('startdate')) {
    let settingsObj = {
      "startdate": "2016-07-01",
      "enddate": "2016-09-30",
      "ip-stored": null,
      "temperature-source-path": "./",
      "temperature-target-path": "./",
      "temperature-locations": 0,
      "template-path-file": "app/batch-qn-yyyy.json",
      "batch-path": "./",
      "shell-path": "./",
      "database-name": null,
      "database-password": null,
      "database-backup-path": "./",
      "flask-server": "./",
      "flask-config": "./flask.cfg",
      "flask-upload-app": "./",
      "local-site": "http://127.0.0.1:5000/",
      "remote-site": null,
      "api-url": null,
      "water": [],
      "backups": [],
      "selected-backup": null
    }
    for (let prop in settingsObj) {
      settings.saveSettings(prop, settingsObj[prop]);
    }
  }

  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// returns slightly different format than function in data.services
let getRange = function() {
  let range = {};
  range.start  = moment(settings.readSettings('startdate'), 'YYYY-MM-DD');
  range.end    = moment(settings.readSettings('enddate'), 'YYYY-MM-DD');
  range.name   = range.start.format('YYYY-MM') + '-' + range.end.format('MM');
  range.months = range.end.diff(range.start, 'months')+1;
  range.monthsArr = [];
  for (let m=0; m<range.months; m++) {
    range.monthsArr.push( range.start.clone().add(m, 'M').format('YYYY-MM') );
  }
  range.monthsArr.unshift('Plot');
  console.dir(range);
  return range;
},

writeJSON = function(file, obj) {
  jsonfile.writeFile(file, obj, {spaces: 2}, function (err) {
    console.error(err)
  })
},

updateBatch = function() {
  let range = getRange();
  let template = jsonfile.readFileSync(settings.readSettings('template-path-file'));
  //console.dir(template);
  // replace start_datetime
  template.energy[0].start_datetime = range.start.format('YYYY-MM-DD HH:mm:ss');
  // replace end_datetime
  template.energy[0].end_datetime = range.end.add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
  // iterate through temperature onjects, replace date in filename
  for (let item of template.temperature) {
    let curfilename = item.filename;
    item.filename = curfilename.replace(/([0-9]{4}-[0-9]{2}-[0-9]{2})/, range.name);
  }
  // update estimated year if needed
  // tbd

  // replace water array
  template.water = settings.readSettings('water');

  let batchPath = settings.readSettings('batch-path');
  let jsonFile = 'batch-' + range.name + '.json';
  writeJSON(batchPath + jsonFile, template);
},

updateServer = function(event, msg, where) {
  var shellPath = settings.readSettings('shell-path');
  let env = { 'SIMPLE_SETTINGS': 'settings_' + where };
  let path = settings.readSettings('flask-upload-app');
  let range = getRange();
  let jsonFile = 'batch-' + range.name + '.json';
  let args = [path, jsonFile, range.start.format('YYYY-MM-DD'), range.end.add(1, 'd').format('YYYY-MM-DD'), where];

  const spawn = require('child_process').spawn;
  const child = spawn('./upload_data.sh', args, {'cwd': shellPath, 'env': env, 'shell': true}, {
  });

  child.stdout.on('data', (data) => {
    event.sender.send('electron-msg', { 'sender': msg, 'response': data } );
  });
  child.stderr.on('data', (data) => {
    console.log(`shell exited with code ${data}`);
    event.sender.send('electron-msg', { 'sender': msg, 'response': data } );
  });
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`shell exited with code ${code}`);
      event.sender.send('electron-msg', { 'sender': msg, 'response': 'Error' } );
    }
    else {
      event.sender.send('electron-msg', { 'sender': msg, 'response': 'Update complete'} );
    }
  });

}

ipcMain.on('electron-msg', (event, msg) => {
  var shellPath = settings.readSettings('shell-path');
  console.log(msg);

  if (msg == 'trim') {
    let range = getRange();
    let source = settings.readSettings('temperature-source-path');
    let target = settings.readSettings('temperature-target-path');
    const shellcmd = execFile('./temperature_trim.sh', [source, target, range.name, range.monthsArr.join(' ') ], {'cwd': shellPath}, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'trim-precheck') {
    let range = getRange();
    let path = settings.readSettings('temperature-source-path');
    const exec = require('child_process').exec;
    exec('ls ' + path + '\*' + range.name + '.csv | grep -c temperature', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        event.sender.send('electron-msg', { 'sender': msg, 'response': 'Not ready: files not found.'} );
        return;
      }
      if (stdout == settings.readSettings('temperature-locations')) {
        event.sender.send('electron-msg', { 'sender': msg, 'response': 'Ready'} );
      }
    });
  }

  if (msg == 'database-status') {
    const shellcmd = execFile('./mysqld.sh', ['status'], {'cwd': shellPath}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        throw error;
      }
      console.log('database status = ' + stdout);
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'database-start') {
    const spawn = require('child_process').spawn;
    const child = spawn('./mysqld.sh', ['start'], {'cwd': shellPath}, {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    event.sender.send('electron-msg', { 'sender': msg, 'response': 'Running'} );
  }

  if (msg == 'database-stop') {
    const shellcmd = execFile('./mysqld.sh', ['stop'], {'cwd': shellPath}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        throw error;
      }
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'database-backup') {
    let databaseName = settings.readSettings('database-name');
    let password = settings.readSettings('database-password');

    let backups = settings.readSettings('backups');
    let backupPath = settings.readSettings('database-backup-path');
    backups.push(backupPath + databaseName + '_' + moment().format('YYYYMMDDHHMMmmss') + '.sql.gz');
    settings.saveSettings('backups', backups);
    settings.saveSettings('selected-backup', backups[backups.length-1]);

    const shellcmd = execFile('./mysqld.sh', ['backup', databaseName, password, backups[backups.length-1]], {'cwd': shellPath, 'env':'LS_COLWIDTHS=0:0:0:10:10:0:10:0'}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        throw error;
      }
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'database-restore') {
    let backupFile = settings.readSettings('selected-backup');
    let databaseName = settings.readSettings('database-name');
    let password = settings.readSettings('database-password');
    const shellcmd = execFile('./mysqld.sh', ['restore', databaseName, password, backupFile], {'cwd': shellPath}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        throw error;
      }
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'server-status') {
    const shellcmd = execFile('./flask_server.sh', ['status'], {'cwd': shellPath}, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'server-start') {
    let flaskServer = settings.readSettings('flask-server');
    let flaskConfig = settings.readSettings('flask-config');

    const spawn = require('child_process').spawn;

    const child = spawn('./flask_server.sh', ['start', flaskServer, flaskConfig], {'cwd': shellPath}, {
      detached: true,
      stdio: 'ignore'
    });

    child.unref();
    event.sender.send('electron-msg', { 'sender': msg, 'response': 'Running'} );

  }

  if (msg == 'server-stop') {

    const shellcmd = execFile('./flask_server.sh', ['stop'], {'cwd': shellPath}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        throw error;
      }
      event.sender.send('electron-msg', { 'sender': msg, 'response': stdout} );
    });
  }

  if (msg == 'batch-update') {
    updateBatch();
  }

  if (msg == 'local-update') {
    updateServer(event, msg, 'test');
  }

  if (msg == 'local-browse') {
    let site = settings.readSettings('local-site');
    shell.openExternal(site);
  }

  if (msg == 'remote-update') {
    updateServer(event, msg, 'prod');
  }

  if (msg == 'remote-browse') {
    let site = settings.readSettings('remote-site');
    shell.openExternal(site);
  }

  // curl ipecho.net/plain
  if (msg == 'get-ip') {
    const exec = require('child_process').exec;
    exec('curl ipecho.net/plain', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        event.sender.send('electron-msg', { 'sender': msg, 'response': error } );
        return;
      }
      else {
        //settings.saveSettings('ip-current', stdout);
        event.sender.send('electron-msg', { 'sender': msg, 'response': stdout } );
      }
    });
  }


});
