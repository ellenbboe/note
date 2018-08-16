## Learn Scrapy pass 3
### 接上文Extract data
#### Extracting quotes and authors
Now that you know a bit about `selection` and `extraction`, let’s complete our spider by writing the code to extract the quotes from the web page.

Each quote in `http://quotes.toscrape.com `is represented by HTML elements that look like this:
```
<div class="quote">
    <span class="text">“The world as we have created it is a process of our
    thinking. It cannot be changed without changing our thinking.”</span>
    <span>
        by <small class="author">Albert Einstein</small>
        <a href="/author/Albert-Einstein">(about)</a>
    </span>
    <div class="tags">
        Tags:
        <a class="tag" href="/tag/change/page/1/">change</a>
        <a class="tag" href="/tag/deep-thoughts/page/1/">deep-thoughts</a>
        <a class="tag" href="/tag/thinking/page/1/">thinking</a>
        <a class="tag" href="/tag/world/page/1/">world</a>
    </div>
</div>
```

Let’s open up scrapy shell and play a bit to find out how to extract the data we want:
`$ scrapy shell 'http://quotes.toscrape.com'`
We get a **list** of selectors for the quote HTML elements with:
```
>>> response.css("div.quote")
```
Each of the selectors **returned by the query** above allows us to run further queries over their sub-elements. Let’s assign the first selector to a variable, so that we can run our CSS selectors directly on a particular quote:
```
>>> quote = response.css("div.quote")[0]
```
Now, let’s extract title, author and the tags from that quote using the quote object we just created:
```
>>> title = quote.css("span.text::text").extract_first()
>>> title
'“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”'
>>> author = quote.css("small.author::text").extract_first()
>>> author
'Albert Einstein'
```
Given that the tags are a **list** of strings, we can use the `.extract()` method to get all of them:
```
>>> tags = quote.css("div.tags a.tag::text").extract()
>>> tags
['change', 'deep-thoughts', 'thinking', 'world']
```
Having figured out how to extract each bit, we can now iterate over all the quotes elements and put them together into a Python dictionary:
```
>>> for quote in response.css("div.quote"):
...     text = quote.css("span.text::text").extract_first()
...     author = quote.css("small.author::text").extract_first()
...     tags = quote.css("div.tags a.tag::text").extract()
...     print(dict(text=text, author=author, tags=tags))
{'tags': ['change', 'deep-thoughts', 'thinking', 'world'], 'author': 'Albert Einstein', 'text': '“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”'}
{'tags': ['abilities', 'choices'], 'author': 'J.K. Rowling', 'text': '“It is our choices, Harry, that show what we truly are, far more than our abilities.”'}
    ... a few more of these, omitted for brevity
>>>
```

#### Extracting data in our spider
Let’s get back to our spider. Until now, it doesn’t extract any data in particular, just saves the whole HTML page to a local file _(额)_ . Let’s integrate the extraction logic(逻辑) above into our spider.

A Scrapy spider typically **generates many dictionaries** containing the data extracted from the page. To do that, we use the **yield** Python keyword in the callback, as you can see below:
```
import scrapy
class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'http://quotes.toscrape.com/page/1/',
        'http://quotes.toscrape.com/page/2/',
    ]

    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').extract_first(),
                'author': quote.css('small.author::text').extract_first(),
                'tags': quote.css('div.tags a.tag::text').extract(),
            }
            (yield 不断调用,似乎不用储存)
```
If you run this spider, it will output the extracted data with the log:
```
2016-09-19 18:57:19 [scrapy.core.scraper] DEBUG: Scraped from <200 http://quotes.toscrape.com/page/1/>
{'tags': ['life', 'love'], 'author': 'André Gide', 'text': '“It is better to be hated for what you are than to be loved for what you are not.”'}
2016-09-19 18:57:19 [scrapy.core.scraper] DEBUG: Scraped from <200 http://quotes.toscrape.com/page/1/>
{'tags': ['edison', 'failure', 'inspirational', 'paraphrased'], 'author': 'Thomas A. Edison', 'text': "“I have not failed. I've just found 10,000 ways that won't work.”"}
```

