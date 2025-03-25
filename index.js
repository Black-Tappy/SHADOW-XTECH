const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');

const RESTART_DELAY = 3000; // ms
const TIMEZONE = "Africa/Nairobi";

let coreProcess = null;

function getLogFileName() {
  return `${moment().tz(TIMEZONE).format('YYYY-MM-DD')}.log`;
}

function createTmpFolder() {
  const folderPath = path.join(__dirname, 'tmp');
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
}

createTmpFolder();

function logMessage(message) {
  const timestamp = moment().tz(TIMEZONE).format('HH:mm z');
  console.log(`[CYPHER-X] ${message}`);
  fs.appendFileSync(path.join(__dirname, 'tmp', getLogFileName()), `[${timestamp}] ${message}\n`);
}

function start() {
  process.env.NODE_OPTIONS = '--no-deprecation';

  const args = [path.join(__dirname, 'cypher.js'), ...process.argv.slice(2)];
  logMessage('Starting CypherX...');

  const logFilePath = path.join(__dirname, 'tmp', getLogFileName());
  const errorLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  coreProcess = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'pipe', 'ipc'],
  });

  coreProcess.stderr.on('data', (data) => {
    const errorMsg = `[${moment().tz(TIMEZONE).format('HH:mm z')}] ${data.toString()}`;
    console.error(errorMsg);
    errorLogStream.write(errorMsg);
  });

  coreProcess.on('exit', (code) => {
    errorLogStream.end();
    logMessage(`Exited with code: ${code}`);
    setTimeout(start, RESTART_DELAY);
  });

  const handleShutdown = (signal) => {
    logMessage(`Shutting down CypherX due to ${signal}...`);
    coreProcess.kill();
    errorLogStream.end();
    process.exit(0);
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

start();