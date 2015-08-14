#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var http = require('http');
var url = require('url');
var execFileSync = require('child_process').execFileSync;

var PORT = 9191;

function handleRequest(req, res){
    function updateRepo(pathname) {
        var gitPull = execFileSync('bash', ['./update-repo.sh', pathname]);
        res.end(gitPull);
    }
    function cloneRepo(url, pathname) {
        var gitClone = execFileSync('bash', ['./clone-repo.sh', url, pathname]);
        res.end(gitClone);
    }

    try {
        var urlInfo = url.parse(req.url);
        var query = qs.parse(urlInfo.query);
        if (query && query.repo && query.name) {
            var pathname = path.join(process.cwd(), 'repo/' + query.name);
console.log(query.repo, query.name, pathname, new Date());
            var stat;
            try {
                stat = fs.statSync(pathname);
                if (stat.isDirectory()) {
console.log('directory exists, update');
                    updateRepo(pathname);
                } else {
console.log('not a directory, clone');
                    cloneRepo(query.repo, pathname);
                }
            } catch (err) {
console.log('directory not found, clone');
                cloneRepo(query.repo, pathname);
            }
        } else {
            res.end('repo not found. url: ' + req.url);
        }
    } catch (e) {
        res.end('error: ' + e);
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
