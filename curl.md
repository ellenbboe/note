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
The language used to ask for data to get sent—in either direction—is called the protocol. The protocol describes exactly how to ask the server for data, or to tell the server that there is data coming.

Protocols are typically defined by the IETF (Internet Engineering Task Force), which hosts RFC documents that describe exactly how each protocol works: how clients and servers are supposed to act and what to send and so on.

### What protocols does curl support?
curl supports protocols that allow "data transfers" in either or both directions. We usually also restrict ourselves to protocols which have a "URI format" described in an RFC or at least is somewhat widely used, as curl works primarily with URLs (URIs really) as the input key that specifies the transfer.

The latest curl (as of this writing) supports these protocols:

DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP

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
Generally, there are protocol specs that tell us how to send and receive data for specific protocols. The protocol specs we follow are RFCs put together and published by IETF.

Some protocols are not properly documented in a final RFC, like, for example, SFTP for which our implementation is based on an Internet-draft that isn't even the last available one.

Protocols are, however, spoken by two parties and like in any given conversation, there are then two sides of understanding something or interpreting the given instructions in a spec. Also, lots of network software is written without the authors paying very close attention to the spec so they end up taking some shortcuts, or perhaps they just interpreted the text differently. Sometimes even mistakes and bugs make software behave in ways that are not mandated by the spec and sometimes even downright forbidden in the specs.

In the curl project we use the published specs as rules on how to act until we learn anything else. If popular alternative implementations act differently than what we think the spec says and that alternative behavior is what works widely on the big Internet, then chances are we will change foot and instead decide to act like those others. If a server refuses to talk with us when we think we follow the spec but works fine when we bend the rules every so slightly, then we probably end up bending them exactly that way—if we can still work successfully with other implementations.

Ultimately, it is a personal decision and up for discussion in every case where we think a spec and the real world don't align.

In the worst cases we introduce options to let application developers and curl users have the final say on what curl should do. I say worst because it is often really tough to ask users to make these decisions as it usually involves very tricky details and weirdness going on and it is a lot to ask of users. We should always do our very best to avoid pushing such protocol decisions to users.
