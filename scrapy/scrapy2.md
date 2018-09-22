## Learn Scrapy pass 2
### 安装(虚拟环境)

Python packages can be installed either globally (a.k.a system wide), or in user-space. We do not recommend installing scrapy system wide.
**(并不推荐把python package安装成系统的一部分)**

Instead, we recommend that you install scrapy within a so-called “`virtual environment`” (`virtualenv`). Virtualenvs allow you to not conflict with already-installed Python system packages (which could break some of your system tools and scripts), and still install packages normally with `pip` (without `sudo` and the likes).**(不会对系统现有的包产生冲突,可以使用普通用户的形式进行安装)**

Once you have created a virtualenv, you can install scrapy inside it with `pip`, just like any other Python package.
**(这里不介绍安装env,提一下,pycharm控制台自带虚拟环境)**
>Python virtualenvs can be created to use Python 2 by default, or Python 3 by default.
If you want to install scrapy with Python 3, install scrapy within a Python 3 virtualenv.
And if you want to install scrapy with Python 2, install scrapy within a Python 2 virtualenv.

### Scrapy 使用示例
We are going to scrape `quotes.toscrape.com`, a website that lists quotes from famous authors.

This tutorial will walk you through these tasks:
1. Creating a new Scrapy project
2. Writing a spider to crawl a site and extract data
3. Exporting the scraped data using the command line
4. Changing spider to recursively follow links
5. Using spider arguments


#### Creating a project
**Before** you start scraping, you will have to set up a new **Scrapy project**. Enter a directory where you’d like to store your code and run:`scrapy startproject tutorial`
This will create a tutorial directory with the following contents:
```
得到默认的初始化目录
tutorial/
    scrapy.cfg            # deploy configuration file 配置文件

    tutorial/             # project's Python module, you'll import your code from here
        __init__.py

        items.py          # project items definition file

        middlewares.py    # project middlewares file

        pipelines.py      # project pipelines file

        settings.py       # project settings file 配置文件

        spiders/          # a directory where you'll later put your spiders
            __init__.py
```
#### Our first Spider
Spiders are classes that you define and that Scrapy uses to scrape information from a website (or a group of websites). They must subclass scrapy.Spider and define the initial requests to make, optionally how to follow links in the pages, and how to parse the downloaded page content to extract data.
**(Spiders目录是自己定义的,通过爬虫来爬取website)**
This is the code for our first Spider. Save it in a file named `quotes_spider.py` under the **(注意位置)** `tutorial/spiders`directory in your project:
```
import scrapy

class QuotesSpider(scrapy.Spider):
    name = "quotes"

    def start_requests(self):
        urls = [
            'http://quotes.toscrape.com/page/1/',
            'http://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.log('Saved file %s' % filename)
```
>一个带有 yield 的函数就是一个 generator，它和普通函数不同，生成一个 generator 看起来像函数调用，但不会执行任何函数代码，直到对其调用 next()（在 for 循环中会自动调用 next()）才开始执行。虽然执行流程仍按函数的流程执行，但每执行到一个 yield 语句就会中断，并返回一个迭代值，下次执行时从 yield 的下一个语句继续执行。看起来就好像一个函数在正常执行的过程中被 yield 中断了数次，每次中断都会通过 yield 返回当前的迭代值。

>yield 的好处是显而易见的，把一个函数改写为一个 generator 就获得了迭代能力，比起用类的实例保存状态来计算下一个 next() 的值，不仅代码简洁，而且执行流程异常清晰。
As you can see, our Spider subclasses scrapy.Spider and defines some attributes and methods:

**name:**
>identifies the Spider.(定义爬虫名字) It must be **unique** within a project, that is, you can’t set the same name for different Spiders.

**start_requests():**
>must **return an iterable of Requests** (you can return **a list of requests** or **write a generator function**) which the Spider will **begin** to crawl from. Subsequent requests will be generated successively from these initial requests.

**parse()**:
> a method that will be called to **handle the response downloaded** for each of the requests made. The response parameter is an instance of TextResponse that holds the page content and has further helpful methods to handle it.

>The parse() method usually parses the response, extracting the scraped data as dicts and also finding new URLs to follow and creating new requests (Request) from them.**(提取信息并得到下一步url)**

#### How to run our spider
To put our spider to work, go to the project’s top level directory and run:`scrapy crawl quotes`(quotes就是之前定义的name)
This command runs the spider with name quotes that we’ve just added, that will send some requests for the `quotes.toscrape.com` domain. You will get an output similar to this:
```
... (omitted for brevity)
2016-12-16 21:24:05 [scrapy.core.engine] INFO: Spider opened
2016-12-16 21:24:05 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2016-12-16 21:24:05 [scrapy.extensions.telnet] DEBUG: Telnet console listening on 127.0.0.1:6023
2016-12-16 21:24:05 [scrapy.core.engine] DEBUG: Crawled (404) <GET http://quotes.toscrape.com/robots.txt> (referer: None)
2016-12-16 21:24:05 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://quotes.toscrape.com/page/1/> (referer: None)
2016-12-16 21:24:05 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://quotes.toscrape.com/page/2/> (referer: None)
2016-12-16 21:24:05 [quotes] DEBUG: Saved file quotes-1.html
2016-12-16 21:24:05 [quotes] DEBUG: Saved file quotes-2.html
2016-12-16 21:24:05 [scrapy.core.engine] INFO: Closing spider (finished)
```
Now, check the files in the current directory. You should notice that two new files have been created: `quotes-1.html` and `quotes-2.html`, with the content for the respective URLs, as our `parse` method instructs.