#### Storing the scraped data
The simplest way to store the scraped data is by using **Feed exports**, with the following command:
`scrapy crawl quotes -o quotes.json`

That will generate an quotes.json file containing all scraped items, serialized in `JSON`.

For historic reasons, Scrapy **appends to** a given file **instead of overwriting** its contents. If you run this command twice without removing the file before the second time, you’ll end up with a broken JSON file.
**(两次使用会损坏json文件)**
You can also use other formats, like JSON Lines:
`scrapy crawl quotes -o quotes.jl`

>The JSON Lines format is useful because it’s **stream-like**, **you can easily append new records to it.** It doesn’t have the same problem of JSON when you run twice. Also, **as each record is a separate line**, you can process big files without having to fit everything in memory, there are tools like JQ to help doing that at the command-line.

In small projects (like the one in this tutorial), that should be enough. However, if you want to **perform more complex things with the scraped items, you can write an Item Pipeline**. A placeholder file for Item Pipelines has been set up for you when the project is created, in tutorial/pipelines.py.**(预先创建好了pipelines文件)** Though you **don’t need to implement any item pipelines** if you just want to store the scraped items.

#### Following links
Let’s say, instead of just scraping the stuff from the first two pages from `http://quotes.toscrape.com`, you want quotes from all the pages in the website.

Now that you know how to extract data from pages, let’s see how to follow links from them.

First thing is to extract the link to the page we want to follow. Examining our page, we can see there is a link to the next page with the following markup:
```
<ul class="pager">
    <li class="next">
        <a href="/page/2/">Next <span aria-hidden="true">&rarr;</span></a>
    </li>
</ul>
```
We can try extracting it in the shell:
```
>>> response.css('li.next a').extract_first()
'<a href="/page/2/">Next <span aria-hidden="true">→</span></a>'
```
This gets the anchor element, but we want the attribute href. For that, Scrapy supports a CSS extension that let’s you select the attribute contents, like this:
```
>>> response.css('li.next a::attr(href)').extract_first()
'/page/2/'
```
Let’s see now our spider modified to recursively follow the link to the next page, extracting data from it:
```
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'http://quotes.toscrape.com/page/1/',
    ]

    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').extract_first(),
                'author': quote.css('small.author::text').extract_first(),
                'tags': quote.css('div.tags a.tag::text').extract(),
            }

        next_page = response.css('li.next a::attr(href)').extract_first()
        if next_page is not None:
            next_page = response.urljoin(next_page)
            yield scrapy.Request(next_page, callback=self.parse)
```
Now, after extracting the data, the parse() method looks for the link to the next page, builds a full absolute URL **using the urljoin() method** (since the links can be relative) and yields a new request to the next page, registering itself **as callback** to **handle the data** extraction for the next page and to keep the crawling going through all the pages.

What you see here is Scrapy’s mechanism(机制) of following links: **when you yield a Request in a callback method, Scrapy will schedule that request to be sent and register a callback method to be executed when that request finishes.**

Using this, you can build complex crawlers that follow links according to rules you define, and extract different kinds of data depending on the page it’s visiting.

In our example, it creates a sort of loop, following all the links to the next page until it doesn’t find one – handy for crawling blogs, forums and other sites with pagination.

#### A shortcut for creating Requests
As a shortcut for creating Request objects you can use response.follow:
```
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'http://quotes.toscrape.com/page/1/',
    ]

    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').extract_first(),
                'author': quote.css('span small::text').extract_first(),
                'tags': quote.css('div.tags a.tag::text').extract(),
            }

        next_page = response.css('li.next a::attr(href)').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)
```
Unlike scrapy.Request, **response.follow supports relative URLs directly - no need to call urljoin**.(震惊,似乎挺厉害的) Note that response.follow just returns a Request instance; you still have to yield this Request.

