let http = require('http');
let url = require('url');

http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    console.log(q.query);

    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(`Hello ${q.query['name']}`);
}).listen(process.env.PORT || 3000);