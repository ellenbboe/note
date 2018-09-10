### Spring 概述
spring 是最受欢迎的企业级 Java 应用程序开发框架，数以百万的来自世界各地的开发人员使用 Spring 框架来创建性能好、易于测试、可重用的代码。

Spring 框架是一个开源的 Java 平台，它最初是由 Rod Johnson 编写的，并且于 2003 年 6 月首次在 Apache 2.0 许可下发布。

Spring 是轻量级的框架，其基础版本只有 2 MB 左右的大小。

Spring 框架的核心特性是可以用于开发任何 Java 应用程序，但是在 Java EE 平台上构建 web 应用程序是需要扩展的。 Spring 框架的目标是使 J2EE 开发变得更容易使用，通过启用基于 **POJO 编程模型** 来促进良好的编程实践。
>pojo 实际意义就是普通的JavaBeans（简单的实体类），特点就是支持业务逻辑的协助类。
POJO类的作用是方便程序员使用数据库中的数据表，对于程序员来说，可以很方便的将POJO类当作对象来进行使用，也可以方便的调用其get，set方法。
但不允许有业务方法,也不能携带有connection之类的方法，即不包含业务逻辑或持久逻辑等。

使用 Spring 框架的好处
下面列出的是使用 Spring 框架主要的好处：

- Spring 可以使开发人员使用 POJOs 开发企业级的应用程序。只使用 POJOs 的好处是你不需要一个 EJB 容器产品，比如一个应用程序服务器，但是你可以选择使用一个健壮的 servlet 容器，比如 Tomcat 或者一些商业产品。

- Spring 在一个单元模式中是有组织的。即使包和类的数量非常大，你只要担心你需要的，而其它的就可以忽略了。

- Spring 不会让你白费力气做重复工作，它真正的利用了一些现有的技术，像ORM 框架、日志框架、JEE、Quartz 和 JDK 计时器，其他视图技术。

- 测试一个用 Spring 编写的应用程序很容易，因为环境相关的代码被移动到这个框架中。此外，通过使用 JavaBean-style POJOs，它在使用依赖注入注入测试数据时变得更容易。

- Spring 的 web 框架是一个设计良好的 web MVC 框架，它为比如 Structs 或者其他工程上的或者不怎么受欢迎的 web 框架提供了一个很好的供替代的选择。

- Spring 对JavaEE开发中非常难用的一些API（JDBC、JavaMail、远程调用等），都提供了封装，使这些API应用难度大大降低。

- 轻量级的 IOC 容器往往是轻量级的，例如，特别是当与 EJB 容器相比的时候。这有利于在内存和 CPU 资源有限的计算机上开发和部署应用程序。

- Spring提供了一致的事务管理接口，可向下扩展到（使用一个单一的数据库，例如）本地事务并扩展到全局事务（例如，使用 JTA）。

#### 依赖注入（DI）
Spring 最认同的技术是 **控制反转的依赖注入（DI）模式**。**控制反转（IoC）** 是一个通用的概念，它可以用许多不同的方式去表达，依赖注入仅仅是控制反转的一个具体的例子。

当编写一个复杂的 Java 应用程序时，应用程序类应该尽可能的 **独立于** 其他的 Java 类来增加这些类可重用可能性，当进行单元测试时，可以使它们独立于其他类进行测试。依赖注入（或者有时被称为配线）有助于将这些类粘合在一起，并且在同一时间让它们**保持独立**。

到底什么是依赖注入？让我们将这两个词分开来看一看。这里将依赖关系部分转化为两个类之间的关联。例如，类 A 依赖于类 B。现在，让我们看一看第二部分，注入。所有这一切都意味着**类 B** 将通过 **IoC** 被注入到**类 A** 中。

依赖注入可以以向构造函数传递参数的方式发生，或者通过使用 setter 方法 post-construction。由于依赖注入是 Spring 框架的核心部分，所以我将在一个单独的章节中利用很好的例子去解释这一概念。(依赖注入可以使用多种方式实现)

