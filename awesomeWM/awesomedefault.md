### Default configuration file documentation
This document explains the default rc.lua file provided by Awesome.

If LuaRocks is installed, make sure that packages installed through it are found (e.g. lgi). If LuaRocks is not installed, do nothing.

pcall(require, "luarocks.loader")
The Awesome API is distributed across many libraries (also called modules).

Here are the modules that we import:

gears	Utilities such as color parsing and objects
wibox	Awesome own generic widget framework
awful	Everything related to window managment
naughty	Notifications
menubar	XDG (application) menu implementation
beautiful	Awesome theme module
Standard awesome library

local gears = require("gears")
local awful = require("awful")
require("awful.autofocus")
Widget and layout library

local wibox = require("wibox")
Theme handling library

local beautiful = require("beautiful")
Notification library

local naughty = require("naughty")
local menubar = require("menubar")
local hotkeys_popup = require("awful.hotkeys_popup").widget
Enable hotkeys help widget for VIM and other apps when client with a matching name is opened:

require("awful.hotkeys_popup.keys")
