const http = require('http');
const parseUrl = require('url').parse;
const handler = require('./handler');

module.exports = http.createServer((req, res) => {
    res.statusCode = 200;

    const url = parseUrl(req.url);
    
    if(req.url === '/'){
        handler.urlCall(req,res);
    }
    if(url.query){
        handler.query(req,res);
    }
    if (req.method === 'POST') {
        handler.post(req,res);
    }
    if (req.method === 'PUT') {
        handler.put(req,res);
    }
    if (req.method === 'DELETE') {
        handler.del(req, res);
    }
});