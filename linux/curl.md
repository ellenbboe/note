## curl
### The cURL project

A funny detail about Open Source projects is that they are called "projects", as if they were somehow limited in time or ever can get done. The cURL "project" is a number of loosely-coupled individual volunteers working on writing software together with a common mission: to do reliable data transfers with Internet protocols. And giving away the code for free for anyone to use.
### How it started
Back in 1996, Daniel Stenberg was writing an IRC bot in his spare time, an automated program that would offer services for the participants in a chatroom dedicated to the Amiga computer (#amiga on the IRC network EFnet). He came to think that it would be fun to get some updated currency rates and have his bot offer a service online for the chat room users to get current exchange rates, to ask the bot "please exchange 200 USD into SEK" or similar.

In order to have the provided exchange rates as accurate as possible, the bot would download the rates daily from a web site that was hosting them. A small tool to download data over HTTP was needed for this task. A quick look-around at the time had Daniel find a tiny tool named httpget (written by a Brazilian named Rafael Sagula). It did the job, almost, just needed a few little a tweaks here and there and soon Daniel had taken over maintenance of the few hundred lines of code it was.

HttpGet 1.0 was subsequently released on April 8th 1997 with brand new HTTP proxy support.

We soon found and fixed support for getting currencies over GOPHER. Once FTP download support was added, the name of the project was changed and urlget 2.0 was released in August 1997. The http-only days were already passed.

The project slowly grew bigger. When upload capabilities were added and the name once again was misleading, a second name change was made and on March 20, 1998 curl 4 was released. (The version numbering from the previous names was kept.)

We consider March 20 1998 to be curl's birthday.
### The name
Naming things is hard.

The tool was about uploading and downloading data specified with a URL. It would show the data (by default). The user would "see" the URL perhaps and "see" then spelled with the single letter 'c'. It was also a client-side program, a URL client. So 'c' for Client and URL: cURL.

Nothing more was needed so the name was selected and we never looked back again.

Later on, someone suggested that curl could actually be a clever "recursive acronym" (where the first letter in the acronym refers back to the same word): "Curl URL Request Library"

While that is awesome, it was actually not the original thought. We sort of wish we were that clever though…

There are and were other projects using the name curl in various ways, but we were not aware of them by the time our curl came to be.

#### Pronunciation
Most of us pronounce "curl" with an initial k sound, just like the English word curl. It rhymes with words like girl and earl. Merriam Webster has a short WAV file to help.

#### Confusions and mixups
Soon after curl was first created another "curl" appeared that makes a programming language. That curl still exists.

Several libcurl bindings for various programming languages use the term "curl" or "CURL" in part or completely to describe their bindings, so sometimes you will find users talking about curl but targeting neither the command-line tool nor the library that is made by this project.

#### As a verb
'to curl something' is sometimes used as a reference to use a non-browser tool to download a file or resource from a URL.

### What does curl do?
cURL is a project and its primary purpose and focus is to make two products:

- curl, the command-line tool

- libcurl the transfer library with a C API

**Both the tool and the library do Internet transfers for resources specified as URLs using Internet protocols.**

**Everything and anything that is related to Internet protocol transfers can be considered curl's business**. Things that are not related to that should be avoided and be left for other projects and products.

It could be important to also consider that curl and libcurl try to **avoid handling the actual data** that is transferred. It has, for example, no knowledge about HTML or anything else of the content that is popular to transfer over HTTP, but **it knows all about how to transfer such data over HTTP.**

Both products are frequently used not only to **drive thousands or millions of scripts and applications for an Internet connected world**, but they are also widely used for **server testing, protocol fiddling and trying out new things**.

The library is used in every imaginable sort of embedded device where Internet transfers are needed: car infotainment, televisions, Blu-Ray players, set-top boxes, printers, routers, game systems, etc.(用途很广)

#### Command line tool
Running curl from the command line was natural and Daniel never considered anything else than that **it would output data on stdout**, to the terminal, by default. The "everything is a pipe" mantra of standard Unix philosophy was something Daniel believed in. curl is like 'cat' or one of the other Unix tools; it sends data to stdout to make it easy to chain together with other tools to do what you want. That's also why virtually all curl options that allow **reading from a file or writing to a file**, also have the ability to select doing it to stdout or from stdin.

Following that style of what Unix command-line tools worked, it was also never any question about that it should support multiple URLs on the command line.

The command-line tool is designed to work perfectly from scripts or other automatic means. It doesn't feature any other GUI or UI other than mere(纯粹的) **text in and text out**.

#### The library
While the command-line tool came first, the network engine was ripped out(撕开) and converted into a library during the year 2000 and the concepts(观点) we still have today were introduced with libcurl 7.1 in August 2000. Since then, the command line tool has been a thin layer of logic to make a tool around the library that does all the heavy lifting.

libcurl is designed and meant to be available for anyone who wants to add client-side file transfer capabilities to their software, on any platform, any architecture and for any purpose. libcurl is also extremely liberally licensed to avoid that becoming an obstacle.

libcurl is written in traditional and conservative C. Where other languages are preferred, people have created libcurl bindings for them.

### Project communication
cURL is an Open Source project consisting of voluntary members from all over the world, living and working in a large number of the world's time zones. To make such a setup actually work, communication and openness is key. We keep all communication public and we use open communication channels. Most discussions are held on mailing lists, we use bug trackers where all issues are discussed and handled with full insight for everyone who cares to look.

It is important to realize that we are all jointly taking care of the project, we fix problems and we add features. Sometimes a regular contributor grows bored and fades away, sometimes a new eager contributor steps out from the shadows and starts helping out more. To keep this ship going forward as well as possible, it is important that we maintain open discussions and that's one of the reasons why we frown upon users who take discussions privately or try to e-mail individual team members about development issues, questions, debugging or whatever.

In this day and age, mailing lists may be considered sort of the old style of communication—no fancy web forums or similar. Using a mailing list is therefore becoming an art that isn't practised everywhere and may be a bit strange and unusual to you. But fear not. It is just about sending emails to an address that then sends that e-mail out to all the subscribers. Our mailing lists have at most a few thousand subscribers. If you are mailing for the first time, it might be good to read a few old mails first to get to learn the culture and what's considered good practice.

The mailing lists and the bug tracker have changed hosting providers a few times and there are reasons to suspect it might happen again in the future. It is just the kind of thing that happens to a project that lives for a long time.

A few users also hang out on IRC in the #curl channel on freenode.
(还有许多谈这个项目的话题,忽略了....(感觉看了和看故事一样就不写那些东西了))

### Network and protocols
Before diving in and talking about how to use curl to get things done, let's take a look at what all this networking is and how it works, using simplifications and some minor shortcuts to give an easy overview.

The basics are in the networking simplified chapter that tries to just draw a simple picture of what networking is from a curl perspective, and the protocols section which explains what exactly a "protocol" is and how that works.

### Networking simplified
Networking means communicating between two endpoints on the Internet. The Internet is just a bunch of interconnected machines (computers really), each using their own private addresses (called IP addresses). The addresses each machine have can be of different types and machines can even have temporary addresses. These computers are often called hosts.

The computer, tablet or phone you sit in front of is usually called "the client" and the machine out there somewhere that you want to exchange data with is called "the server". The main difference between the client and the server is in the roles they play here. There's nothing that prevents the roles from being reversed in a subsequent operation.

### Which machine
When you want to initiate a transfer to one of the machines out there (a server), you usually don't know its IP addresses but instead you usually know its name. The name of the machine you will talk to is embedded in the URL that you work with when you use curl.

You might use a URL like "http://example.com/index.html", which means you will connect to and communicate with the host named example.com.

### Host name resolving
Once we know the host name, we need to figure out which IP addresses that host has so that we can contact it.

Converting the name to an IP address is often called 'name resolving'. The name is "resolved" to a set of addresses. This is usually done by a "DNS server", DNS being like a big lookup table that can convert names to addresses—all the names on the Internet, really. Your computer normally already knows the address of a computer that runs the DNS server as that is part of setting up the network.

curl will therefore ask the DNS server: "Hello, please give me all the addresses for example.com", and the server responds with a list of them. Or in the case you spell the name wrong, it can answer back that the name doesn't exist.

### Establish a connection
With a list of IP addresses for the host curl wants to contact, curl sends out a "connect request". The connection curl wants to establish is called TCP and it works sort of like connecting an invisible string between two computers. Once established, it can be used to send a stream of data in both directions.

As curl gets a list of addresses for the host, it will actually traverse that list of addresses when connecting and in case one fails it will try to connect to the next one until either one works or they all fail.

### Connects to "port numbers"
When connecting with TCP to a remote server, a client selects which port number to do that on. A port number is just a dedicated place for a particular service, which allows that same server to listen to other services on other port numbers at the same time.

Most common protocols have default port numbers that clients and servers use. For example, when using the "http://example.com/index.html" URL, that URL specifies a scheme called "http" which tells the client that it should try TCP port number 80 on the server by default. The URL can optionally provide another, custom, port number but if nothing special is specified, it will use the default port for the scheme used in the URL.

### TLS
After the TCP connection has been established, many transfers will require that both sides negotiate(协商) a better security level before continuing, and that is often TLS; Transport Layer Security. If that is used, the client and server will do a TLS handshake first and only continue further if that succeeds.(传输层协议,握手)

### Transfer data
When the connecting "string" we call TCP is attached to the remote computer (and we have done the possible additional TLS handshake), there's an established connection between the two machines and that connection can then be used to exchange data. That communication is done using a "protocol", as discussed in the following chapter.

### Protocol
The language used to ask for data to get sent—in either direction—is called the protocol. **The protocol describes exactly how to ask the server for data, or to tell the server that there is data coming.**

Protocols are typically defined by the IETF (Internet Engineering Task Force), which hosts RFC documents that **describe exactly how each protocol works**: how clients and servers are supposed to **act** and what to **send** and so on.

### What protocols does curl support?
curl supports protocols that allow "data transfers" in either or both directions. We usually also restrict ourselves to protocols which have a "URI format" described in an RFC or at least is somewhat widely used(有一定规范的url), as curl works primarily with URLs (URIs really) as the input key that specifies the transfer.

The latest curl (as of this writing) supports these protocols:

`DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP`

To complicate matters further, the protocols often exist in different versions or flavors as well.

### What other protocols are there?
The world is full of protocols, both old and new. Old protocols get abandoned and dropped and new ones get introduced. There's never a state of stability but the situation changes from day to day and year to year. You can rest assured that there will be new protocols added in the list above in the future and that there will be new versions of the protocols already listed.

There are, of course, already other protocols in existence that curl doesn't yet support. We are open to supporting more protocols that suit the general curl paradigms, we just need developers to write the necessary code adjustments for them.

### How are protocols developed?
Both new versions of existing protocols and entirely new protocols are usually developed by persons or teams that feel that the existing ones are not good enough. Something about them makes them not suitable for a particular use case or perhaps some new idea has popped up that could be applied to improve things.

Of course, nothing prevents anyone from developing a protocol entirely on their own at their own pleasure in their own backyard, but the major protocols are usually brought to the IETF at a fairly early stage where they are then discussed, refined, debated and polished and then eventually, hopefully, turned into a published RFC document.

Software developers then read the RFC specifications and deploy their code in the world based on their interpretations of the words in those documents. It sometimes turn out that some of the specifications are subject to vastly different interpretations or sometimes the engineers are just lazy and ignore sound advice in the specs and deploy something that doesn't adhere. Writing software that interoperates with other implementations of the specifications can therefore end up being hard work.

### How much do protocols change?
Like software, protocol specifications are frequently updated and new protocol versions are created.

Most protocols allow some level of extensibility which makes new extensions show up over time, extensions that make sense to support.

The interpretation of a protocol sometimes changes even if the spec remains the same.

The protocols mentioned in this chapter are all "Application Protocols", which means they are transferred over more lower level protocols, like TCP, UDP and TLS. They are also themselves protocols that change over time, get new features and get attacked so that new ways of handling security, etc., forces curl to adapt and change.

### About adhering to standards and who's right
Generally, there are protocol specs(规范) that tell us how to send and receive data for specific protocols. The protocol specs we follow are RFCs put together and published by IETF.

Some protocols are not properly documented in a final RFC, like, for example, SFTP for which our implementation is based on an Internet-draft that isn't even the last available one.

Protocols are, however, spoken by two parties and like in any given conversation, there are then two sides of understanding something or interpreting the given instructions in a spec. Also, lots of network software is written without the authors paying very close attention to the spec so they end up taking some shortcuts, or perhaps they just interpreted the text differently. Sometimes even mistakes and bugs make software behave in ways that are not mandated by the spec and sometimes even downright forbidden in the specs.

In the curl project we use the published specs as rules on how to act until we learn anything else. If popular alternative implementations act differently than what we think the spec says and that alternative behavior is what works widely on the big Internet, then chances are we will change foot and instead decide to act like those others. If a server refuses to talk with us when we think we follow the spec but works fine when we bend the rules every so slightly, then we probably end up bending them exactly that way—if we can still work successfully with other implementations.

Ultimately, it is a personal decision and up for discussion in every case where we think a spec and the real world don't align.

In the worst cases we introduce options to let application developers and curl users have the final say on what curl should do. I say worst because it is often really tough to ask users to make these decisions as it usually involves very tricky details and weirdness going on and it is a lot to ask of users. We should always do our very best to avoid pushing such protocol decisions to users.

### The protocols curl supports
curl supports about 22 protocols. We say "about" because it depends on how you count and what you consider to be distinctly different protocols.

#### DICT
DICT is a dictionary network protocol, it allows clients to ask dictionary servers about a meaning or explanation for words. See RFC 2229. Dict servers and clients use TCP port 2628.

#### FILE
FILE is not actually a "network" protocol. It is a URL scheme that allows you to tell curl to get a file from the local file system instead of getting it over the network from a remote server. See RFC 1738.

#### FTP
FTP stands for File Transfer Protocol and is an old (originates in the early 1970s) way to transfer files back and forth between a client and a server. See RFC 959. It has been extended greatly over the years. FTP servers and clients use TCP port 21 plus one more port, though the second one is usually dynamically established during communication.

See the external page FTP vs HTTP for how it differs to HTTP.

#### FTPS
FTPS stands for Secure File Transfer Protocol. It follows the tradition of appending an 'S' to the protocol name to signify that the protocol is done like normal FTP but with an added SSL/TLS security layer. See RFC 4217.

This protocol is very problematic to use through firewalls and other network equipment.

#### GOPHER
Designed for "distributing, searching, and retrieving documents over the Internet", Gopher is somewhat of the grand father to HTTP as HTTP has mostly taken over completely for the same use cases. See RFC 1436. Gopher servers and clients use TCP port 70.

#### HTTP
The Hypertext Transfer Protocol, HTTP, is the most widely used protocol for transferring data on the web and over the Internet. See RFC 7230 for HTTP/1.1 and RFC 7540 for HTTP/2, the successor. HTTP servers and clients use TCP port 80.

#### HTTPS
Secure HTTP is HTTP done over an SSL/TLS connection. See RFC 2818. HTTPS servers and clients use TCP port 443.

#### IMAP
The Internet Message Access Protocol, IMAP, is a protocol for accessing, controlling and "reading" email. See RFC 3501. IMAP servers and clients use TCP port 143.

#### IMAPS
Secure IMAP is IMAP done over an SSL/TLS connection. Such connections usually start out as a "normal" IMAP connection that is then upgraded to IMAPS using the STARTTLS command.

#### LDAP
The Lightweight Directory Access Protocol, LDAP, is a protocol for accessing and maintaining distributed directory information. **Basically a database lookup**. See RFC 4511. LDAP servers and clients use TCP port 389.

#### LDAPS
Secure LDAP is LDAP done over an SSL/TLS connection.

#### POP3
The Post Office Protocol version 3 (POP3) is a protocol for **retrieving email from a server**. See RFC 1939. POP3 servers and clients use TCP port 110.

#### POP3S
Secure POP3 is POP3 done over an SSL/TLS connection. Such connections usually start out as a "normal" POP3 connection that is then upgraded to POP3S using the STARTTLS command.

#### RTMP
The Real-Time Messaging Protocol (RTMP) is a protocol for **streaming audio, video and data**. RTMP servers and clients use TCP port 1935.

#### RTSP
The Real Time Streaming Protocol (RTSP) is a network control protocol to **control streaming media servers**. See RFC 2326. RTSP servers and clients use TCP and UDP port 554.

#### SCP
The Secure Copy (SCP) protocol is designed to **copy files to and from a remote SSH server**. SCP servers and clients use TCP port 22.

#### SFTP
The SSH File Transfer Protocol (SFTP) that provides file access, file transfer, and file management over a reliable data stream. SFTP servers and clients use TCP port 22.

#### SMB
The Server Message Block (SMB) protocol is also known as CIFS. It is a an application-layer network protocol mainly used for providing shared access to files, printers, and serial ports and miscellaneous communications between nodes on a network. SMB servers and clients use TCP port 485.

#### SMTP
The Simple Mail Transfer Protocol (SMTP) is a protocol for email transmission. See RFC 821. SMTP servers and clients use TCP port 25.

#### SMTPS
Secure SMTP is SMTP done over an SSL/TLS connection. Such connections usually start out as a "normal" SMTP connection that is then upgraded to SMTPS using the STARTTLS command.

#### TELNET
TELNET is an application layer protocol used over networks to provide a bidirectional interactive text-oriented communication facility using a virtual terminal connection. See RFC 854. TELNET servers and clients use TCP port 23.

#### TFTP
The Trivial File Transfer Protocol (TFTP) is a protocol for doing simple file transfers over UDP to get a file from or put a file onto a remote host. TFTP servers and clients use UDP port 69.

### Command line basics
curl started out as a command-line tool and it has been invoked from shell prompts and from within scripts by thousands of users over the years. curl has established itself as one of those trusty tools that is there for you to help you get your work done.

#### Binaries and different platforms
The command-line tool "curl" is a binary executable file. The curl project does not by itself distribute or provide binaries. Binary files are highly system specific and oftentimes also bound to specific system versions.

To get a curl for your platform and your system, you need to get a curl executable from somewhere. Many people build their own from the source code provided by the curl project, lots of people install it using a package tool for their operating system and yet another portion of users download binary install packages from sources they trust.

No matter how you do it, make sure you are getting your version from a trusted source and that you verify digital signatures or the authenticity of the packages in other ways.

Also, remember that curl is often built to use third-party libraries to perform and unless curl is built to use them statically you must also have those third-party libraries installed; the exact set of libraries will vary depending on the particular build you get.

#### Command lines, quotes and aliases
There are many different command lines, shells and prompts in which curl can be used. They all come with their own sets of limitations, rules and guidelines to follow. The curl tool is designed to work with any of them without causing troubles but there may be times when your specific command line system doesn't match what others use or what is otherwise documented.

One way that command-line systems differ, for example, is how you can put quotes around arguments such as to embed spaces or special symbols. In most Unix-like shells you use double quotes (") and single quotes (') depending if you want to allow variable expansions or not within the quoted string, but on Windows there's no support for the single quote version.

In some environments, like PowerShell on Windows, the authors of the command line system decided they know better and "help" the user to use another tool instead of curl when curl is typed, by providing an alias that takes precedence when a command line is executed. In order to use curl properly with PowerShell, you need to type in its full name including the extension: "curl.exe".

Different command-line environments will also have different maximum command line lengths and force the users to limit how large amount of data that can be put into a single line. curl adapts to this by offering a way to provide command-line options through **a file—or from stdin—using the -K option.**

#### Garbage in, garbage out
curl has very little will of its own. It tries to please you and your wishes to a very large extent. It also means that it will try to play with what you give it. If you misspell an option, it might do something unintended. If you pass in a slightly illegal URL, chances are curl will still deal with it and proceed. It means that you can pass in crazy data in some options and you can have curl pass on that crazy data in its transfer operation.

This is a design choice, as it allows you to really tweak how curl does its protocol communications and you can have curl massage your server implementations in the most creative ways.
### Command line options
When telling curl to do something, you invoke curl with zero, one or several command-line options to accompany the URL or set of URLs you want the transfer to be about. curl supports over two hundred different options.

#### Short options
Command line options pass on information to curl about how you want it to behave. Like you can ask **curl to switch on verbose mode** with the -v option:
`curl -v http://example.com`
`-v` is here used as a "short option". You write those with the minus symbol and a single letter immediately following it. Many options are just switches that switches something on or changes something between two known states. They can be used with just that option name. You can then also combine several single-letter options after the minus. To ask for both verbose mode and that curl follows HTTP redirects:
`curl -vL http://example.com`
The command-line parser in curl always parses the entire line and you can put the options anywhere you like; they can also appear after the URL:
`curl http://example.com -Lv`
and the two separate short options can of course also be specified separately, like:
`curl -v -L http://example.com`
#### Long options
Single-letter options are convenient since they are quick to write and use, but as there are only a limited number of letters in the alphabet and there are many things to control, not all options are available like that. Long option names are therefore provided for those. Also, as a convenience and to allow scripts to become more readable, most short options have longer name aliases.

Long options are always written with two minuses (or dashes, whichever you prefer to call them) and then the name and you can only write one option name per double-minus. Asking for verbose mode using the long option format looks like:
`curl --verbose http://example.com`
and asking for HTTP redirects as well using the long format looks like:
`curl --verbose --location http://example.com`

#### Arguments to options
Not all options are just simple boolean flags that enable or disable features. For some of them you need to pass on data, like perhaps a user name or a path to a file. You do this by writing first the option and then the argument, separated with a space. Like, for example, if you want to send an arbitrary string of data in an HTTP POST to a server:
`curl -d arbitrary http://example.com`
and it works the same way even if you use the long form of the option:
`curl --data arbitrary http://example.com`
When you use the short options with arguments, you can, in fact, also write the data without the space separator:
`curl -darbitrary http://example.com`
#### Arguments with spaces
At times you want to pass on an argument to an option, and that argument contains one or more spaces. For example you want to set the user-agent field curl uses to be exactly I am your father, including those three spaces. Then you need to put quotes around the string when you pass it to curl on the command line. The exact quotes to use varies depending on your shell/command prompt, but generally it will work with double quotes in most places:

`curl -A "I am your father" http://example.com`
Failing to use quotes, like if you would write the command line like this:

`curl -A I am your father http://example.com`
… will make curl only use 'I' as a user-agent string, and the following strings, 'am', your, etc will instead all be treated as separate URLs since they don't start with - to indicate that they're options and curl only ever handles options and URLs.

To make **the string itself contain double quotes**, which is common when you for example want to send a string of JSON to the server, you may need to use single quotes (except on Windows, where single quotes doesn't work the same way). Send the JSON string { "name": "Darth" }:

`curl -d '{ "name": "Darth" }' http://example.com`
Or if you want to avoid the single quote thing, you may prefer to send the data to curl via a file, which then doesn't need the extra quoting. Assuming we call the **file 'json'** that contains the above mentioned data:

`curl -d @json http://example.com`
#### Negative options
For options that switch on something, there is also a way to switch it off. You then use the long form of the option with an initial "no-" prefix before the name. As an example, to switch off verbose mode:

`curl --no-verbose http://example.com`

### Options depend on version
curl was first typed on a command line back in the glorious year of 1998. It already then worked on the specified URL and none, one or more command-line options given to it.

Since then we have added more options. We add options as we go along and almost every new release of curl has one or a few new options that allow users to modify certain aspects of its operation.

With the curl project's rather speedy release chain with a new release shipping every eight weeks, it is almost inevitable that you are at least not always using the very latest released version of curl. Sometimes you may even use a curl version that is a few years old.

All command-line options described in this book were, of course, added to curl at some point in time, and only a very small portion of them were available that fine spring day in 1998 when curl first shipped. You may have reason to check your version of curl and crosscheck with the curl man page for when certain options were added. This is especially important if you want to take a curl command line using a modern curl version back to an older system that might be running an older installation.

The developers of curl are working hard to not change existing behavior though. Command lines written to use curl in 1998, 2003 or 2010 should all be possible to run unmodified even today.

### URLs
curl is called curl because a substring in its name is URL (Uniform Resource Locator). It operates on URLs. URL is the name we casually use for the web address strings, like the ones we usually see prefixed with http:// or starting with www.

URL is, strictly speaking, the former name for these. URI (Uniform Resource Identifier) is the more modern and correct name for them. Their syntax is defined in RFC 3986.

Where curl accepts a "URL" as input, it is then really a "URI". Most of the protocols curl understands also have a corresponding URI syntax document that describes how that particular URI format works.

curl assumes that you give it a valid URL and it only does limited checks of the format in order to extract the information it deems necessary to perform its operation. You can, for example, most probably pass in illegal characters in the URL without curl noticing or caring and it will just pass them on.

#### Scheme
URLs start with the "scheme", which is the official name for the "http://" part. That tells which protocol the URL uses. The scheme must be a known one that this version of curl supports or it will show an error message and stop. Additionally, the scheme must neither start with nor contain any whitespace.

#### The scheme separator
The scheme identifier is separated from the rest of the URL by the "://" sequence. That is a colon and two forward slashes. There exists URL formats with only one slash, but curl doesn't support any of them. There are two additional notes to be aware of, about the number of slashes:

curl allow some illegal syntax and try to correct it internally; so **it will also understand and accept URLs with one or three slashes**, even though they are in fact not properly formed URLs. curl does this because the browsers started this practice so it has lead to such URLs being used in the wild every now and then.

`file://` URLs are written as `file://<hostname>/<path>` but the only hostnames that are okay to use are `localhost`, `127.0.0.1` or a blank (nothing at all):
`file://localhost/path/to/file`
`file://127.0.0.1/path/to/file`
`file:///path/to/file`

Inserting any other host name in there will make recent versions of curl to return an error.

Pay special attention to the third example above (file:///path/to/file). **That is three slashes before the path.** That is again an area with common mistakes and where browsers allow users to use the wrong syntax so as a special exception, curl on Windows also allows this incorrect format:
`file://X:/path/to/file`
… where X is a windows-style drive letter.

#### Without scheme
As a convenience, curl also allows users to leave out the scheme part from URLs. Then it guesses which protocol to use based on the first part of the host name. That guessing is very basic as it just checks if the first part of the host name matches one of a set of protocols, and assumes you meant to use that protocol. This heuristic is based on the fact that servers traditionally used to be named like that. The protocols that are detected this way are FTP, DICT, LDAP, IMAP, SMTP and POP3. Any other host name in a scheme-less URL will make curl default to HTTP.

You can modify the default protocol to something other than HTTP with the `--proto-default` option.

#### Name and password
After the scheme, there can be a possible user name and password embedded. The use of this syntax is usually frowned upon these days since you easily leak this information in scripts or otherwise. For example, listing the directory of an FTP server using a given name and password:
`curl ftp://user:password@example.com/`
The presence of user name and password in the URL is completely optional. curl also allows that information to be provide with normal command-line options, outside of the URL.

#### Host name or address
The host name part of the URL is, of course, simply a name that can be resolved to an numerical IP address, or the numerical address itself. When specifying a numerical address, use the dotted version for IPv4 addresses:
`curl http://127.0.0.1/`
…and for IPv6 addresses the numerical version needs to be within square brackets:
`curl http://[::1]/`
When a host name is used, the converting of the name to an IP address is typically done using the system's resolver functions. That normally lets a sysadmin provide local name lookups in the /etc/hosts file (or equivalent).

#### Port number
Each protocol has a "default port" that curl will use for it, unless a specified port number is given. The optional port number can be provided within the URL after the host name part, as a colon and the port number written in decimal. For example, asking for an HTTP document on port 8080:
`curl http://example.com:8080/`
With the name specified as an IPv4 address:
`curl http://127.0.0.1:8080/`
With the name given as an IPv6 address:
`curl http://[fdea::1]:8080/`

#### Path
Every URL contains a path. If there's none given, "/" is implied. The path is sent to the specified server to identify exactly which resource that is requested or that will be provided.

The exact use of the path is protocol dependent. For example, getting a file README from the default anonymous user from an FTP server:

`curl ftp://ftp.example.com/README`
For the protocols that have a directory concept, ending the URL with a trailing slash means that it is a directory and not a file. Thus asking for a directory list from an FTP server is implied with such a slash:

`curl ftp://ftp.example.com/tmp/`
#### FTP type(感觉不好用)
This is not a feature that is widely used.

URLs that identify files on FTP servers have a special feature that allows you to also tell the client (curl in this case) which file type the resource is. This is because FTP is a little special and can change mode for a transfer and thus handle the file differently than if it would use another mode.

You tell curl that the FTP resource is an ASCII type by appending ";type=A" to the URL. Getting the 'foo' file from example.com's root directory using ASCII could then be made with:

curl "ftp://example.com/foo;type=A"
And while curl defaults to binary transfers for FTP, the URL format allows you to also specify the binary type with type=I:

curl "ftp://example.com/foo;type=I"
Finally, you can tell curl that the identified resource is a directory if the type you pass is D:

curl "ftp://example.com/foo;type=D"
…this can then work as an alternative format, instead of ending the path with a trailing slash as mentioned above.

#### Fragment
URLs offer a "fragment part". That's usually seen as a hash symbol (#) and a name for a specific name within a web page in browsers. curl supports fragments fine when a URL is passed to it, but the fragment part is never actually sent over the wire so it doesn't make a difference to curl's operations whether it is present or not.

#### Browsers' "address bar"
It is important to realize that when you use a modern web browser, **the "address bar" they tend to feature at the top of their main windows are not using "URLs" or even "URIs". They are in fact mostly using IRIs**, which is a superset of URIs to allow internationalization like non-Latin symbols and more, but it usually goes beyond that, too, as they tend to, for example, handle spaces and do magic things on percent encoding in ways none of these mentioned specifications say a client should do.

The address bar is quite simply an interface for humans to enter and see URI-like strings.

Sometimes the differences between what you see in a browser's address bar and what you can pass in to curl is significant.

#### Many options and URLs
As mentioned above, curl supports hundreds of command-line options and it also supports an unlimited number of URLs. If your shell or command-line system supports it, there's really no limit to how long a command line you can pass to curl.

curl will parse the entire command line first, apply the wishes from the command-line options used, and then go over the URLs one by one (in a left to right order) to perform the operations.

For some options (for example -o or -O that tell curl where to store the transfer), you may want to specify one option for each URL on the command line.

curl will return an exit code for its operation on the last URL used. If you instead rather want curl to exit with an error on the first URL in the set that fails, use the `--fail-early` option.

#### Separate options per URL
In previous sections we described how curl always parses all options in the whole command line and applies those to all the URLs that it transfers.

That was a simplification: curl also offers an option (`-;`, `--next`) that inserts a sort of boundary between a set of options and URLs for which it will apply the options. When the command-line parser finds a `--next` option, it applies the following options to the next set of URLs. The `--next` option thus works as a divider between a set of options and URLs. You can use as many `--next` options as you please.

As an example, we do an HTTP GET to a URL and follow redirects, we then make a second HTTP POST to a different URL and we round it up with a HEAD request to a third URL. All in a single command line:
```
curl --location http://example.com/1 --next
  --data sendthis http://example.com/2 --next
  --head http://example.com/3
  ```
Trying something like that without the `--next` options on the command line would generate an illegal command line since curl would attempt to combine both a POST and a HEAD:
```
Warning: You can only select one HTTP request method! You asked for both POST
Warning: (-d, --data) and HEAD (-I, --head).
```
#### Connection reuse
Setting up a TCP connection and especially a TLS connection can be a slow process, even on high bandwidth networks.

It can be useful to remember that curl has a connection pool internally which keeps previously used connections alive and around for a while after they were used so that subsequent requests to the same hosts can reuse an already established connection.

Of course, they can only be kept alive for as long as the curl tool is running, but it is a very good reason for trying to get several transfers done within the same command line instead of running several independent curl command line invocations.
