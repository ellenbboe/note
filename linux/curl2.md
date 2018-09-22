### URL globbing(似乎很厉害...可以当下载工具)
At times you want to get a range of URLs that are mostly the same, with only a small portion of it changing between the requests. Maybe it is a numeric range or maybe a set of names. curl offers "globbing" as a way to specify many URLs like that easily.

The globbing uses the reserved symbols **[]** and **{}** for this, symbols that normally cannot be part of a legal URL (except for numerical IPv6 addresses but curl handles them fine anyway). If the globbing gets in your way, disable it with -g, --globoff.

While most transfer related functionality in curl is provided by the libcurl library, the URL globbing feature is not!

#### Numerical ranges
You can ask for a numerical range with **[N-M]** syntax, where N is the start index and it goes up to and including M. For example, you can ask for 100 images one by one that are named numerically:
`curl -O http://example.com/[1-100].png`
and it can even do the ranges with zero prefixes, like if the number is three digits all the time:
`curl -O http://example.com/[001-100].png`
Or maybe you only want even numbered images so you tell curl a step counter too. This example range goes from 0 to 100 with an increment of 2:
`curl -O http://example.com/[0-100:2].png`
#### Alphabetical ranges
curl can also do alphabetical ranges, like when a site has sections named a to z:
`curl -O http://example.com/section[a-z].html`
#### A list
Sometimes the parts don't follow such an easy pattern, and then you can instead give the full list yourself but then within the curly braces instead of the brackets used for the ranges:

`curl -O http://example.com/{one,two,three,alpha,beta}.html`
#### Combinations
You can use several globs in the same URL which then will make curl iterate over those, too. To download the images of Ben, Alice and Frank, in both the resolutions 100x100 and 1000x1000, a command line could look like:

`curl -O http://example.com/{Ben,Alice,Frank}-{100x100,1000x1000}.jpg`
Or download all the images of a chess board, indexed by two coordinates ranged 0 to 7:

`curl -O http://example.com/chess-[0-7]x[0-7].jpg`
And you can, of course, mix ranges and series. Get a week's worth of logs for both the web server and the mail server:
`curl -O http://example.com/{web,mail}-log[0-6].txt`
#### Output variables for globbing
In all the globbing examples previously in this chapter we have selected to use the **-O** / --remote-name option, **which makes curl save the target file using the file name part of the used URL**.

Sometimes that is not enough. You are downloading multiple files and maybe you want to save them in a different subdirectory or create the saved file names differently. curl, of course, has a solution for these situations as well: output file name variables.

Each "glob" used in a URL gets a separate variable. They are referenced as '**#[num]**' - that means the single letter '#' followed by the glob number which starts with 1 for the first glob and ends with the last glob.

Save the main pages of two different sites:
`curl http://{one,two}.example.com -o "file_#1.txt"`
Save the outputs from a command line with two globs in a subdirectory;
`curl http://{site,host}.host[1-5].example.com -o "subdir/#1_#2"`

### List all command-line options
curl has more than two hundred command-line options and the number of options keep increasing over time. Chances are the number of options will reach 250 within a few years.

In order to find out which options you need to perform as certain action, you can, of course, list all options, scan through the list and pick the one you are looking for. `curl --help` or simply `curl -h` will get you a list of all existing options with a brief explanation. If you don't really know what you are looking for, you probably won't be entirely satisfied.

Then you can instead opt to use `curl --manual` which will output the entire man page for curl plus an appended `tutorial` for the most common use cases. That is a very thorough and complete document on how each option works amassing several thousand lines of documentation. To wade through that is also a tedious work and we encourage use of a search function through those text masses. Some people will appreciate the man page in its web version.

### Config file
You can easily end up with curl command lines that use a very large number of command-line options, making them rather hard to work with. Sometimes the length of the command line you want to enter even hits the maximum length your command-line system allows. The Microsoft Windows command prompt being an example of something that has a fairly small maximum line length.

To aid such situations, curl offers a feature we call "`config file`". It basically allows you to write command-line options **in a text file** instead and then tell curl to read options from that file in addition to the command line.

You tell curl to read more command-line options from a specific file with the **-K/--config** option, like this:

**curl -K cmdline.txt http://example.com**
…and in the cmdline.txt file (which, of course, can use any file name you please) you enter each command line per line:
```
# this is a comment, we ask to follow redirects
--location
# ask to do a HEAD request
--head
```
The config file accepts both **short and long options**, exactly as you would write them on a command line. As a special extra feature, it also allows you to write the long format of the options **without the leading two dashes** to make it easier to read. Using that style, the config file shown above can alternatively be written as:
```
# this is a comment, we ask to follow redirects
location
# ask to do a HEAD request
head
```
Command line options that **take an argument must have its argument** provided on the same line as the option. For example changing the User-Agent HTTP header can be done with
`user-agent "Everything-is-an-agent"`

