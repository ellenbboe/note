## Ports(not finished)

Any server machine makes its services available to the Internet using numbered ports, one for each service that is available on the server. For example, if a server machine is running a Web server and an FTP server, the Web server would typically be available on port 80, and the FTP server would be available on port 21. Clients connect to a service at a specific IP address and on a specific port.

Each of the most well-known services is available at a well-known port number. Here are some common port numbers:
```
echo 7
daytime 13
qotd 17 (Quote of the Day)
ftp 21
telnet 23
smtp 25 (Simple Mail Transfer, meaning e-mail)
time 37
nameserver 53
nicname 43 (Who Is)
gopher 70
finger 79
WWW 80
```
If the server machine accepts connections on a port from the outside world, and if a firewall is not protecting the port, you can connect to the port from anywhere on the Internet and use the service. Note that there is nothing that forces, for example, a Web server to be on port 80. If you were to set up your own machine and load Web server software on it, you could put the Web server on port 918, or any other unused port, if you wanted to. Then, if your machine were known as xxx.yyy.com, someone on the Internet could connect to your server with the URL http://xxx.yyy.com:918. The ":918" explicitly specifies the port number, and would have to be included for someone to reach your server. When no port is specified, the browser simply assumes that the server is using the well-known port 80.

## port(another)
In computer networking, a port is an endpoint of communication. Physical as well as wireless connections are terminated at ports of hardware devices. At the software level, within an operating system, a port is a logical construct that identifies a specific process or a type of network service.

The software port is always associated with an IP address of a host and the protocol type of the communication. It completes the destination or origination network address of a message. Ports are identified for each protocol and address combination by 16-bit unsigned numbers, commonly known as the port number.

Ports provide a multiplexing service for multiple services or multiple communication sessions at one network address. Specific port numbers are commonly reserved to identify specific services. The lowest numbered 1024 port numbers are called the well-known port numbers, and identify the historically most commonly used services. In the client–server model of application architecture, a multiplexing service is established, so that multiple simultaneous communication sessions may be initiated for the same service. The most commonly used protocols that use ports are the Transmission Control Protocol (TCP) and the User Datagram Protocol (UDP).
Networking model
Transport layer protocols, such as the Transmission Control Protocol (TCP) and the User Datagram Protocol (UDP), transfer data using protocol data units (PDUs). For TCP, the PDU is a segment, and a datagram for UDP. Both protocols use a header field for recording the source and destination port number. A port number is a 16-bit unsigned integer, thus ranging from 0 to 65535. For TCP, port number 0 is reserved and cannot be used, while for UDP, the source port is optional and a value of zero means no port. A process associates its input or output channels via an Internet socket, which is a type of file descriptor, with a transport protocol, an IP address, and a port number. This is known as binding, and enables the process to send and receive data via the network. The operating system's networking software has the task of transmitting outgoing data from all application ports onto the network, and forwarding arriving network packets to processes by matching the packet's IP address and port number. For TCP, only one process may bind to a specific IP address and port combination. Common application failures, sometimes called port conflicts, occur when multiple programs attempt to use to the same port numbers on the same IP address with the same protocol.

Applications implementing common services often use specifically reserved well-known port numbers for receiving service requests from clients. This process is known as listening, and involves the receipt of a request on the well-known port and establishing a one-to-one server-client dialog, using the same local port number. Other clients may continue to connect to the listening port; this works because a TCP connection is identified by a tuple consisting of the local address, the local port, the remote address, and the remote port.[1] The well-known ports are defined by convention overseen by the Internet Assigned Numbers Authority (IANA). The core network services, such as the World-Wide Web, typically use well-known port numbers. In many operating systems special privileges are required for applications to bind to these ports, because these are often deemed critical to the operation of IP networks. Conversely, the client end of a connection typically uses a high port number allocated for short term use, therefore called an ephemeral port.

The port numbers are encoded in the transport protocol packet header, and they can be readily interpreted not only by the sending and receiving computers, but also by other components of the networking infrastructure. In particular, firewalls are commonly configured to differentiate between packets based on their source or destination port numbers. Port forwarding is an example application of this.

