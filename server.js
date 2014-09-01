var fs = require('fs'),
    express = require('express'),
    winston = require('winston'),
    nomnom = require("nomnom")
        .option('port', {
            abbr: 'p',
            default: 1234,
            help: 'the port I will listen to'
        })
        .option('dw-host', {
            help: 'The host under which Datawrapper is running',
            default: 'http://datawrapper.de'
        })
        .option('test', {
            help: 'Activates the test page under /test',
            flag: true,
            default: false
        })
        .option('phantomjs', {
            help: 'Complete path of phantomjs binary',
            default: 'phantomjs'
        }),
    argv = nomnom.parse(),
    app = express();

// Hook in a custom middleware so we can
// access the raw request body
app.use(rawBody());


app.get('/', function(req, res) {
    res.send('Plugin repository is running fine!');
});

var plugins = [];

/*
 * returns list of all available plugins and
 * their latest version number
 *
 */
app.get('/list', function(req, res) {
    res.send(JSON.stringify(plugins));
});

/*
 * force reloading of plugin repository from
 * the source APIs (bitbucket, github)
 */
app.post('/refresh', function(req, res) {
    // body...
});


/*
 * download a zip-file with the plugin content
 */
app.get('/load/:plugin_id', function(req, res) {
    // body...    
});


var http = require('http'),
    server = http.createServer(app);

winston.remove(winston.transports.Console); // remove default logger
winston.add(winston.transports.Console, { timestamp: true }); // add configured console logger
winston.info('Started server on port '+argv.port);

server.listen(argv.port);

/*
 * Custom middleware for express.js to let us access the request body.
 */
function rawBody() {
    return function parser(req, res, next) {
        if ('GET' == req.method || 'HEAD' == req.method) return next();
        if (!req.body) {
            var data = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                data += chunk;
            });
            req.on('end', function() {
                req.body = data;
                next();
            });
        } else {
            next();
        }
    };
}