
**location**:(本地文件,webapp!!不是web-inf) 表示webapp目录下（即服务器根目录）的static包下的所有文件；

**mapping**:(发出请求的url) 表示以/static开头的所有请求路径，如/static/a 或者/static/a/b；


### Spring的xml配置文件

```xml
<mvc:annotation-driven/>
<mvc:resources location="/static/" mapping="/static/**"/>
```

`<mvc:annotation-driven/>`没有加会报404错误
location路径可以改动.

### Controller的方法
(action=/staticPage)转到这个方法进行跳转
```java
@RequestMapping(value = "/staticPage",method = RequestMethod.GET)
    public String redict(){
        return "redirect:static/final.html";
    }
    ```