The practice of attempting to connect to a range of ports in sequence on a single computer is commonly known as port scanning. This is usually associated either with malicious cracking attempts or with network administrators looking for possible vulnerabilities to help prevent such attacks. Port connection attempts are frequently monitored and logged by computers. The technique of port knocking uses a series of port connections (knocks) from a client computer to enable a server connection.
Examples
An example for the use of ports is the Internet mail system. A server used for sending and receiving email generally needs two services. The first service is used to transport email to and from other servers. This is accomplished with the Simple Mail Transfer Protocol (SMTP). The SMTP service application usually listens on TCP port 25 for incoming requests. The second service is usually either the Post Office Protocol (POP) or the Internet Message Access Protocol (IMAP) which is used by e-mail client applications on users' personal computers to fetch email messages from the server. The POP service listens on TCP port number 110. Both services may be running on the same host computer, in which case the port number distinguishes the service that was requested by a remote computer, be it a user's computer or another mail server.

While the listening port number of a server is well defined (IANA calls these the well-known ports), the client's port number is often chosen from the dynamic port range (see below). In some applications, the clients and the server each use specific port numbers assigned by the IANA. A good example of this is DHCP in which the client always uses UDP port 68 and the server always uses UDP port 67.

Common port numbers
Main article: List of TCP and UDP port numbers
The Internet Assigned Numbers Authority (IANA) is responsible for the global coordination of the DNS Root, IP addressing, and other Internet protocol resources. This includes the registration of commonly used port numbers for well-known Internet services.

The port numbers are divided into three ranges: the well-known ports, the registered ports, and the dynamic or private ports.

The well-known ports (also known as system ports) are those from 0 through 1023. The requirements for new assignments in this range are stricter than for other registrations,[2] examples include:

20: File Transfer Protocol (FTP) Data Transfer
21: File Transfer Protocol (FTP) Command Control
22: Secure Shell (SSH) Secure Login
23: Telnet remote login service, unencrypted text messages
25: Simple Mail Transfer Protocol (SMTP) E-mail routing
53: Domain Name System (DNS) service
80: Hypertext Transfer Protocol (HTTP) used in the World Wide Web
110: Post Office Protocol (POP3)
119: Network News Transfer Protocol (NNTP)
123: Network Time Protocol (NTP)
143: Internet Message Access Protocol (IMAP) Management of digital mail
161: Simple Network Management Protocol (SNMP)
194: Internet Relay Chat (IRC)
443: HTTP Secure (HTTPS) HTTP over TLS/SSL
The registered ports are those from 1024 through 49151. IANA maintains the official list of well-known and registered ranges.[3] The dynamic or private ports are those from 49152 through 65535. One common use for this range is for ephemeral ports.
History
The concept of port numbers was established by the early developers of the ARPANET in informal co-operation of software authors and system administrators.

The term port number was not yet used at this time. It was preceded by the use of the term socket number in the early development stages of the network. A socket number for a remote host was a 40-bit quantity.[4] The first 32 bits were similar to today's IPv4 address, but at the time the most-significant 8 bits were the host number. The least-significant portion of the socket number (bits 33 through 40) was an entity called Another Eightbit Number, abbreviated AEN.[5] Today, network socket refers to a related but distinct concept, namely the internal address of an endpoint (used within the node only).

On March 26, 1972, Vint Cerf and Jon Postel called for documenting the then-current usages and establishing a socket number catalog in RFC 322. Network administrators were asked to submit a note or place a phone call, "describing the function and socket numbers of network service programs at each HOST".[6]

This catalog was subsequently published as RFC 433 in December 1972 and included a list of hosts and their port numbers and the corresponding function used at each host in the network. This first registry function served primarily as documentation of usage and indicated that port number usage was conflicting between some hosts for "useful public services".[5]

The document promised a resolution of the conflicts based on a standard that Postel had published in May 1972 in RFC 349, in which he first proposed official assignments of port numbers to network services and suggested a dedicated administrative function, which he called a czar, to maintain a registry.[7]

The 256 values of the AEN were divided into the following ranges:

0 through 63: network-wide standard functions
64 through 127: host-specific functions
128 through 239: reserved for future use
240 through 255: any experimental function
The Telnet service received the first official assignment of the value 1. In detail, the first set of assignments was:[7]

1: Telnet
3: File transfer
5: Remote job entry
7: Echo
9: Discard
In the early ARPANET, the AEN was also called a socket name,[8] and was used with the Initial Connection Protocol (ICP), a component of the Network Control Program (NCP).[9][10] NCP was the forerunner of the modern Internet protocols. Today the terminology service name is still closely connected with port numbers, the former being text strings used in some network functions to represent a numerical port number.
