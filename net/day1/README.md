## day 1 HTTP 代理原理与实现
HTTP 客户端向代理发送请求报文，代理服务器需要正确地处理请求和连接（例如正确处理 Connection: keep-alive），同时向服务器发送请求，并将收到的响应转发给客户端。

假如我通过代理访问 A 网站，对于 A 来说，它会把代理当做客户端，完全察觉不到真正客户端的存在，这实现了隐藏客户端 IP 的目的。

数据经过代理服务器后可能会经过修改,要小心数据有效性


```js
1   │ var net = require('net')
2   │ var url = require('url')
3   │ var http = require('http')
4   │
5   │ var hostname = '127.0.0.1'
6   │ var port = '8888'
7   │
===================================
这个服务从请求报文中解析出请求 URL 和其他必要参数，新建到服务端的请求，并把代理收到的请求转发给新建的请求，最后再把服务端响应返回给浏览器。
===================================
8   │ var request = (creq,cres)=>{
9   │     console.log(creq.header);
10   │     var u = url.parse(creq.url);
===============
重新构建请求
===============
11   │     var options = {
12   │         hostname : u.hostname,
13   │         port : u.port || 80,
14   │         path : u.path,
15   │         method : creq.method,
16   │         headers : creq.headers,
17   │     };
18   │
==================
得到响应
==================
19   │     var preq = http.request(options, (pres)=>{
20   │         cres.writeHead(pres.statusCode,pres.headers);//估计是添加头
21   │         pres.pipe(cres);//装入
22   │     }).on('error',function(e){
23   │         cres.end();
24   │     });
25   │     creq.pipe(preq);
26   │ }
27   │
==================================
这个服务从 CONNECT 请求报文中解析出域名和端口，创建到服务端的 TCP 连接，并和 CONNECT 请求中的 TCP 连接串起来，最后再响应一个 Connection Established 响应。
===============================
28   │ var connect = (creq, csock) =>{
29   │     console.log(creq.headers);
30   │
31   │     var u = url.parse("http://"+creq.url);
32   │
33   │     var psock = net.connect(u.port, u.hostname, ()=>{
34   │         csock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
35   │         psock.pipe(csock);
36   │     }).on('error',(e)=>{
37   │         csock.end();
38   │     });
39   │     csock.pipe(psock);
40   │ }
41   │
42   │
43   │ var proxy = http.createServer().on('request',request).on('connect',connect);
44   │ proxy.listen(port, hostname,() =>{
45   │     console.log("Proxy run in 127.0.0.1:8888");
46   │ })
```

------------------
>分析代码主要思路:
使用nodejs,通过构建数据包进行http代理,实现转发,起到一个连接作用
  >>
  **part 1**
  发送的请求通过代理,代理解析出url的信息,与请求一起创建出新的包,发送给服务器,获得响应,在将响应转发给客户端
  **part 2**
  得到请求时,解析url的信息,得到域名和端口,服务器发出构建tcp链接的请求,之后将代理与服务器的tcp连接(a) 和 代理本身构建的tcp连接(b)结合,形成通路
