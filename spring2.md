### Spring Bean 作用域(设置scope)
当在 Spring 中定义一个 bean 时，你必须声明该 bean 的作用域的选项。例如，为了强制 Spring 在每次需要时都产生一个新的 bean 实例，你应该声明 bean 的作用域的属性为 prototype。同理，如果你想让 Spring 在每次需要时都返回同一个bean实例，你应该声明 bean 的作用域的属性为 singleton。

Spring 框架支持以下五个作用域，如果你使用 web-aware ApplicationContext 时，其中三个是可用的。

作用域	|描述
--|--
singleton | 在spring IoC容器仅存在一个Bean实例，Bean以单例方式存在，默认值(每次get到的都是上次的旧的)
prototype	|每次从容器中调用Bean时，都返回一个新的实例，即每次调用getBean()时，相当于执行newXxxBean()(获得的是一个全新的对象)
request	|每次HTTP请求都会创建一个新的Bean，该作用域仅适用于WebApplicationContext环境
session|	同一个HTTP Session共享一个Bean，不同Session使用不同的Bean，仅适用于WebApplicationContext环境
global-session|	一般用于Portlet应用环境，该运用域仅适用于WebApplicationContext环境

本章将讨论前两个范围，当我们将讨论有关 web-aware Spring ApplicationContext 时，其余三个将被讨论。

singleton 作用域：
当一个bean的作用域为Singleton，那么Spring IoC容器中只会存在一个共享的bean实例，并且所有对bean的请求，只要id与该bean定义相匹配，则只会返回bean的同一实例。

Singleton是单例类型，就是在**创建起容器时就同时自动创建了一个bean的对象，不管你是否使用，他都存在了**，每次获取到的对象**都是同一个对象**。注意，Singleton作用域是Spring中的缺省作用域(默认值)。你可以在 bean 的配置文件中设置作用域的属性为 singleton，如下所示：

```
<!-- A bean definition with singleton scope -->
<bean id="..." class="..." scope="singleton">
    <!-- collaborators and configuration for this bean go here -->
</bean>
```
例子
我们在适当的位置使用 Eclipse IDE，然后按照下面的步骤来创建一个 Spring 应用程序：

步骤|	描述
--|--
1	|创建一个名称为 SpringExample 的项目，并且在创建项目的 src 文件夹中创建一个包 com.tutorialspoint。
2	|使用 Add External JARs 选项，添加所需的 Spring 库，在 Spring Hello World Example 章节解释。
3	|在 com.tutorialspoint 包中创建 Java 类 HelloWorld 和 MainApp。
4	|在 src 文件夹中创建 Beans 配置文件 Beans.xml。
5	|最后一步是创建的所有 Java 文件和 Bean 配置文件的内容，并运行应用程序，解释如下。
  |  
这里是 HelloWorld.java 文件的内容：
```
package com.tutorialspoint;
public class HelloWorld {
   private String message;
   public void setMessage(String message){
      this.message  = message;
   }
   public void getMessage(){
      System.out.println("Your Message : " + message);
   }
}
```
下面是 MainApp.java 文件的内容：
```
package com.tutorialspoint;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
      HelloWorld objA = (HelloWorld) context.getBean("helloWorld");
      objA.setMessage("I'm object A");
      objA.getMessage();
      HelloWorld objB = (HelloWorld) context.getBean("helloWorld");
      objB.getMessage();
   }
}
```
下面是 singleton 作用域必需的配置文件 Beans.xml：
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld"
      scope="singleton">
   </bean>

</beans>
```
一旦你创建源代码和 bean 配置文件完成后，我们就可以运行该应用程序。如果你的应用程序一切都正常，将输出以下信息：
```
Your Message : I'm object A
Your Message : I'm object A
```

#### prototype 作用域
当一个bean的作用域为Prototype，表示一个bean定义对应多个对象实例。Prototype作用域的bean会导致在每次对该bean请求（将其注入到另一个bean中，或者以程序的方式调用容器的getBean()方法）时**都会创建一个新的bean实例**。Prototype是原型类型，**它在我们创建容器的时候并没有实例化**，而是当我们**获取bean的时候才会去创建一个对象**，而且我们每次获取到的对象**都不是同一个对象**。根据经验，对有状态的bean应该使用prototype作用域，而对无状态的bean则应该使用singleton作用域。

为了定义 prototype 作用域，你可以在 bean 的配置文件中设置作用域的属性为 prototype，如下所示：
```
<!-- A bean definition with singleton scope -->
<bean id="..." class="..." scope="prototype">
   <!-- collaborators and configuration for this bean go here -->