#### 面向方面的程序设计（AOP）
Spring 框架的一个关键组件是**面向方面的程序设计（AOP）框架**。一个程序中跨越多个点的功能被称为横切关注点，这些横切关注点在**概念上独立**于应用程序的业务逻辑。有各种各样常见的很好的关于方面的例子，比如日志记录、声明性事务、安全性，和缓存等等。

在 OOP (面向对象)中模块化的关键单元是类，而在 AOP(面向方面) 中模块化的关键单元是方面。AOP 帮助你将**横切关注点从它们所影响的对象中分**离出来，然而依赖注入帮助你将你的应用程序对象从**彼此**中分离出来。

Spring 框架的 AOP 模块提供了面向方面的程序设计实现，可以定义诸如方法拦截器和切入点等，从而使实现功能的代码彻底的解耦出来。使用源码级的元数据，可以用类似于.Net属性的方式合并行为信息到代码中。我将在一个独立的章节中讨论更多关于 Spring AOP 的概念。


#### 体系结构
Spring 有可能成为所有企业应用程序的一站式服务点，然而，Spring 是**模块化**的，允许你挑选和选择适用于你的模块，不必要把剩余部分也引入。下面的部分对在 Spring 框架中所有可用的模块给出了详细的介绍。

Spring 框架提供约 20 个模块，可以根据应用程序的要求来使用。


#### 核心容器
核心容器由`spring-core`，`spring-beans`，`spring-context`，`spring-context-support`和`spring-expression（SpEL，Spring表达式语言，Spring Expression Language）`等模块组成，它们的细节如下：

- `spring-core`模块提供了框架的基本组成部分，包括 IoC 和依赖注入功能。

- `spring-beans` 模块提供 BeanFactory，工厂模式的微妙实现，它移除了编码式单例的需要，并且可以把配置和依赖从实际编码逻辑中解耦。

- `context`模块建立在由core和 beans 模块的基础上建立起来的，它以一种类似于JNDI注册的方式访问对象。Context模块继承自Bean模块，并且添加了国际化（比如，使用资源束）、事件传播、资源加载和透明地创建上下文（比如，通过Servelet容器）等功能。Context模块也支持Java EE的功能，比如EJB、JMX和远程调用等。ApplicationContext接口是Context模块的焦点。spring-context-support提供了对第三方库集成到Spring上下文的支持，比如缓存（EhCache, Guava, JCache）、邮件（JavaMail）、调度（CommonJ, Quartz）、模板引擎（FreeMarker, JasperReports, Velocity）等。

- `spring-expression`模块提供了强大的表达式语言，用于在运行时查询和操作对象图。它是JSP2.1规范中定义的统一表达式语言的扩展，支持set和get属性值、属性赋值、方法调用、访问数组集合及索引的内容、逻辑算术运算、命名变量、通过名字从Spring IoC容器检索对象，还支持列表的投影、选择以及聚合等。。

#### 数据访问/集成
数据访问/集成层包括 JDBC，ORM，OXM，JMS 和事务处理模块，它们的细节如下：

（注：JDBC=Java Data Base Connectivity，ORM=Object Relational Mapping，OXM=Object XML Mapping，JMS=Java Message Service）

- JDBC 模块提供了JDBC抽象层，它消除了冗长的JDBC编码和对数据库供应商特定错误代码的解析。

- ORM 模块提供了对流行的对象关系映射API的集成，包括JPA、JDO和Hibernate等。通过此模块可以让这些ORM框架和spring的其它功能整合，比如前面提及的事务管理。

- OXM 模块提供了对OXM实现的支持，比如JAXB、Castor、XML Beans、JiBX、XStream等。

- JMS 模块包含生产（produce）和消费（consume）消息的功能。从Spring 4.1开始，集成了spring-messaging模块。。

