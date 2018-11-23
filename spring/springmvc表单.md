
### student对象
```java
package beans;

public class student {
    private Integer age;
    private String name;
    private Integer id;

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}

```


### 向视图传递变量

```java
@RequestMapping(value = "/addStudent",method = RequestMethod.POST)
    public String addStudent(@ModelAttribute("SpringWeb")student student,
                             ModelMap model) {
        model.addAttribute("name", "dsa");
        model.addAttribute("age", student.getAge());
        model.addAttribute("id", student.getId());
        return "result";
    }
    ```


### result.jsp

```xml
    <%@ page contentType="text/html; charset=UTF-8" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<html>
<head>
    <title>Spring MVC表单处理</title>
</head>
<body>

<h2>提交的学生信息如下 - </h2>
<table>
    <tr>
        <td>名称：</td>
        <td>${name}</td>
    </tr>
    <tr>
        <td>年龄：</td>
        <td>${age}</td>
    </tr>
    <tr>
        <td>编号：</td>
        <td>${id}</td>
    </tr>
</table>
</body>
</html>
    ```

### jsp ${变量} 无效
web.xml
配置版本改成下面
```xml
<?xml version="1.0" encoding="UTF-8"?>

<web-app xmlns="http://java.sun.com/xml/ns/javaee"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd " version="2.5">



</web-app>


假如是java的配置的话,删掉web.xml就好了
```

### jsp 显示中文乱码
jsp
```xml
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
```

### model乱码
web.xml加入
```xml
<filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <!--要使用的字符集，一般我们使用UTF-8(保险起见UTF-8最好)-->
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <!--是否强制设置request的编码为encoding，默认false，不建议更改-->
            <param-name>forceRequestEncoding</param-name>
            <param-value>false</param-value>
        </init-param>
        <init-param>
            <!--是否强制设置response的编码为encoding，建议设置为true，下面有关于这个参数的解释-->
            <param-name>forceResponseEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <!--这里不能留空或者直接写 ' / ' ，否者不起作用-->
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```

这个favorites是传给界面用的变量名称
```
modelMap.addAttribute("favorites",user.getFavorites());
```

多选框
controller文件中
```
@ModelAttribute("webFrameworkList")
    public List<String> getWebFrameworkList()
    {
        List<String> webFrameworkList = new ArrayList<String>();
        webFrameworkList.add("Spring MVC");
        webFrameworkList.add("Spring Boot");
        webFrameworkList.add("Struts 2");
        webFrameworkList.add("Apache Hadoop");
        return webFrameworkList;
    }
```
在表单文件中获取modelAttribute(返回的是一个list)
主要是生成表单是使用控制类里面的modelAttribute的name
```
<form:checkboxes items="${webFrameworkList}" path="favorites" />
```
表单提交后通过getAttribute得到选项(如果返回的是list或者map等多个数据的话),或者是从model里面获取数据(之前不是addAttribute了吗)

requset方法报红: https://blog.csdn.net/m0_37925061/article/details/79645059  好像红了也可以用.....
