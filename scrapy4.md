### Command line tool
New in version 0.10.

Scrapy is controlled through the `scrapy` command-line tool, to be referred here as the “Scrapy tool” to differentiate it from the sub-commands, which we just call “`commands`” or “`Scrapy commands`”.

The Scrapy tool provides several commands, for multiple purposes, and each one accepts a different set of arguments and options.

### Configuration settings
Scrapy will **look for** configuration parameters in ini-style `scrapy.cfg` files in standard locations:

1. `/etc/scrapy.cfg` or `c:\scrapy\scrapy.cfg` (system-wide),
2. ~/.config/scrapy.cfg ($XDG_CONFIG_HOME) and ~/.scrapy.cfg ($HOME) for global (user-wide) settings, and
3. scrapy.cfg inside a scrapy project’s root (see next section).
Settings from these files are merged in the listed order of preference: user-defined values have higher priority than system-wide defaults and project-wide settings will override all others, when defined.
**(优先级依次递增)**
Scrapy also understands, and can be configured through, a number of environment variables. Currently these are:

>SCRAPY_SETTINGS_MODULE (see Designating the settings)
SCRAPY_PROJECT
SCRAPY_PYTHON_SHELL (see Scrapy shell)