You can also pass a selector to response.follow instead of a string; this selector should extract necessary attributes:
```
for href in response.css('li.next a::attr(href)'):
    yield response.follow(href, callback=self.parse)
```
For <a> elements there is a shortcut: response.follow uses their href attribute automatically. So the code can be shortened further:
```
for a in response.css('li.next a'):
    yield response.follow(a, callback=self.parse)
```
**Note**
`response.follow(response.css('li.next a'))` is not valid because `response.css` returns a list-like object with selectors for all results, not a single selector. A for loop like in the example above, or `response.follow(response.css('li.next a')[0])` is fine.

#### More examples and patterns
Here is another spider that illustrates callbacks and following links, this time for scraping author information:
```
import scrapy
class AuthorSpider(scrapy.Spider):
    name = 'author'
    start_urls = ['http://quotes.toscrape.com/']
    def parse(self, response):
        # follow links to author pages
        for href in response.css('.author + a::attr(href)'):
            yield response.follow(href, self.parse_author)

        # follow pagination links
        for href in response.css('li.next a::attr(href)'):
            yield response.follow(href, self.parse)

    def parse_author(self, response):
        def extract_with_css(query):
            return response.css(query).extract_first().strip()

        yield {
            'name': extract_with_css('h3.author-title::text'),
            'birthdate': extract_with_css('.author-born-date::text'),
            'bio': extract_with_css('.author-description::text'),
        }
```
This spider will start from the main page, it will follow all the links to the authors pages calling the parse_author callback for each of them, and also the pagination links with the parse callback as we saw before.

Here we’re passing callbacks to response.follow as positional arguments to make the code shorter; it also works for `scrapy.Request`.

The parse_author callback **defines a helper function** to extract and cleanup the data from a CSS query and yields the Python dict with the author data.

Another interesting thing this spider demonstrates(显示) is that, even if there are many quotes from the same author, we don’t need to worry about visiting the same author page multiple times. By default, Scrapy filters out duplicated requests to URLs already visited, avoiding the problem of hitting servers too much because of a programming mistake. This can be configured by the setting DUPEFILTER_CLASS.(不用担心死循环)

Hopefully by now you have a good understanding of how to use the mechanism of following links and callbacks with Scrapy.

As yet another example spider that leverages the mechanism of following links, check out the CrawlSpider class for a generic spider that implements a small rules engine that you can use to write your crawlers on top of it.(可以写自己的规则?是这个意思吧)
Also, a common pattern is to build an item with data from more than one page, using [a trick to pass additional data to the callbacks](https://doc.scrapy.org/en/latest/topics/request-response.html#topics-request-response-ref-request-callback-arguments).

#### Using spider arguments
You can provide command line arguments to your spiders by using the -a option when running them:
`scrapy crawl quotes -o quotes-humor.json -a tag=humor`
(使用-a选项 添加attr)
These arguments are passed to the Spider’s \__init__ method and become spider attributes by default.

In this example, the value provided for the tag argument will be available via self.tag. You can use this to make your spider fetch only quotes with a specific tag, building the URL based on the argument:
```
import scrapy
class QuotesSpider(scrapy.Spider):
    name = "quotes"
    def start_requests(self):
        url = 'http://quotes.toscrape.com/'
        tag = getattr(self, 'tag', None)
        if tag is not None:
            url = url + 'tag/' + tag
        yield scrapy.Request(url, self.parse)

    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').extract_first(),
                'author': quote.css('small.author::text').extract_first(),
            }(先处理得到的文本)
        next_page = response.css('li.next a::attr(href)').extract_first()
        (再去获取下一个page)
        if next_page is not None:
            yield response.follow(next_page, self.parse)
```
If you pass the `tag=humor` argument to this spider, you’ll notice that it will only visit URLs from the humor tag, such as `http://quotes.toscrape.com/tag/humor`.

You can learn more about [handling spider arguments here](https://doc.scrapy.org/en/latest/topics/spiders.html#spiderargs).
