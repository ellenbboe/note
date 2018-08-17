### Spiders
Spiders are classes which define how a certain site (or a group of sites) will be scraped, including how to perform the crawl (i.e. follow links) and how to extract structured data from their pages (i.e. scraping items). In other words, Spiders are the place where you define the custom behaviour for crawling and parsing pages for a particular site (or, in some cases, a group of sites).

For spiders, the scraping cycle goes through something like this:

You start by generating the initial Requests to crawl the first URLs, and specify a **callback** function to be called with the **response downloaded** from those requests.

The first requests to perform are obtained by calling the start_requests() method which (by default) generates Request for the URLs specified in the start_urls and the parse method as callback function for the Requests.

In the callback function, you parse the response (web page) and return _either dicts with extracted data, Item objects, Request objects, or an iterable of these objects_(返回的东西可以多种多样). Those Requests will also **contain a callback** (maybe the same) and will then be downloaded by Scrapy and then **their response handled** by the specified callback.

In callback functions, you parse the page contents, typically using Selectors (but you can also use BeautifulSoup, lxml or whatever mechanism you prefer) and generate items with the parsed data.

Finally, the items returned from the spider will be typically persisted to a database (in some Item Pipeline) or written to a file using Feed exports.
**(通过start_url获取初始的url,通过发送request,将response交给prase处理,之后return item,对于item(或者其他)成为request,调用他们的各自的callback_function处理,在parse阶段提取数据,储存)**
Even though this cycle applies (more or less) to any kind of spider, there are different kinds of default spiders bundled into Scrapy for different purposes **(不同目的的spider??)** . We will talk about those types here.

#### scrapy.Spider
**class** `scrapy.spiders.Spider`
This is the simplest spider, and the one from which every other spider must inherit (including spiders that come bundled with Scrapy, as well as spiders that you write yourself). It doesn’t provide any special functionality. It just provides a default `start_requests()` implementation which sends requests from the `start_urls` spider attribute and calls the spider’s method `parse` for each of the resulting responses.**(这是所有spider的父类,只提供两个方法)**
##### name
A string which defines the name for this spider. The spider name is how the spider is located (and instantiated) by Scrapy, so it must be **unique**. However, nothing prevents you from instantiating more than one instance of the same spider. This is the most important spider attribute and it’s required.

If the spider scrapes a single domain, a common practice is to name the spider after the domain, with or without the TLD. So, for example, a spider that crawls `mywebsite.com` would often be called `mywebsite`.
##### allowed_domains
An optional list of strings containing domains that this spider is allowed to crawl. Requests for URLs not belonging to the domain names specified in this list (or their subdomains) won’t be followed if OffsiteMiddleware is enabled.

Let’s say your target url is `https://www.example.com/1.html`, then add 'example.com' to the list.
##### start_urls
A list of URLs where the spider will begin to crawl from, when no particular URLs are specified. So, the first pages downloaded will be those listed here. The subsequent `Request` will be generated successively from data contained in the start URLs.
