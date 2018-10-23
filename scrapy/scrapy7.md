## Items
The main goal in scraping is to extract structured data from unstructured sources, typically, web pages. Scrapy spiders can return **the extracted data** as **Python dicts**. While convenient and familiar, Python dicts lack structure: it is easy to make a typo in a field name or return inconsistent data, especially  in a larger project with many spiders.

To define common output data format Scrapy provides the Item class. Item objects are simple containers used to collect the scraped data. They provide a dictionary-like API with a convenient syntax for declaring their available fields.

Various Scrapy components use extra information provided by Items: exporters look at declared fields to figure out columns to export, serialization can be customized using Item fields metadata, trackref tracks Item instances to help find memory leaks (see Debugging memory leaks with trackref), etc.

Declaring Items
Items are declared using a simple class definition syntax and Field objects. Here is an example:
