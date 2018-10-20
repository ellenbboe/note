


第一次使用mvc 2018-10-20:
使用spring mvc框架构建,还没有使用到maven
通过该框架较快速的搭建了一个mvc项目
创建完成后需要在configuration 中添加tomcat,在同界面有deployment里点加号添加A神码的
然后如果不能访问的话就去file里project strxxxxx里选A神码的下面有fix,点到他没有提示就好了..
之后就只创建了一个controller类

@Controller
    在src包里面创建 package,把控制类放到里面,使用注解将其标出
@RequestMapping("")     
    类上的注解@RequestMapping("/hi")指定 Url路径前边一部分,方法上的注解@RequestMapping("/say")指定 Url路径最后一部分
也可以只把注解写在方法上，比如@RequestMapping("/hi/say”)

```java
package testmvc;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
@RequestMapping("/hi")
public class HiController {
    @RequestMapping("/say")//之后访问就访问/hi/say 他会return say 然后去访问下面我们设置好的路径+return的字符串+后缀名称
    public String say(Model model) {
        model.addAttribute("name","eden");//似乎是将name传递给了jsp
        model.addAttribute("url","https://www/unblog.top");
        return "say";
    }
}

```

一般上面return 绝对地址
然后在servelr.xml里写上
```xml
<context:component-scan base-package="testmvc"/>
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!-- 视图的路径 -->
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <!-- 视图名称后缀  -->
        <property name="suffix" value=".jsp"/>
    </bean>
```
这样就把路径与后缀给固定下来了

在*servelt.xml中

```xml
<servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
```
这样似乎就不用在地址栏里面写上后缀了