- 事务模块为实现特殊接口类及所有的 POJO 支持编程式和声明式事务管理。（注：编程式事务需要自己写beginTransaction()、commit()、rollback()等事务管理方法，声明式事务是通过注解或配置由spring自动处理，编程式事务粒度更细）
#### Web
Web 层由 Web，Web-MVC，Web-Socket 和 Web-Portlet 组成，它们的细节如下：

- Web 模块提供面向web的基本功能和面向web的应用上下文，比如多部分（multipart）文件上传功能、使用Servlet监听器初始化IoC容器等。它还包括HTTP客户端以及Spring远程调用中与web相关的部分。。

- Web-MVC 模块为web应用提供了模型视图控制（MVC）和REST Web服务的实现。Spring的MVC框架可以使领域模型代码和web表单完全地分离，且可以与Spring框架的其它所有功能进行集成。

- Web-Socket 模块为 WebSocket-based 提供了支持，而且在 web 应用程序中提供了客户端和服务器端之间通信的两种方式。

- Web-Portlet 模块提供了用于Portlet环境的MVC实现，并反映了spring-webmvc模块的功能。
#### 其他
还有其他一些重要的模块，像 AOP，Aspects，Instrumentation，Web 和测试模块，它们的细节如下：

- AOP 模块提供了面向方面的编程实现，允许你定义方法拦截器和切入点对代码进行干净地解耦，从而使实现功能的代码彻底的解耦出来。使用源码级的元数据，可以用类似于.Net属性的方式合并行为信息到代码中。

- Aspects 模块提供了与 AspectJ 的集成，这是一个功能强大且成熟的面向切面编程（AOP）框架。

- Instrumentation 模块在一定的应用服务器中提供了类 instrumentation 的支持和类加载器的实现。

- Messaging 模块为 STOMP 提供了支持作为在应用程序中 WebSocket 子协议的使用。它也支持一个注解编程模型，它是为了选路和处理来自 WebSocket 客户端的 STOMP 信息。

- 测试模块支持对具有 JUnit 或 TestNG 框架的 Spring 组件的测试。

### Spring IoC 容器
#### IoC 容器
**Spring 容器** 是 Spring 框架的核心。**容器将创建对象，把它们连接在一起，配置它们，并管理他们的整个生命周期从创建到销毁。** Spring 容器使用 **依赖注入（DI）** 来管理组成一个应用程序的组件。这些对象被称为 Spring Beans，我们将在下一章中进行讨论。

通过阅读配置**元数据**(通过xml的配置)提供的指令，容器知道对哪些对象进行实例化，配置和组装。配置元数据可以通过 XML，Java 注释或 Java 代码来表示。下图是 Spring 如何工作的高级视图。 Spring IoC 容器利用 Java 的 POJO 类和配置元数据来生成完全配置和可执行的系统或应用程序。

Spring 提供了以下两种不同类型的容器。

序号  |  	容器 & 描述
--|--
1	  |  `Spring BeanFactory 容器` 它是最简单的容器，给 DI 提供了基本的支持，它用 `org.springframework.beans.factory.BeanFactory` 接口来定义。BeanFactory 或者相关的接口，如 BeanFactoryAware，InitializingBean，DisposableBean，在 Spring 中仍然存在具有大量的与 Spring 整合的第三方框架的反向兼容性的目的。
2	|`Spring ApplicationContext 容器` 该容器添加了更多的企业特定的功能，例如从一个属性文件中解析文本信息的能力，发布应用程序事件给感兴趣的事件监听器的能力。该容器是由 `org.springframework.context.ApplicationContext` 接口定义。

`ApplicationContext 容器`包括 `BeanFactory 容器`的所有功能，所以通常建议超过 BeanFactory。BeanFactory 仍然可以用于轻量级的应用程序，如移动设备或基于 applet 的应用程序，其中它的数据量和速度是显著


