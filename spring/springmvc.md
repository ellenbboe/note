
### 步骤
1. 创建maven webapp 项目
2. 在pom.xml添加东西
3. 添加tomcat 或者 其他的应用服务器
4. 创建java 和resource 的文件夹
5. 将文件夹变成特殊文件夹
6. 创建包
7. 写controller文件(java类),写spring的xml文件(在resources下的文件,一般是-servelt.xml),写web.xml文件

### 依赖
```xml
<dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>5.0.9.RELEASE</version>
    </dependency>
      <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-web</artifactId>
          <version>5.0.9.RELEASE</version>
      </dependency>
      <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-webmvc</artifactId>
          <version>5.0.9.RELEASE</version>
      </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.0.9.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aop</artifactId>
      <version>5.0.9.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-beans</artifactId>
      <version>5.0.9.RELEASE</version>
    </dependency>
  </dependencies>
```
我的问题:由于没有配置好依赖,一直报500错误



### web.xml
```xml
<servlet>

    <servlet-name>index</servlet-name>//与下面的对应就好了
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:index-dispatcher-servlet.xml</param-value>//放在resources里面
    </init-param>
    <load-on-startup>1</load-on-startup>

  </servlet>
    <servlet-mapping>
    <servlet-name>index</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
```
### spring的xml文件(一般是-servelt.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">
    <context:component-scan base-package="controller"/>
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
</beans>
```


### 控制类的一般配置
写在类上的是前缀
```java
@Controller
@RequestMapping("/std")
public class studentController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView student(){
        return new ModelAndView("student","command",new student());
    }

    @RequestMapping(value = "/addStudent", method = RequestMethod.POST)
    public String addStudent(@ModelAttribute("SpringWeb")student student,
                             ModelMap model) {
        model.addAttribute("name", student.getName());
        model.addAttribute("age", student.getAge());
        model.addAttribute("id", student.getId());
        return "result";
    }
}

```
