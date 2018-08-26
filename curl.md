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