#### What just happened under the hood?
Scrapy schedules the scrapy.Request objects returned by the start_requests method of the Spider. Upon receiving a response for each one, it instantiates Response objects and calls the callback method associated with the request (in this case, the parse method) passing the response as argument.
**(通过the start_requests method of the Spider将request的请求发出去,得到response,然后对于每个response调用callback)**
### A shortcut to the start_requests method
Instead of implementing(执行) a `start_requests()` method that generates `scrapy.Request` objects from URLs, you can just define a `start_urls` class attribute with a list of URLs. **This list will then be used by the default implementation of `start_requests()` to create the initial requests for your spider:**
**(这个start_urls会自动调用默认的方法去生成初始的requests)**
```
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'http://quotes.toscrape.com/page/1/',
        'http://quotes.toscrape.com/page/2/',
    ]

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        with open(filename, 'wb') as f:
            f.write(response.body)

```
The `parse()` method will be called to handle each of the requests for those URLs, even though we haven’t explicitly told Scrapy to do so. This happens because parse() is **Scrapy’s default callback method**, which is called for requests without an explicitly assigned callback.**(默认会处理response,无需明显调用)**

#### Extracting data
The best way to learn how to extract data with Scrapy is trying selectors using the shell (Scrapy shell). Run:
`scrapy shell 'http://quotes.toscrape.com/page/1/'``
You will see something like:
```
[ ... Scrapy log here ... ]
2016-09-19 12:09:27 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://quotes.toscrape.com/page/1/> (referer: None)
[s] Available Scrapy objects:
[s]   scrapy     scrapy module (contains scrapy.Request, scrapy.Selector, etc)
[s]   crawler    <scrapy.crawler.Crawler object at 0x7fa91d888c90>
[s]   item       {}
[s]   request    <GET http://quotes.toscrape.com/page/1/>
[s]   response   <200 http://quotes.toscrape.com/page/1/>
[s]   settings   <scrapy.settings.Settings object at 0x7fa91d888c10>
[s]   spider     <DefaultSpider 'default' at 0x7fa91c8af990>
[s] Useful shortcuts:
[s]   shelp()           Shell help (print this help)
[s]   fetch(req_or_url) Fetch request (or URL) and update local objects
[s]   view(response)    View response in a browser
>>>
```
Using the shell, you can try selecting elements using CSS with the response object:
```
>>> response.css('title')
[<Selector xpath='descendant-or-self::title' data='<title>Quotes to Scrape</title>'>]
```
(弱弱的说一句,有点像选择器啊)
The result of running `response.css('title')` is a list-like object called SelectorList, which represents a list of Selector objects that wrap around XML/HTML elements and allow you to run further queries to fine-grain the selection or extract the data.
(果然)
To extract the text from the title above, you can do:
```
>>> response.css('title::text').extract()
['Quotes to Scrape']
```
There are two things to note here:
one is that we’ve added `::text` to the CSS query, to mean we want to select **only** the text elements directly inside <title> element. If we don’t specify `::text`, we’d get the full title element, including its tags:
```
>>> response.css('title').extract()
['<title>Quotes to Scrape</title>']
```

The other thing is that the result of calling .extract() is a **list**, because we’re dealing with an instance of SelectorList. When you know you just want the first result, as in this case, you can do:
```
>>> response.css('title::text').extract_first()
'Quotes to Scrape'
```
As an alternative, you could’ve written:
```
>>> response.css('title::text')[0].extract()
'Quotes to Scrape'
```
However, using `.extract_first()` avoids an `IndexError` and returns `None` **when** it **doesn’t find** any element matching the selection.

There’s a lesson here: for most scraping code, you want it to be resilient to errors due to things not being found on a page, so that even if some parts fail to be scraped, you can at least get some data.
**(即使你没有得到你想要的东西,你也可以得到一些data)**

Besides the `extract()` and `extract_first()` methods, you can also use the `re()` method to extract using regular expressions:
```
>>> response.css('title::text').re(r'Quotes.*')
['Quotes to Scrape']
>>> response.css('title::text').re(r'Q\w+')
['Quotes']
>>> response.css('title::text').re(r'(\w+) to (\w+)')
['Quotes', 'Scrape']
```
In order to find the proper CSS selectors to use, you might find useful opening the response page from the shell in your web browser using `view(response)`. You can use your browser developer tools or extensions like Firebug (see sections about [Using Firebug for scraping](https://doc.scrapy.org/en/latest/topics/firebug.html#topics-firebug) and [Using Firefox for scraping](https://doc.scrapy.org/en/latest/topics/firefox.html#topics-firefox)).

[Selector Gadget](http://selectorgadget.com/) is also a nice tool to quickly find CSS selector for visually selected elements, which works in many browsers.

不止可以使用css选择器,还可以使用xpath
```
>>> response.xpath('//title')
[<Selector xpath='//title' data='<title>Quotes to Scrape</title>'>]
>>> response.xpath('//title/text()').extract_first()
'Quotes to Scrape'
```
XPath expressions are very powerful, and are the foundation of Scrapy Selectors. In fact, CSS selectors are converted to XPath under-the-hood. You can see that if you read closely the text representation of the selector objects in the shell.(没想到啊,竟然是这样)
>we encourage you to learn XPath even if you already know how to construct CSS selectors, it will make scraping much easier.
