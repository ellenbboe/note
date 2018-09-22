## Learn Scrapy pass 1
### Walk-through of an example spider
```
import scrapy
class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'http://quotes.toscrape.com/tag/humor/',
    ]

    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').extract_first(),
                'author': quote.xpath('span/small/text()').extract_first(),
            }

        next_page = response.css('li.next a::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
```
Put this in a text file, name it to something like `quotes_spider.py` and run the spider using the `runspider` command:
```
scrapy runspider quotes_spider.py -o quotes.json
```
When this finishes you will have in the `quotes.json` file a list of the quotes in JSON format, containing text and author, looking like this (**reformatted here for better readability**):
```
[{
    "author": "Jane Austen",
    "text": "\u201cThe person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.\u201d"
},
{
    "author": "Groucho Marx",
    "text": "\u201cOutside of a dog, a book is man's best friend. Inside of a dog it's too dark to read.\u201d"
},
{
    "author": "Steve Martin",
    "text": "\u201cA day without sunshine is like, you know, night.\u201d"
},
...]
```

When you ran the command `scrapy runspider quotes_spider.py`, Scrapy looked for a Spider definition inside it and ran it through its crawler engine.**(在爬取引擎中运行爬虫)**

The crawl started by making requests to the URLs defined in the `start_urls` attribute (in this case, only the URL for quotes in humor category)**(发送请求给`start_urls`)** and called the default callback method `parse`, passing the response object as an argument.**(回调函数处理`response`)** In the parse callback, we loop through the quote elements using a CSS Selector **(通过使用css选择器)**, yield a Python dict with the extracted quote text and author**(使用python字典去提取text文本与作者)** , look for a link to the next page and schedule another request using the same `parse` method as callback.**(找到下一个`page`,调用相同的`parse`)**

Here you notice one of the main advantages about Scrapy: requests are scheduled and processed asynchronously. This means that Scrapy doesn’t need to wait for a request to be finished and processed, it can send another request or do other things in the meantime. This also means that other requests can keep going even if some request fails or an error happens while handling it.**(处理异步,请求储存在调度器里面,不知道是不是队列形式)**

While this enables you to do very fast crawls (sending multiple concurrent requests at the same time, in a fault-tolerant way) Scrapy also gives you control over the politeness of the crawl through a few settings. You can do things like setting a download delay between each request, limiting amount of concurrent requests per domain or per IP, and even using an auto-throttling extension that tries to figure out these automatically.**(可控制性:可以控制scrapy每个域名,ip访问的数量等)**

This is using feed exports to generate the JSON file, you can easily change the export format (XML or CSV, for example) or the storage backend (FTP or Amazon S3, for example). You can also write an item pipeline to store the items in a database.**(输出形式可以多样)**

还有等等等等的特性,先不了解(看了也不懂),之后学了再看看
