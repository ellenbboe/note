var net = require('net')
var url = require('url')
var http = require('http')

var hostname = '127.0.0.1'
var port = '8888'

var request = (creq,cres)=>{
    console.log(creq.header);
    var u = url.parse(creq.url);
    var options = {
        hostname : u.hostname,
        port : u.port || 80,
        path : u.path,
        method : creq.method,
        headers : creq.headers,
    };
//重新构建请求
    var preq = http.request(options, (pres)=>{
        cres.writeHead(pres.statusCode,pres.headers);//估计是添加头
        pres.pipe(cres);//装入
    }).on('error',function(e){
        cres.end();
    });
    creq.pipe(preq);
}

var connect = (creq, csock) =>{
    console.log(creq.headers);

    var u = url.parse("http://"+creq.url);

    var psock = net.connect(u.port, u.hostname, ()=>{
        csock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        psock.pipe(csock);
    }).on('error',(e)=>{
        csock.end();
    });
    csock.pipe(psock);
}


var proxy = http.createServer().on('request',request).on('connect',connect);
proxy.listen(port, hostname,() =>{
    console.log("Proxy run in 127.0.0.1:8888");
})
