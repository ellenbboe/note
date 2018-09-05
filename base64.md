### Base64编码简介
Base64这个术语最初是在“MIME内容传输编码规范”中提出的。Base64不是一种加密算法，虽然编码后的字符串看起来有点加密的赶脚。它实际上是一种“二进制到文本”的编码方法，它能够将给定的任意二进制数据转换（映射）为ASCII字符串的形式，以便在只支持文本的环境中也能够顺利地传输二进制数据。例如支持MIME的电子邮件应用，或需要在XML中存储复杂数据（例如图片）时。

要实现Base64，首先需要选取适当的64个字符组成字符集。一条通用的原则是从某种常用字符集中选取64个可打印字符，这样就能避免在传输过程中丢失数据（不可打印字符在传输过程中可能会被当做特殊字符处理，从而导致丢失）。例如，MIME的Base64实现选用了大写字母、小写字母和0~9的数字作为前62个字符。其他实现通常会沿用MIME的这种方式，而仅仅在最后2个字符上有所不同，例如UTF-7编码。

我们经常会在Base64编码字符串中看到最后有“=”字符，这就是通过填充生成的。填充就是当出现编码时的情况2和3时，在后面补上“=”字符，使编码后的字符数为4的倍数。

下面这段文本：

>Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.

通过MIME Base64进行转换后就成为：

>TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=


1. 开发Base64的目的就不是为了加密，而是为了方便在文本环境中传输二进制数据

2. 所以，与开发一个加密算法不同，安全性并不是Base64的目标，只是它的一个副产物。

实际上，Base64的安全性是非常差的，这就是在实际应用中不用它加密的原因。如果你对常用加密方法有所了解的话，你应该知道有一种古老的加密方法，称为“字符替换法”。即指定一个规则，将每个字符用其他字符替换，例如将a变为c、b变为d等，这样替换后生成的结果就是密文。解密时只需要反过来操作，将c变为a、将d变为b就可以了。用不同的替换规则加密，生成的密文也不同。

用Base64来加密实际上就相当于字符替换，只不过它先对字节做了一些变换，然后再进行替换，对加密过程来说，本质上是一样的。

**字符替换法** 虽然简单，但却是一个伟大的发明，它被使用了超过1千年，一直都没有有效的方法来破解它。后来人们终于发现了它的弱点：基于词频和字母频率的统计规律，就能够轻松得到它的密钥。从那以后，加密者与解密者之间的战争从来就没有停歇过，加密者不断发明更复杂更安全的加密算法，解密者则绞尽脑汁去破解它们。
喽。


### 代码区:
**主要思想:**
将信息的每一个字母抓换为ascii码,并且将所有的ascii码连接起来,补上不足的0,使得长度能被6整除,将他们以6的间距分开,将之转化为array中的字母,加上=号(是0数量的1/2)

加密与解密是相对的

使用同一数组array
```
array=[
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
]
```
加密:
```
'''
使用base64方式加密
'''
def encrypt_base64():
    src=input("加密字符串:")
    tmp = ""
    result=""
    eqcount=0
    for char in src:
        char = ord(char) #turn to the ascii
        char = bin(char) #turn to the bin(二进制)
        char = char.replace("0b","")
        if(len(char) != 8):
            char = (8-len(char))*"0"+char
        tmp = tmp + char
    if(len(tmp)%6!= 0):
        eqcount = 6 - len(tmp)%6
        tmp = tmp + (6-len(tmp)%6)*"0"
    for i in range(0,len(tmp),6):
        base64bin=tmp[i:i+6]
        base64bin=int(base64bin,2)
        result=result + array[base64bin]
    result = result + int(eqcount/2)*"="
    return result
```


解密:
```
#-------------------------------------
'''
使用base64方式解密
'''
def decrypt_base64():
    src=input("解密字符串")
    eqcount = 0
    for i in src:
        if(i == "="):
            eqcount=eqcount+1
    src = src.replace("=",'')
    tmp = ""
    result = ""
    for char in src:
        for i in range(len(array)):
            if(array[i] == char):
                tmpbin=bin(i).replace("0b","")
                if(len(tmpbin) !=6):
                    tmpbin = (6-len(tmpbin))*"0" + tmpbin
                tmp = tmp + tmpbin

    for i in range(0,len(tmp)-eqcount*2,8):
       result=result + chr(int(tmp[i:i+8],2))
    return result
```
