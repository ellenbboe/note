```
# -*- coding: utf-8 -*-

def onQQMessage(bot, contact, member, content):
    if content == '-hello':
        bot.SendTo(contact, '你好，我是QQ机器人')
    elif content == '-stop':
        bot.SendTo(contact, 'QQ机器人已关闭')
        bot.Stop()
    if '@ME' in content:
        bot.SendTo(contact, member.name+'，艾特我干嘛呢？')
    if bot.isMe(contact, member):
        print('This is me')


```
函数名必须为 “onQQMessage” ，函数参数也必须和上面的一致。
将以上代码另存为 sample.py （注意保存为 utf8 编码的文件）。放到 ~/.qqbot-tmp/plugins/ 目录下
保持前面的 qqbot 进程运行，在另一个控制台输入 qq plug sample ，则可将此文件中的 onQQMessage 函数注册到 QQBot 的相应事件上去。此时，用另外一个 QQ 向本 QQ 发送消息 “-hello”，则会自动回复 “你好，我是 QQ 机器人”，发送消息 “-stop” 则会关闭 QQ 机器人。
```
bot     : QQBot 对象，提供 List/SendTo/Stop/Restart 等接口，详见本文档第五节
contact : QContact 对象，消息的发送者，具有 ctype/qq/uin/nick/mark/card/name 等属性
member  : QContact 对象，仅当本消息为 群消息或讨论组消息 时有效，代表实际发消息的成员
content : str 对象，消息内容
```


```
if '@ME' in content:
        bot.SendTo(contact, member.name+'，艾特我干嘛呢？')
```