To allow the config files to look even more like a true config file, **it also allows you to use '=' or ':'** **between the option and its argument**. As you see above it isn't necessary, but some like the clarity it offers. Setting the user-agent option again:
user-agent = "Everything-is-an-agent"

The argument to an option **can be specified without double quotes** and then curl will **treat the next space** or **newline** as the end of the argument. So if you want to provide an argument with embedded spaces you **must use double quotes**.

The user agent string example we have used above has no white spaces and therefore it can also be provided without the quotes like:
`user-agent = Everything-is-an-agent`

Finally, if you **want to provide a URL in a config file**, you must do that the `--url` way, or just with url, and not like on the command line where basically everything that isn't an option is assumed to be a URL. So you provide a URL for curl like this:
url = "http://example.com"

#### Default config file
When curl is invoked, it always (unless -q is used) checks for a default config file and uses it if found. The file name it checks for is **.curlrc** on Unix-like systems and \_curlrc on Windows.

The default config file is checked for in the following places in this order:

curl tries to find the "home directory": It first checks for the CURL_HOME and then the HOME environment variables. Failing that, it uses getpwuid() on Unix-like systems (which returns the home directory given the current user in your system). On Windows, it then checks for the APPDATA variable, or as a last resort the '%USERPROFILE%\Application Data'.

On Windows, if there is no \_curlrc file in the home directory, it checks for one in the same directory the curl executable is placed. On Unix-like systems, it will simply try to load .curlrc from the determined home directory.

### Passwords and snooping
Passwords are tricky(复杂的) and sensitive. Leaking a password can make someone else than you access the resources and the data otherwise protected.

curl offers several ways to receive passwords from the user and then subsequently pass them on or use them to something else.

The most basic curl authentication option is **-u / --user**. It accepts an argument that is the user name and password, colon separated. Like when alice wants to request a page requiring HTTP authentication and her password is '12345':
`$ curl -u alice:12345 http://example.com/`

#### Command line leakage
Several potentially bad things are going on here. First, we are entering a password on the command line and the command line might be readable for other users on the same system (assuming you have a multi-user system). curl will help minimize that risk by trying to blank out passwords from process listings.

One way to avoid passing the user name and password on the command line is to instead use a .netrc file or a config file. You can also use the `-u` option without specifying the password, and then curl will instead prompt the user for it when it runs.(和sql一样有两种方式)

#### Network leakage
Secondly, this command line sends the user credentials to an HTTP server, which is a clear-text protocol that is open for man-in-the-middle or other snoopers to spy on the connection and see what is sent. In this command line example, it makes curl use HTTP Basic authentication and that is completely insecure.

There are several ways to avoid this, and the key is, of course, then to avoid protocols or authentication schemes that sends credentials in the plain over the network. Easiest is perhaps to make sure you use encrypted versions of protocols. Use HTTPS instead of HTTP, use FTPS instead of FTP and so on.

If you need to stick to a plain text and insecure protocol, then see if you can switch to using an authentication method that avoids sending the credentials in the clear. If you want HTTP, such methods would include Digest (`--digest`), Negotiate (`--negotiate`.) and NTLM (`--ntlm`).

### The progress meter(进度表)
curl has a built-in progress meter. When curl is invoked to transfer data (either uploading or downloading) it can show that meter in the terminal screen to show how the transfer is progressing, namely the current transfer speed, how long it has been going on and how long it thinks it might be left until completion.

The progress meter is inhibited if curl deems that there is output going to the terminal, as then would the progress meter interfere with that output and just mess up what gets displayed. A user can also forcibly switch off the progress meter with the -s / --silent option, which tells curl to hush.

If you invoke curl and don't get the progress meter, make sure your output is directed somewhere other than the terminal.

curl also features an alternative and simpler progress meter that you enable with -# / --progress-bar. As the long name implies, it instead shows the transfer as progress bar.

At times when curl is asked to transfer data, it can't figure out the total size of the requested operation and that then subsequently makes the progress meter contain fewer details and it cannot, for example, make forecasts for transfer times, etc.

Units
The progress meter displays bytes and bytes per second.

It will also use suffixes for larger amounts of bytes, using the 1024 base system so 1024 is one kilobyte (1K), 2048 is 2K, etc. curl supports these:

Suffix|	Amount|	Name
--|--|--
K	|2^10|	kilobyte
M	|2^20|	megabyte
G	|2^30|	gigabyte
T|	2^40|	terabyte
P|	2^50|	petabyte
The times are displayed using H:MM:SS for hours, minutes and seconds.

Progress meter legend
The progress meter exists to show a user that something actually is happening. The different fields in the output have the following meaning:

% |Total |   % |Received |% |Xferd | Average Dload| Speed  Upload  |      Time  Total |  Current   |      Left   |   Curr.Speed
--|--                            
0 | 151M |   0| 38608  |  0   |  0  | 9406   |   0 | 4:41:43 | 0:00:04 | 4:41:39 | 9287
From left to right:


