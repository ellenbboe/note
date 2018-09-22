### 凯撒加密法
凯撒加密法，或称恺撒加密、恺撒变换、变换加密，是一种最简单且最广为人知的加密技术。
它是一种替换加密的技术，明文中的所有字母都在字母表上向后（或向前）按照一个固定数目进行偏移后被替换成密文。

### 代码区
主要思想:与rot13方式相似,向后向前偏移进行加密解密
**加密**
```
def encrypt_caesar():
    shift=input("输入偏移量:")
    if(not shift.isdigit()):
        return "请输入数字!"
    src=input("输入加密字符串:")
    result = ""
    for x in src:
        if(x.isalpha()):
            if(x.islower()):
                x=x.upper()
            x=ord(x)
            x=x+int(shift)
            if(x > 90):
                x = x - 26
            x = chr(x)
        result = result + x

    return result

```

**解密**
```
def decrypt_caesar():
    shift=input("输入偏移量:")
    if(not shift.isdigit()):
        return "请输入数字!"
    src=input("输入解密字符串:")
    result = ""
    for x in src:
        if(x.isalpha()):
            if(x.isupper()):
                x=x.lower()
            x=ord(x)
            x=x-int(shift)
            if(x < 96):
                x = x + 26
            x = chr(x)
        result = result + x

    return result
```

ps:
linux还可以使用tr进行解密 具体可见rot13下面