### Spring BeanFactory 容器
这是一个最简单的容器，它主要的功能是为 **依赖注入 （DI）** 提供支持，这个容器接口在 `org.springframework.beans.factory.BeanFactor` 中被定义。 BeanFactory 和相关的接口，比如BeanFactoryAware、 DisposableBean、InitializingBean，仍旧保留在 Spring 中，主要目的是向后兼容已经存在的和那些 Spring 整合在一起的第三方框架。

在 Spring 中，有大量对 BeanFactory 接口的实现。其中，最常被使用的是 `XmlBeanFactory` 类。这个容器从一个 XML 文件中读取配置元数据，由这些元数据来生成一个被配置化的系统或者应用。

在资源宝贵的移动设备或者基于 applet 的应用当中， `BeanFactory` 会被优先选择。否则，一般使用的是` ApplicationContext`，除非你有更好的理由选择 BeanFactory。

例子：
假设我们已经安装 Eclipse IDE，按照下面的步骤，我们可以创建一个 Spring 应用程序。

步骤|	描述
--|--
1	|创建一个名为 SpringExample 的工程并在 src 文件夹下新建一个名为 com.tutorialspoint 文件夹。
2	|点击右键，选择 Add External JARs 选项，导入 Spring 的库文件，正如我们在 Spring Hello World Example 章节中提到的导入方式。
3	|在 com.tutorialspoint 文件夹下创建 HelloWorld.java 和 MainApp.java 两个类文件。
4	|在 src 文件夹下创建 Bean 的配置文件 Beans.xml
5	|最后的步骤是创建所有 Java 文件和 Bean 的配置文件的内容，按照如下所示步骤运行应用程序。


### Spring ApplicationContext 容器
`Application Context` 是 spring 中较高级的容器。和 `BeanFactory` 类似，**它可以加载配置文件中定义的 bean**，将所有的 bean **集中在一起**，当有请求的时候分配 bean。 另外，它增加了企业所需要的功能，比如，从属性文件中解析文本信息和将事件传递给所指定的监听器。这个容器在 `org.springframework.context.ApplicationContext interface` 接口中定义。

`ApplicationContext` 包含 BeanFactory 所有的功能，一般情况下，相对于 BeanFactory，ApplicationContext 会**更加优秀**。当然，BeanFactory 仍可以在轻量级应用中使用，比如移动设备或者基于 applet 的应用程序。(一般都用appplictoncontext)

最常被使用的 ApplicationContext 接口实现：

- `FileSystemXmlApplicationContext`：该容器从 XML 文件中加载已被定义的 bean。在这里，你需要提供给构造器 XML 文件的完整路径。

- `ClassPathXmlApplicationContext`：该容器从 XML 文件中加载已被定义的 bean。在这里，你**不需要提供 XML 文件的完整路径**，只需正确配置 CLASSPATH 环境变量即可，因为，容器会从 CLASSPATH 中搜索 bean 配置文件。

- `WebXmlApplicationContext`：该容器会在一个 web 应用程序的范围内加载在 XML 文件中已被定义的 bean。

我们已经在 Spring Hello World Example章节中看到过 `ClassPathXmlApplicationContext` 容器，并且，在基于 spring 的 web 应用程序这个独立的章节中，我们讨论了很多关于 `XmlWebApplicationContext`。所以，接下来，让我们看一个关于 `FileSystemXmlApplicationContext` 的例子。


例子:
假设我们已经安装 Eclipse IDE，按照下面的步骤，我们可以创建一个 Spring 应用程序。

步骤	|描述
--|--
1	|创建一个名为 SpringExample 的工程， 在 src 下新建一个名为 com.tutorialspoint 的文件夹src
2	|点击右键，选择 Add External JARs 选项，导入 Spring 的库文件，正如我们在 Spring Hello World Example 章节中提到的导入方式。
3	|在 com.tutorialspoint 文件夹下创建 HelloWorld.java 和 MainApp.java 两个类文件。
4	|文件夹下创建 Bean 的配置文件 Beans.xml。
5|	最后的步骤是编辑所有 JAVA 文件的内容和 Bean 的配置文件,按照以前我们讲的那样去运行应用程序。
