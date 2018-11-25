# Spring的阶段性总结

首先第一个体验就是boot的配置确实简单一点

### 0. springboot使用的是java配置以及application.properties文件中的赋值语句的配置
#### pom.xml的形式

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>mysite</groupId>
  <artifactId>design</artifactId>
  <version>1.0-SNAPSHOT</version>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.5.RELEASE</version>
  </parent>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA Data (We are going to use Repositories, Entities, Hibernate, etc...) -->

    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>

    <!-- Use MySQL Connector-J -->

    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
    </dependency>

    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>


    <dependency>
      <groupId>org.webjars</groupId>
      <artifactId>bootstrap</artifactId>
      <version>3.3.7-1</version>
    </dependency>
    <dependency>
      <groupId>net.coobird</groupId>
      <artifactId>thumbnailator</artifactId>
      <version>0.4.8</version>
    </dependency>
    <dependency>
      <groupId>org.webjars</groupId>
      <artifactId>jquery</artifactId>
      <version>3.1.1</version>
    </dependency>
      <dependency>
          <groupId>org.webjars</groupId>
          <artifactId>materializecss</artifactId>
          <version>0.96.0</version>
      </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-devtools</artifactId>
      <optional>true</optional>
      <scope>true</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-configuration-processor</artifactId>
      <optional>true</optional>
    </dependency>
  </dependencies>

  <properties>
    <java.version>1.8</java.version>
  </properties>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <fork>true</fork>
        </configuration>
      </plugin>

    </plugins>
  </build>
</project>

```

### 1. 静态资源的配置以及bootstrap 和 jquery的配置

资源文件放在static目录下面
使用如下配置
```java
package com.site.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class Websiteconfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("/webjars/");
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }

}

```
### 2. 表单提交

使用表单提交的时候`name`的值需要和实体的名字一样,实体中的变量不需要和数据库里面一样
实体要使用注解来表明,我还写了table的注解(不知道需不需要),set和get的方法时必须的
在提交文件的时候,spring的配置文件要开启文件上传的功能,不然会报错....~~fuckit~~

### 3. 数据库repo方法与实体
这是一个坑,之前由于extends CrudRepository<E> 后面的E没写报500的错,查了一万年
方法的规范是动词(判断)加上条件 注意条件要大写(每个属性开头大写,并列的不加And)
得到的iterable就直接用list之类的,不用iterable<E>类型接受,不然会报错....
### 4. 上传文件

`Application`中:
`@EnableConfigurationProperties(StorageProperties.class)`

可以加上初始化创建文件夹

```java
//初始化   
 @Bean
    CommandLineRunner init(@Qualifier("fileSystemStorageService") StorageService storageService) {
        return (args) -> {
            storageService.init();
        };
    }
    @Bean
    CommandLineRunner init2(@Qualifier("wallPaperStorageService") StorageService storageService) {
        return (args) -> {
            storageService.init();
        };
    }
```
`StorageProperties` 和上面的`StorageProperties.class`**对应**,是因为**注解**的关系

```java
package com.site.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("storage")
public class StorageProperties {

    /**
     * Folder location for storing files
     */
    private String location = "/home/s/files";

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

}

```

### StorageService
这个写的比较垃圾了,有些只用了一些方法也必须全部**overwrite**
(因为用了两个Service来使用这个所以比较乱,有空再改改)
```java
package com.site.service;

import com.site.entity.FileEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

public interface StorageService {

    void init();

    void store(MultipartFile file,Integer id);

    List<FileEntity> loadAllByOwenId(Integer id);

    Map<String,String> loadAll(Integer Pagenum);

    Integer filecount();

    Path load(String filename);

    List<String> load();

    Resource loadAsResource(String filename);

}

```

之后就是具体的**service**
_举个例子_
```java
@Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if(resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new StorageFileNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }
```
像这样重写一下就好了
之后就在controller里面调用

### 5. 热部署
**很简单**
加上依赖
```xml
<dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-configuration-processor</artifactId>
      <optional>true</optional>
    </dependency>
```
添加上这个
```xml
<build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <fork>true</fork>
        </configuration>
      </plugin>

    </plugins>
  </build>
```
### 6. 打包上传
打包上传也是一个坑!!

**注意**`redirect`里面时跳转到**controller**寻找**handler**,所以你要写方法(_这里我的思想混乱了,redirect不是去找页面的吗?可能没有配置好_)
其次就是使用**thymeleaf**的**controller**前面**不要**加上`/`,**return**后面也**不要**加`/`,**redirect****要**加`/`
~~(shit)~~
首先`pom`里面`<artifactId>`不能是中文
然后就是`清理`,`编译`,`打包`三部曲
之后将打包好的jar文件上传到服务器

**由于**
我的服务器数据库太混杂了,结果报了错,~~md~~
解决方法就是重装系统......
重装了系统,安装`jdk8`和`mysql`就足够了
使用`java -jar xx.jar`开启网站
### 7. thymeleaf标签
th确实好用,目前只用了th:each th:if th:href="@{/xxx(dsa=1)}"(这是加上参数)
