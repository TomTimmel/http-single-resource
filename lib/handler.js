const parseUrl = require('url').parse;
const sander = require('sander');
const bodyreader = require('./bodyreader');
const handler = {};


handler.urlCall = (req, res) => {
    res.write('Welcome to our home page! \n');
    sander.readdir('./lib/data-store')
        .then(fileData => {
            var fileArray = fileData.map((fileName) => {
                var fileNameComplete = 'lib/data-store/' + fileName;
                return sander.readFile(fileNameComplete);
            });
            Promise.all(fileArray)
        .then(data => {
            res.end(data.join(','));
        })
        .catch(err =>{
            console.error('error', err.message);
        });
        });
};
handler.query = (req, res) => {
    const url = parseUrl(req.url);
    sander.readFile('./lib/data-store/' + url.query + '.json')
        .then(data =>{
            res.end(data);
        })
        .catch(err =>{
            console.error('error', err.message); 
            res.statusCode = 400;
            res.end('That resource does not exist');  
        });
};
handler.post = (req, res) => {
    var id = Date.now();
    bodyreader(req, (err,data) => {
        sander.writeFile('./lib/data-store/', id + '.json', JSON.stringify(data))
            .catch(err =>{
                console.error('error', err.message);
            });
    });
    res.end(id.toString());

};
handler.put = (req, res) => {
    const url = parseUrl(req.url);
    var id = Date.now();
    if(url.query === null) {
        url.query = Date.now();
    }
    bodyreader(req, (err,data) => {
        sander.writeFile('./lib/data-store/', url.query + '.json', JSON.stringify(data))
            .catch(err => {
                console.error('error', err.message);
            });
    });
    res.end(id.toString());
};
handler.del = (req, res) => {
    const url = parseUrl(req.url);
    var id = Date.now();
    sander.unlink('./lib/data-store/' + url.query + '.json')
        .catch(err => {
            console.error('error', err.message);
        });
    res.end(id.toString());
};
module.exports = handler;