const http = require('http');
const app = require('./server/app');
const log4js = require('log4js');
log4js.configure({
    appenders: { book: { type: 'file', filename: 'logs/classifier_be.log' }, out: { type: 'stdout' } },
    categories: { default: { appenders: ['book', 'out'], level: 'debug' } }
});
const logger = log4js.getLogger('book');

const normalizePort = val => {
    let port = parseInt(val,10);

    if(isNaN(port)) {
    return val;
    }

    if(port >= 0) {
    return port;
    }
    return false;
}

const onError = error => {
    if(error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch(error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated priviledges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening = ()=> {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    logger.debug("Listening on " + bind);
}

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);