Title	  |  Meaning
--|--
%	|Percentage completed of the whole transfer
Total	|Total size of the whole expected transfer (if known)
%	|Percentage completed of the download
Received|	Currently downloaded number of bytes
%	|Percentage completed of the upload
Xferd|	Currently uploaded number of bytes
Average Speed Dload|	Average transfer speed of the entire download so far, in number of bytes per second
Average Speed Upload|	Average transfer speed of the entire upload so far, in number of bytes per second
Time Total|	Expected time to complete the operation, in HH:MM:SS notation for hours, minutes and seconds
Time Current|	Time passed since the start of the transfer, in HH:MM:SS notation for hours, minutes and seconds
Time Left|	Expected time left to completion, in HH:MM:SS notation for hours, minutes and seconds
Curr.Speed	|Average transfer speed over the last 5 seconds (the first 5 seconds of a transfer is based on less time, of course) in number of bytes per second

### Using curl
Previous chapters have described some basic details on what curl is and something about the basic command lines. You use command-line options and you pass on URLs to work with.

In this chapter, we are going to dive deeper into a variety of different concepts of what curl can do and how to tell curl to use these features. You should consider all these features as different tools that are here to help you do your file transfer tasks as conveniently as possible.

#### Supported protocols
curl supports or can be made to support (if built so) the following protocols.

DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMTP, SMTPS, TELNET and TFTP

### Verbose mode
If your curl command doesn't execute or return what you expected it to, your first gut reaction should always be to run the command with the `-v` / `--verbose `option to get more information.

When verbose mode is enabled, curl gets more talkative and will explain and show a lot more of its doings. It will add informational tests and prefix them with '\*'. For example, let's see what curl might say when trying a simple HTTP example (**saving the downloaded data in the file called 'saved'**):
```
$ curl -v http://example.com -o saved
* Rebuilt URL to: http://example.com/
```
Ok so we invoked curl with a URL that it considers incomplete so it helps us and it adds a trailing slash before it moves on.
`*   Trying 93.184.216.34...`
This tells us curl now tries to **connect** to this IP address. It means the name **'example.com'** has been resolved to **one or more addresses** and this is the first (and possibly only) address curl will try to connect to.
`* Connected to example.com (93.184.216.34) port 80 (#0)`
It worked! curl connected to the site and here it explains how the name maps to the IP address and on which port it has connected to. The '(#0)' part is which internal number curl has given this connection. If you try multiple URLs in the same command line you can see it use more connections or reuse connections, so the connection counter may increase or not increase depending on what curl decides it needs to do.

If we use an `HTTPS://` URL instead of an `HTTP` one, there will also be a whole bunch of lines explaining how curl uses `CA certs` to verify the server's certificate and some details from the server's certificate, etc. Including which ciphers were selected and more TLS details.

In addition to the added information given from curl internals, the `-v` verbose mode will also make curl show all headers it sends and receives. For protocols without headers (like FTP, SMTP, POP3 and so on), we can consider commands and responses as headers and they will thus also be shown with -`v`.

If we then continue the output seen from the command above (but ignore the actual HTML response), curl will show:
```
> GET / HTTP/1.1
> Host: example.com
> User-Agent: curl/7.45.0
> Accept: */*
>
```

This is the full HTTP request to the site. This request is how it looks in a default curl 7.45.0 installation and it may, of course, differ slightly between different releases and in particular it will change if you add command line options.

The last line of the HTTP request headers looks empty, and it is. It signals the separation between the headers and the body, and in this request there is no "body" to send.

Moving on and assuming everything goes according to plan, the sent request will get a corresponding response from the server and that HTTP response will start with a set of headers before the response body:
```
< HTTP/1.1 200 OK
< Accept-Ranges: bytes
< Cache-Control: max-age=604800
< Content-Type: text/html
< Date: Sat, 19 Dec 2015 22:01:03 GMT
< Etag: "359670651"
< Expires: Sat, 26 Dec 2015 22:01:03 GMT
< Last-Modified: Fri, 09 Aug 2013 23:54:35 GMT
< Server: ECS (ewr/15BD)
< Vary: Accept-Encoding
< X-Cache: HIT
< x-ec-custom-error: 1
< Content-Length: 1270
<
```
This may look mostly like mumbo jumbo to you, but this is normal set of HTTP headers—metadata—about the response. The first line's "200" might be the most important piece of information in there and means "everything is fine".

The last line of the received headers is, as you can see, empty, and that is the marker used for the HTTP protocol to signal the end of the headers.(最后的空是用来标记报头的结束的)

After the headers comes the actual response body, the data payload. The regular `-v` verbose mode does not show that data but only displays
`{ [1270 bytes data]`