</bean>
```

例子
我们在适当的位置使用 Eclipse IDE，然后按照下面的步骤来创建一个 Spring 应用程序：

步骤|	描述
--|--
1	|创建一个名称为 SpringExample 的项目，并且在创建项目的 src 文件夹中创建一个包com.tutorialspoint。
2	|使用 Add External JARs 选项，添加所需的 Spring 库，解释见 Spring Hello World Example 章节。
3	|在 com.tutorialspoint 包中创建 Java 类 HelloWorld 和 MainApp。
4	|在 src 文件夹中创建 Beans 配置文件Beans.xml。
5	|最后一步是创建的所有 Java 文件和 Bean 配置文件的内容，并运行应用程序，解释如下所示。

这里是 HelloWorld.java 文件的内容：
```
package com.tutorialspoint;

public class HelloWorld {
   private String message;

   public void setMessage(String message){
      this.message  = message;
   }

   public void getMessage(){
      System.out.println("Your Message : " + message);
   }
}
```
下面是 MainApp.java 文件的内容：
```
package com.tutorialspoint;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
      HelloWorld objA = (HelloWorld) context.getBean("helloWorld");
      objA.setMessage("I'm object A");
      objA.getMessage();
      HelloWorld objB = (HelloWorld) context.getBean("helloWorld");
      objB.getMessage();
   }
}
```
下面是 prototype 作用域必需的配置文件 Beans.xml：
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld"
      scope="prototype">
   </bean>

</beans>
```
一旦你创建源代码和 Bean 配置文件完成后，我们就可以运行该应用程序。如果你的应用程序一切都正常，将输出以下信息：
```
Your Message : I'm object A
Your Message : null
```

#### Spring Bean 生命周期
理解 Spring bean 的生命周期很容易。当一个 bean 被实例化时，它可能需要执行一些初始化使它转换成可用状态。同样，当 bean 不再需要，并且从容器中移除时，可能需要做一些**清除工作**。

尽管还有一些在 Bean 实例化和销毁之间发生的活动，但是本章将只讨论两个重要的生命周期回调方法，它们在 bean 的初始化和销毁的时候是必需的。

为了定义安装和拆卸一个 bean，我们只要声明带有 init-method 和/或 destroy-method 参数的 。init-method 属性指定一个方法，在实例化 bean 时，立即调用该方法。同样，destroy-method 指定一个方法，只有从容器中移除 bean 之后，才能调用该方法。

**初始化回调**
`org.springframework.beans.factory.InitializingBean` 接口指定一个单一的方法：

`void afterPropertiesSet() throws Exception;`
因此，你可以简单地实现上述接口和初始化工作可以在 `afterPropertiesSet()` 方法中执行，如下所示：

```
public class ExampleBean implements InitializingBean {
   public void afterPropertiesSet() {
      // do some initialization work
   }
}
```
在基于 XML 的配置元数据的情况下，你可以使用 init-method 属性来**指定带有 void 无参数方法**的名称。例如：
```
<bean id="exampleBean"
         class="examples.ExampleBean" init-method="init"/>
         ```
下面是类的定义：
```
public class ExampleBean {
   public void init() {
      // do some initialization work
   }
}
```
**销毁回调**
`org.springframework.beans.factory.DisposableBean` 接口指定一个单一的方法：

`void destroy() throws Exception;`
因此，你可以简单地实现上述接口并且结束工作可以在 destroy() 方法中执行，如下所示：
```
public class ExampleBean implements DisposableBean {
   public void destroy() {
      // do some destruction work
   }
}
```
在基于 XML 的配置元数据的情况下，你可以使用 destroy-method 属性来指定带有 void 无参数方法的名称。例如：
```
<bean id="exampleBean"
         class="examples.ExampleBean" destroy-method="destroy"/>
         ```
下面是类的定义：
```
public class ExampleBean {
   public void destroy() {
      // do some destruction work
   }
}
```
