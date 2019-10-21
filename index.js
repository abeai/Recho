'use strict';

function server(options = {}) {
    const path = require('path');
    const url = require('url');
    const URL = require('url').URL;

    options = Object.assign({
        disableRequestLogging: true,
        logger: false,
        https: false,
        ip: '0.0.0.0',
        port: 4270,
        log: true
    }, options);

    const app = require('fastify')(options);

    function response(req, res) {
        var urlParsed = new URL(`${options.https ? 'https' : 'http'}://${options.ip}:${options.port}${req.raw.url}`);

        if(options.log) {
          console.log({
              body: req.body,
              query: req.query,
              params: req.params,
              url: req.req.url,
              method: req.raw.method,
              headers: req.headers,
              // raw: req.raw,
              id: req.id,
              ip: req.ip,
              ips: req.ips,
              hostname: req.hostname,
          });
        }

        res.code(200).send({
            body: req.body,
            query: req.query,
            params: req.params,
            url: req.req.url,
            method: req.raw.method,
            headers: req.headers,
            // raw: req.raw,
            id: req.id,
            ip: req.ip,
            ips: req.ips,
            hostname: req.hostname,
        });
    }

    app.all('/redirect', (req, res) => {
        res.redirect(req.query.url);
    });

    app.all('/econnreset', (req, res) => {
        req.req.socket.destroy();
    });

    var flipflop = false;

    app.all('/econnreset/flipflop', (req, res) => {
        if (!flipflop) {
            req.req.socket.destroy();
            flipflop = true;
        } else {
            flipflop = false;
            res.send();
        }

    });

    // app.all('/exit', (req, res) => {
    //     process.exit(1);
    // });

    app.all(['/'], response);
    app.all(['/:param1'], response);
    app.all(['/:param1/:param2'], response);
    app.all(['/:param1/:param2/:param3'], response);
    app.all(['/:param1/:param2/:param3/:param4'], response);
    app.listen(options.port, options.ip);
}

module.exports = server;