That 1270 bytes should then be in the 'saved' file. You can also see that there was a header named Content-Length: in the response that contained the exact file length (it won't always be present in responses).

#### --trace and --trace-ascii
There are times when `-v` is not enough. In particular, when you want to **store the complete stream including the actual transferred data.**

For situations when curl does encrypted file transfers with protocols such as HTTPS, FTPS or SFTP, other network monitoring tools (like Wireshark or tcpdump) won't be able to do this job as easily for you.

For this, curl offers two other options that you use instead of `-v`.

`--trace [filename]` will **save a full trace in the given file name**. You can also use '-' (a single minus) instead of a file name to get it passed to stdout. You would use it like this:
`$ curl --trace dump http://example.com`
When completed, there's a 'dump' file that can turn out pretty sizable. In this case, the 15 first lines of the dump file looks like:
```
== Info: Rebuilt URL to: http://example.com/
== Info:   Trying 93.184.216.34...
== Info: Connected to example.com (93.184.216.34) port 80 (#0)
=> Send header, 75 bytes (0x4b)
0000: 47 45 54 20 2f 20 48 54 54 50 2f 31 2e 31 0d 0a GET / HTTP/1.1..
0010: 48 6f 73 74 3a 20 65 78 61 6d 70 6c 65 2e 63 6f Host: example.co
0020: 6d 0d 0a 55 73 65 72 2d 41 67 65 6e 74 3a 20 63 m..User-Agent: c
0030: 75 72 6c 2f 37 2e 34 35 2e 30 0d 0a 41 63 63 65 url/7.45.0..Acce
0040: 70 74 3a 20 2a 2f 2a 0d 0a 0d 0a                pt: */*....
<= Recv header, 17 bytes (0x11)
0000: 48 54 54 50 2f 31 2e 31 20 32 30 30 20 4f 4b 0d HTTP/1.1 200 OK.
0010: 0a                                              .
<= Recv header, 22 bytes (0x16)
0000: 41 63 63 65 70 74 2d 52 61 6e 67 65 73 3a 20 62 Accept-Ranges: b
0010: 79 74 65 73 0d 0a                               ytes..
```
Every **single sent and received byte** get displayed individually in **hexadecimal numbers**.

If you think the hexadecimals aren't helping, you can try `--trace-ascii [filename]` instead, also this accepting '-' for stdout and that makes the 15 first lines of tracing look like:
```
== Info: Rebuilt URL to: http://example.com/
== Info:   Trying 93.184.216.34...
== Info: Connected to example.com (93.184.216.34) port 80 (#0)
=> Send header, 75 bytes (0x4b)
0000: GET / HTTP/1.1
0010: Host: example.com
0023: User-Agent: curl/7.45.0
003c: Accept: */*
0049:
<= Recv header, 17 bytes (0x11)
0000: HTTP/1.1 200 OK
<= Recv header, 22 bytes (0x16)
0000: Accept-Ranges: bytes
<= Recv header, 31 bytes (0x1f)
0000: Cache-Control: max-age=604800
```

#### --trace-time
This options prefixes all verbose/trace outputs with a high resolution timer for when the line is printed. It **works with** the regular `-v / --verbose` option as well as with `--trace` and `--trace-ascii`.

An example could look like this:

`$ curl -v --trace-time http://example.com`
```
23:38:56.837164 * Rebuilt URL to: http://example.com/
23:38:56.841456 *   Trying 93.184.216.34...
23:38:56.935155 * Connected to example.com (93.184.216.34) port 80 (#0)
23:38:56.935296 > GET / HTTP/1.1
23:38:56.935296 > Host: example.com
23:38:56.935296 > User-Agent: curl/7.45.0
23:38:56.935296 > Accept: */*
23:38:56.935296 >
23:38:57.029570 < HTTP/1.1 200 OK
23:38:57.029699 < Accept-Ranges: bytes
23:38:57.029803 < Cache-Control: max-age=604800
23:38:57.029903 < Content-Type: text/html
---- snip ----
```
The lines are all the local time as **hours:minutes:seconds** and then number of **microseconds** in that second.

#### HTTP/2
When doing file transfers using version two of the HTTP protocol, HTTP/2, curl sends and receives compressed headers. So to display outgoing and incoming HTTP/2 headers in a readable and understandable way, curl will actually show the uncompressed versions in a style similar to how they appear with HTTP/1.1.

#### --write-out
This is one of the often forgotten little gems in the curl arsenal of command line options. `--write-out` or just `-w` for short, writes out information after a transfer has completed and it has a large range of variables that you can include in the output, variables that have been set with values and information from the transfer.

You tell curl to write a string just by passing that string to this option:
`curl -w "formatted string" http://example.com/`
…and you can also have curl read that string from a given file instead if you prefix the string with '@':
`curl -w @filename http://example.com/`
…or even have curl read the string from stdin if you use '-' as filename:
`curl -w @- http://example.com/`

The variables that are available are accessed by writing `%{variable_name}`(提取变量) in the string and that variable will then be substituted by the correct value. To output a normal '%' you just write it as '%%'. You can also output a newline by using `'\n'`, a carriage return with `'\r'` and a tab space with `'\t'`.

(The %-symbol is special on the Windows command line, where all occurrences of % must be doubled when using this option.)

As an example, we can output the Content-Type and the response code from an HTTP transfer, separated with newlines and some extra text like this:
`curl -w "Type: %{content_type}\nCode: %{response_code}\n" http://example.com`

This feature writes **the output to stdout** so you probably want to make sure that you don't also send the downloaded content to stdout as then you might have a hard time to separate out the data.

#### Available --write-out variables
Some of these variables are not available in really old curl versions.
``
**%{content_type}** shows the Content-Type of the requested document, if there was any.

**%{filename_effective}** shows the ultimate filename that curl writes out to. This is only meaningful if curl is told to write to a file with the --remote-name or --output option. It's most useful in combination with the --remote-header-name option.

**%{ftp_entry_path}** shows the initial path curl ended up in when logging on to the remote FTP server.

**%{response_code}** shows the numerical response code that was found in the last transfer.

**%{http_connect}** shows the numerical code that was found in the last response (from a proxy) to a curl CONNECT request.

**%{local_ip}** shows the IP address of the local end of the most recently done connection—can be either IPv4 or IPv6

**%{local_port}** shows the local port number of the most recently made connection

**%{num_connects}** shows the number of new connects made in the recent transfer.

**%{num_redirects}** shows the number of redirects that were followed in the request.

**%{redirect_url}** shows the actual URL a redirect would take you to when an HTTP request was made without -L to follow redirects.

**%{remote_ip}** shows the remote IP address of the most recently made connection—can be either IPv4 or IPv6.

**%{remote_port}** shows the remote port number of the most recently made connection.

**%{size_download}** shows the total number of bytes that were downloaded.

**%{size_header}** shows the total number of bytes of the downloaded headers.

**%{size_request}** shows the total number of bytes that were sent in the HTTP request.

**%{size_upload**} shows the total number of bytes that were uploaded.

**%{speed_download}** shows the average download speed that curl measured for the complete download in bytes per second.

**%{speed_upload}** shows the average upload speed that curl measured for the complete upload in bytes per second.

**%{ssl_verify_result}** shows the result of the SSL peer certificate verification that was requested. 0 means the verification was successful.

**%{time_appconnect}** shows the time, in seconds, it took from the start until the SSL/SSH/etc connect/handshake to the remote host was completed.

**%{time_connect}** shows the time, in seconds, it took from the start until the TCP connect to the remote host (or proxy) was completed.

**%{time_namelookup}** shows the time, in seconds, it took from the start until the name resolving was completed.

**%{time_pretransfer}** shows the time, in seconds, it took from the start until the file transfer was just about to begin. This includes all pre-transfer commands and negotiations that are specific to the particular protocol(s) involved.

**%{time_redirect}** shows the time, in seconds, it took for all redirection steps including name lookup, connect, pre-transfer and transfer before the final transaction was started. time_redirect shows the complete execution time for multiple redirections.

**%{time_starttransfer}** shows the time, in seconds, it took from the start until the first byte was just about to be transferred. This includes time_pretransfer and also the time the server needed to calculate the result.

**%{time_total}** shows the total time, in seconds, that the full operation lasted. The time will be displayed with millisecond resolution.

**%{url_effective}** shows the URL that was fetched last. This is particularly meaningful if you have told curl to follow Location: headers (with -L).
``
#### Silence
The opposite of verbose is, of course, to make curl more silent. With the `-s` (or `--silent`) option you make curl switch off the progress meter and not output any error messages for when errors occur. It gets mute. It will still output the downloaded data you ask it to.

With silence activated, you can ask for it to still output the error message on failures by adding `-S` or `--show-error`.

### Persistent connections
When setting up TCP connections to sites, curl will keep the old connection around for a while so that if the next transfer is to the same host it can reuse the same connection again and thus save a lot of time. We call this persistent connections. curl will always try to keep connections alive and reuse existing connections as far as it can.

The curl command-line tool can, however, only keep connections alive for as long as it runs, so as soon as it exits back to your command line it has to close down all currently open connections (and also free and clean up all the other caches it uses to decrease time of subsequent operations). We call the pool of alive connections the "connection cache".

If you want to perform N transfers or operations against the same host or same base URL, you could gain a lot of speed by trying to do them in as few curl command lines as possible instead of repeatedly invoking curl with one URL at a time.

Downloads
"Download" means getting data from a server on a network, and the server is then clearly considered to be "above" you. This is loading data down from the server onto your machine where you are running curl.

Downloading is probably the most common use case for curl—retrieving the specific data pointed to by a URL onto your machine.

What exactly is downloading?
You specify the resource to download by giving curl a URL. curl defaults to downloading a URL unless told otherwise, and the URL identifies what to download. In this example the URL to download is "http://example.com":

curl http://example.com
The URL is broken down into its individual components (as explained elsewhere), the correct server is contacted and is then asked to deliver the specific resource—often a file. The server then delivers the data, or it refuses or perhaps the client asked for the wrong data and then that data is delivered.

A request for a resource is protocol-specific so a FTP:// URL works differently than an HTTP:// URL or an SFTP:// URL.

A URL without a path part, that is a URL that has a host name part only (like the "http://example.com" example above) will get a slash ('/') appended to it internally and then that is the resource curl will ask for from the server.

If you specify multiple URLs on the command line, curl will download each URL one by one. It won't start the second transfer until the first one is complete, etc.

Storing downloads
If you try the example download as in the previous section, you will notice that curl will output the downloaded data to stdout unless told to do something else. Outputting data to stdout is really useful when you want to pipe it into another program or similar, but it is not always the optimal way to deal with your downloads.

Give curl a specific file name to save the download in with -o [filename] (with --output as the long version of the option), where filename is either just a file name, a relative path to a file name or a full path to the file.

Also note that you can put the -o before or after the URL; it makes no difference:

curl -o output.html http://example.com/
curl -o /tmp/index.html http://example.com/
curl http://example.com -o ../../folder/savethis.html
This is, of course, not limited to http:// URLs but works the same way no matter which type of URL you download:

curl -o file.txt ftp://example.com/path/to/file-name.ext
If you ask curl to send the output to the terminal, it attempts to detect and prevent binary data from being sent there since that can seriously mess up your terminal (sometimes to the point where it basically stops working). You can override curl's binary-output-prevention and force the output to get sent to stdout by using -o -.

curl has several other ways to store and name the downloaded data. Details follow!

Download to a file named by the URL
Many URLs, however, already contain the file name part in the rightmost end. curl lets you use that as a shortcut so you don't have to repeat it with -o. So instead of:

curl -o file.html http://example.com/file.html
You can save the remove URL resource into the local file 'file.html' with this:

curl -O http://example.com/file.html
This is the -O (uppercase letter o) option, or --remote-name for the long name version. The -O option selects the local file name to use by picking the file name part of the URL that you provide. This is important. You specify the URL and curl picks the name from this data. If the site redirects curl further (and if you tell curl to follow redirects), it doesn't change the file name curl will use for storing this.

Get the target file name from the server
HTTP servers have the option to provide a header named Content-Disposition: in responses. That header may contain a suggested file name for the contents delivered, and curl can be told to use that hint to name its local file. The -J / --remote-header-name enables this. If you also use the -O option, it makes curl use the file name from the URL by default and only if there's actually a valid Content-Disposition header available, it switches to saving using that name.

-J has some problems and risks associated with it that users need to be aware of:

It will only use the rightmost part of the suggested file name, so any path or directories the server suggests will be stripped out.

Since the file name is entirely selected by the server, curl will, of course, overwrite any preexisting local file in your current directory if the server happens to provide such a file name.

File name encoding and character sets issues. curl does not decode the name in any way, so you may end up with a URL-encoded file name where a browser would otherwise decode it to something more readable using a sensible character set.

HTML and charsets
curl will download the exact binary data that the server sends. This might be of importance to you in case, for example, you download a HTML page or other text data that uses a certain character encoding that your browser then displays as expected. curl will then not translate the arriving data.

A common example where this causes some surprising results is when a user downloads a web page with something like:

curl https://example.com/ -o storage.html
…and when inspecting the storage.html file after the fact, the user realizes that one or more characters look funny or downright wrong. This can then very well be because the server sent the characters using charset X, while your editor and environment use charset Y. In an ideal world, we would all use UTF-8 everywhere but unfortunately, that is still not the case.

A common work-around for this issue that works decently is to use the common iconv utility to translate a text file to and from different charsets.

Compression
curl allows you to ask HTTP and HTTPS servers to provide compressed versions of the data and then perform automatic decompression of it on arrival. In situations where bandwidth is more limited than CPU this will help you receive more data in a shorter amount of time.

HTTP compression can be done using two different mechanisms, one which might be considered "The Right Way" and the other that is the way that everyone actually uses and is the widespread and popular way to do it! The common way to compress HTTP content is using the Content-Encoding header. You ask curl to use this with the --compressed option:

curl --compressed http://example.com/
With this option enabled (and if the server supports it) it delivers the data in a compressed way and curl will decompress it before saving it or sending it to stdout. This usually means that as a user you don't really see or experience the compression other than possibly noticing a faster transfer.

The --compressed option asks for Content-Encoding compression using one of the supported compression algorithms. There's also the rarer Transfer-Encoding method, which is the header that was created for this automated method but was never really widely adopted. You can tell curl to ask for Transfer-Encoded compression with --tr-encoding:

curl --tr-encoding http://example.com/
In theory, there's nothing that prevents you from using both in the same command line, although in practice, you may then experience that some servers get a little confused when ask to compress in two different ways. It's generally safer to just pick one.

Shell redirects
When you invoke curl from a shell or some other command-line prompt system, that environment generally provides you with a set of output redirection abilities. In most Linux and Unix shells and with Windows' command prompts, you direct stdout to a file with > filename. Using this, of course, makes the use of -o or -O superfluous.

curl http://example.com/ > example.html
Redirecting output to a file redirects all output from curl to that file, so even if you ask to transfer more than one URL to stdout, redirecting the output will get all the URLs' output stored in that single file.

curl http://example.com/1 http://example.com/2 > files
Unix shells usually allow you to redirect the stderr stream separately. The stderr stream is usually a stream that also gets shown in the terminal, but you can redirect it separately from the stdout stream. The stdout stream is for the data while stderr is metadata and errors, etc., that aren't data. You can redirect stderr with 2>file like this:

curl http://example.com > files.html 2>errors
Multiple downloads
As curl can be told to download many URLs in a single command line, there are, of course, times when you want to store these downloads in nicely-named local files.

The key to understanding this is that each download URL needs its own "storage instruction". Without said "storage instruction", curl will default to sending the data to stdout. If you ask for two URLs and only tell curl where to save the first URL, the second one is sent to stdout. Like this:

curl -o one.html http://example.com/1 http://example.com/2
The "storage instructions" are read and handled in the same order as the download URLs so they don't have to be next to the URL in any way. You can round up all the output options first, last or interleaved with the URLs. You choose!

These examples all work the same way:

curl -o 1.txt -o 2.txt http://example.com/1 http://example.com/2
curl http://example.com/1 http://example.com/2 -o 1.txt -o 2.txt
curl -o 1.txt http://example.com/1 http://example.com/2 -o 2.txt
curl -o 1.txt http://example.com/1 -o 2.txt http://example.com/2
The -O is similarly just an instruction for a single download so if you download multiple URLs, use more of them:

curl -O -O http://example.com/1 http://example.com/2
Use the URL's file name part for all URLs
As a reaction to adding a hundred -O options when using a hundred URLs, we introduced an option called --remote-name-all. This makes -O the default operation for all given URLs. You can still provide individual "storage instructions" for URLs but if you leave one out for a URL that gets downloaded, the default action is then switched from stdout to -O style.

"My browser shows something else"
A very common use case is using curl to get a URL that you can get in your browser when you paste the URL in the browser's address bar.

But a browser getting a URL does so much more and in so many different ways than curl that what curl shows in your terminal output is probably not at all what you see in your browser window.

Client differences
Curl only gets exactly what you ask it to get and it never parses the actual content—the data—that the server delivers. A browser gets data and it activates different parsers depending on what kind of content it thinks it gets. For example, if the data is HTML it will parse it to display a web page and possibly download other sub resources such as images, JavaScript and CSS files. When curl downloads a HTML it will just get that single HTML resource, even if it, when parsed by a browser, would trigger a whole busload of more downloads. If you want curl to download any sub-resources as well, you need to pass those URLs to curl and ask it to get those, just like any other URLs.

Clients also differ in how they send their requests, and some aspects of a request for a resource include, for example, format preferences, asking for compressed data, or just telling the server from which previous page we are "coming from". curl's requests will differ a little or a lot from how your browser sends its requests.

Server differences
The server that receives the request and delivers data is often setup to act in certain ways depending on what kind of client it thinks communicates with it. Sometimes it is as innocent as trying to deliver the best content for the client, sometimes it is to hide some content for some clients or even to try to work around known problems in specific browsers. Then there's also, of course, various kind of login systems that might rely on HTTP authentication or cookies or the client being from the pre-validated IP address range.

Sometimes getting the same response from a server using curl as the response you get with a browser ends up really hard work. Users then typically record their browser sessions with the browser's networking tools and then compare that recording with recorded data from curl's --trace-ascii option and proceed to modify curl's requests (often with -H / --header) until the server starts to respond the same to both.

This type of work can be both time consuming and tedious. You should always do this with permission from the server owners or admins.

Intermediaries' fiddlings
Intermediaries are proxies, explicit or implicit ones. Some environments will force you to use one or you may choose to use one for various reasons, but there are also the transparent ones that will intercept your network traffic silently and proxy it for you no matter what you want.

Proxies are "middle men" that terminate the traffic and then act on your behalf to the remote server. This can introduce all sorts of explicit filtering and "saving" you from certain content or even "protecting" the remote server from what data you try to send to it, but even more so it introduces another software's view on how the protocol works and what the right things to do are.

Interfering intermediaries are often the cause of lots of head aches and mysteries down to downright malicious modifications of content.

We strongly encourage you to use HTTPS or other means to verify that the contents you are downloading or uploading are really the data that the remote server has sent to you and that your precious bytes end up verbatim at the intended destination.

Rate limiting
When curl transfers data, it will attempt to do that as fast as possible. It goes for both uploads and downloads. Exactly how fast that will be depends on several factors, including your computer's ability, your own network connection's bandwidth, the load on the remote server you are transferring to/from and the latency to that server. And your curl transfers are also likely to compete with other transfers on the networks the data travels over, from other users or just other apps by the same user.

In many setups, however, you will find that you can more or less saturate your own network connection with a single curl command line. If you have a 10 megabit per second connection to the Internet, chances are curl can use all of those 10 megabits to transfer data.

For most use cases, using as much bandwidth as possible is a good thing. It makes the transfer faster, it makes the curl command complete sooner and it will make the transfer use resources from the server for a shorter period of time.

Sometimes you will, however, find that having curl starve out other network functions on your local network connection is inconvenient. In these situations you may want to tell curl to slow down so that other network users get a better chance to get their data through as well. With --limit-rate [speed] you can tell curl to not go faster than the given number of bytes per second. The rate limit value can be given with a letter suffix using one of K, M and G for kilobytes, megabytes and gigabytes.

To make curl not download data any faster than 200 kilobytes per second:

curl https://example.com/ --limit-rate 200K
The given limit is the maximum average speed allowed, counted during the entire transfer. It means that curl might use higher transfer speeds in short bursts, but over time it uses no more than the given rate.

Also note that curl never knows what the maximum possible speed is—it will simply go as fast as it can and is allowed. You may know your connection's maximum speed, but curl does not.

Maximum filesize
When you want to make sure your curl command line won't try to download a too-large file, you can instruct curl to stop before doing that, if it knows the size before the transfer starts! Maybe that would use too much bandwidth, take too long time or you don't have enough space on your hard drive:

curl --max-filesize 100000 https://example.com/
Give curl the largest download you will accept in number of bytes and if curl can figure out the size before the transfer starts it will abort before trying to download something larger.

There are many situations in which curl cannot figure out the size at the time the transfer starts and this option will not affect those transfers, even if they may end up larger than the specified amount.

Metalink
Metalink is a file description standard that tells a client multiple locations where the same content resides. A client can then opt to transfer that content from one or many of those sources.

curl supports the Metalink format when asked to with the --metalink option. Then given URL should then point to a Metalink file. Such as:

curl --metalink https://example.com/example.metalink
curl will make use of the mirrors listed within the file for failover if there are errors (such as the file or server not being available). It will also verify the hash of the file after the download completes. The Metalink file itself is downloaded and processed in memory and not stored in the local file system.

Storing metadata in file system
When saving a download to a file with curl, the --xattr option tells curl to also store certain file metadata in "extended file attributes". These extended attributes are basically standardized name/value pairs stored in the file system, assuming one of the supported file systems and operating systems are used.

Currently, the URL is stored in the xdg.origin.url attribute and, for HTTP, the content type is stored in the mime_type attribute. If the file system does not support extended attributes when this option is set, a warning is issued.

Raw
When --raw is used, it disables all internal HTTP decoding of content or transfer encodings and instead makes curl passed on unaltered, raw, data.

This is typically used if you are writing some sort of middle software and you want to pass on the content to perhaps another HTTP client and allow that to do the decoding instead.

Retrying failed attempts
Normally curl will only make a single attempt to perform a transfer and return an error if not successful. Using the --retry option you can tell curl to retry certain failed transfers.

If a transient error is returned when curl tries to perform a transfer, it will retry this number of times before giving up. Setting the number to 0 makes curl do no retries (which is the default). Transient error means either: a timeout, an FTP 4xx response code or an HTTP 5xx response code.

When curl is about to retry a transfer, it will first wait one second and then for all forthcoming retries it will double the waiting time until it reaches 10 minutes which then will be the delay between the rest of the retries. Using --retry-delay you can disable this exponential backoff algorithm and set your own delay between the attempts. With --retry-max-time you cap the total time allowed for retries. The --max-time option will still specify the longest time a single of these transfers is allowed to spend.

Resuming and ranges
Resuming a download means first checking the size of what is already present locally and then asking the server to send the rest of it so it can be appended. curl also allows resuming the transfer at a custom point without actually having anything already locally present.

curl supports resumed downloads on several protocols. Tell it where to start the transfer with the -C, --continue-at option that takes either a plain numerical byte counter offset where to start or the string - that asks curl to figure it out itself based on what it knows. When using -, curl will use the destination file name to figure out how much data that is already present locally and ask use that as an offset when asking for more data from the server.

To start downloading an FTP file from byte offset 100:

curl --continue-at 100 ftp://example.com/bigfile
Continue downloading a previously interrupted download:

curl --continue-at - http://example.com/bigfile -O
If you instead just want a specific byte range from the remote resource transferred, you can ask for only that. For example, when you only want 1000 bytes from offset 100 to avoid having to download the entire huge remote file:

curl --range 100-1999 http://example.com/bigfile
