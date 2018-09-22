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

如果你在**非 web 应用程序环境**中使用 Spring 的 IoC 容器；例如在丰富的客户端桌面环境中；那么在 JVM 中你要注册关闭 hook。这样做可以确保正常关闭，为了让所有的资源都被释放，可以在单个 beans 上调用 destroy 方法。

建议你不要使用 `InitializingBean` 或者 `DisposableBean` 的回调方法，因为 XML 配置在命名方法上提供了极大的灵活性。

例子
我们在适当的位置使用 Eclipse IDE，然后按照下面的步骤来创建一个 Spring 应用程序：

步骤|	描述
--|--
1	|创建一个名称为 SpringExample 的项目，并且在创建项目的 src 文件夹中创建一个包 com.tutorialspoint。
2	|使用 Add External JARs 选项，添加所需的 Spring 库，解释见 Spring Hello World Example 章节。
3	|在 com.tutorialspoint 包中创建 Java 类 HelloWorld 和 MainApp。
4	|在 src 文件夹中创建 Beans 配置文件 Beans.xml。
5	|最后一步是创建的所有 Java 文件和 Bean 配置文件的内容，并运行应用程序，解释如下所示。

这里是 `HelloWorld.java` 的文件的内容：
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
   public void init(){
      System.out.println("Bean is going through init.");
   }
   public void destroy(){
      System.out.println("Bean will destroy now.");
   }
}
```
下面是 MainApp.java 文件的内容。在这里，你**需要注册**一个在 **AbstractApplicationContext 类中声明的关闭 hook 的 registerShutdownHook() 方法**。它将确保正常关闭，并且调用相关的 destroy 方法。
```
package com.tutorialspoint;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
      HelloWorld obj = (HelloWorld) context.getBean("helloWorld");
      obj.getMessage();
      context.registerShutdownHook();
   }
}
```
下面是 init 和 destroy 方法必需的配置文件 Beans.xml 文件：
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld"
       class="com.tutorialspoint.HelloWorld"
       init-method="init" destroy-method="destroy">
       <property name="message" value="Hello World!"/>
   </bean>

</beans>
```
一旦你创建源代码和 bean 配置文件完成后，我们就可以运行该应用程序。如果你的应用程序一切都正常，将输出以下信息：
```
Bean is going through init.
Your Message : Hello World!
Bean will destroy now.
```

#### 默认的初始化和销毁方法
如果你有太多具有相同名称的初始化或者销毁方法的 Bean，那么你**不需要在每一个 bean 上声明初始化方法和销毁方法**。框架使用 元素中的 `default-init-method` 和 `default-destroy-method` 属性提供了灵活地配置这种情况，如下所示：
```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd"
    default-init-method="init"
    default-destroy-method="destroy">

   <bean id="..." class="...">
       <!-- collaborators and configuration for this bean go here -->
   </bean>

</beans>
```
#### Spring Bean 后置处理器
`BeanPostProcessor` 接口定义回调方法，你可以实现该方法来提供自己的实例化逻辑，依赖解析逻辑等。你也可以在 Spring 容器通过插入一个或多个 `BeanPostProcessor` 的实现来完成实例化，配置和初始化一个bean之后实现一些自定义逻辑回调方法。

你可以配置多个 BeanPostProcesso r接口，通过设置 BeanPostProcessor 实现的 Ordered 接口提供的 order 属性来控制这些 BeanPostProcessor 接口的执行顺序。

BeanPostProcessor 可以对 bean（或对象）实例进行操作，这意味着 Spring IoC 容器实例化一个 bean 实例，然后 BeanPostProcessor 接口进行它们的工作。

**ApplicationContext 会自动检测由 BeanPostProcessor 接口的实现定义的 bean，注册这些 bean 为后置处理器，然后通过在容器中创建 bean，在适当的时候调用它。**

例子：
下面的例子显示如何在 ApplicationContext 的上下文中编写，注册和使用 BeanPostProcessor。

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
   public void init(){
      System.out.println("Bean is going through init.");
   }
   public void destroy(){
      System.out.println("Bean will destroy now.");
   }
}
```
这是实现 BeanPostProcessor 的非常简单的例子，它在任何 bean 的初始化的之前和之后输入该 bean 的名称。你可以在初始化 bean 的之前和之后实现更复杂的逻辑，因为你有两个访问内置 bean 对象的后置处理程序的方法。

这里是 InitHelloWorld.java 文件的内容：
```
package com.tutorialspoint;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.beans.BeansException;
public class InitHelloWorld implements BeanPostProcessor {
   public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      System.out.println("BeforeInitialization : " + beanName);
      return bean;  // you can return any other object as well
   }
   public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
      System.out.println("AfterInitialization : " + beanName);
      return bean;  // you can return any other object as well
   }
}
```
下面是 MainApp.java 文件的内容。在这里，**你需要注册一个在 AbstractApplicationContext 类中声明的关闭 hook 的 registerShutdownHook() 方法。它将确保正常关闭，并且调用相关的 destroy 方法。**
```
package com.tutorialspoint;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      AbstractApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
      HelloWorld obj = (HelloWorld) context.getBean("helloWorld");
      obj.getMessage();
      context.registerShutdownHook();
   }
}
```
下面是 init 和 destroy 方法需要的配置文件 Beans.xml 文件：
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld"
       init-method="init" destroy-method="destroy">
       <property name="message" value="Hello World!"/>
   </bean>

   <bean class="com.tutorialspoint.InitHelloWorld" />

</beans>
```
一旦你创建源代码和 bean 配置文件完成后，我们就可以运行该应用程序。如果你的应用程序一切都正常，将输出以下信息：
```
BeforeInitialization : helloWorld
Bean is going through init.
AfterInitialization : helloWorld
Your Message : Hello World!
Bean will destroy now.
```
### Spring Bean 定义继承
bean 定义可以包含很多的配置信息，包括构造函数的参数，属性值，容器的具体信息例如初始化方法，静态工厂方法名，等等。

子 bean 的定义继承父定义的配置数据。子定义可以根据需要重写一些值，或者添加其他值。

Spring Bean 定义的继承与 Java 类的继承无关，但是继承的概念是一样的。你可以定义一个父 bean 的定义作为模板和其他子 bean 就可以从父 bean 中继承所需的配置。

当你使用基于 XML 的配置元数据时，通过使用父属性，指定父 bean 作为该属性的值来表明子 bean 的定义。

例子
我们在适当的位置使用 Eclipse IDE，然后按照下面的步骤来创建一个 Spring 应用程序：

步骤	|描述
--|--
1	|创建一个名称为 SpringExample 的项目，并且在创建项目的 src 文件夹中创建一个包 com.tutorialspoint。
2	|使用 Add External JARs 选项，添加所需的 Spring 库，解释见 Spring Hello World Example 章节。
3	|在 com.tutorialspoint 包中创建 Java 类 HelloWorld、HelloIndia 和 MainApp。
4|	在 src 文件夹中创建 Beans 配置文件 Beans.xml。
5	|最后一步是创建的所有 Java 文件和 Bean 配置文件的内容，并运行应用程序，解释如下所示。

下面是配置文件 `Beans.xml`，在该配置文件中我们定义有两个属性 `message1` 和 `message2` 的 `“helloWorld” bean`。然后，使用 parent 属性把 `“helloIndia” bean` 定义为 `“helloWorld” bean` 的孩子。这个子 bean 继承 message2 的属性，重写 message1 的属性，并且引入一个属性 message3。
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld">
      <property name="message1" value="Hello World!"/>
      <property name="message2" value="Hello Second World!"/>
   </bean>

   <bean id="helloIndia" class="com.tutorialspoint.HelloIndia" parent="helloWorld">
      <property name="message1" value="Hello India!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

</beans>
```
这里是 HelloWorld.java 文件的内容：
```
package com.tutorialspoint;
public class HelloWorld {
   private String message1;
   private String message2;
   public void setMessage1(String message){
      this.message1  = message;
   }
   public void setMessage2(String message){
      this.message2  = message;
   }
   public void getMessage1(){
      System.out.println("World Message1 : " + message1);
   }
   public void getMessage2(){
      System.out.println("World Message2 : " + message2);
   }
}
```
这里是 HelloIndia.java 文件的内容：
```
package com.tutorialspoint;

public class HelloIndia {
   private String message1;
   private String message2;
   private String message3;

   public void setMessage1(String message){
      this.message1  = message;
   }

   public void setMessage2(String message){
      this.message2  = message;
   }

   public void setMessage3(String message){
      this.message3  = message;
   }

   public void getMessage1(){
      System.out.println("India Message1 : " + message1);
   }

   public void getMessage2(){
      System.out.println("India Message2 : " + message2);
   }

   public void getMessage3(){
      System.out.println("India Message3 : " + message3);
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

      objA.getMessage1();
      objA.getMessage2();

      HelloIndia objB = (HelloIndia) context.getBean("helloIndia");
      objB.getMessage1();
      objB.getMessage2();
      objB.getMessage3();
   }
}
```
一旦你创建源代码和 bean 配置文件完成后，我们就可以运行该应用程序。如果你的应用程序一切都正常，将输出以下信息：
```
World Message1 : Hello World!
World Message2 : Hello Second World!
India Message1 : Hello India!
India Message2 : Hello Second World!
India Message3 : Namaste India!
```
在这里你可以观察到，我们创建 “helloIndia” bean 的同时并没有传递 message2，但是由于 Bean 定义的继承，所以它传递了 message2。

Bean 定义模板
你可以创建一个 Bean 定义模板，不需要花太多功夫它就可以被其他子 bean 定义使用。在定义一个 Bean 定义模板时，你不应该指定类的属性，**而应该指定带 true 值的抽象属性**，如下所示：
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="beanTeamplate" abstract="true">
      <property name="message1" value="Hello World!"/>
      <property name="message2" value="Hello Second World!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

   <bean id="helloIndia" class="com.tutorialspoint.HelloIndia" parent="beanTeamplate">
      <property name="message1" value="Hello India!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

</beans>
```
父 bean 自身**不能被实例化**，因为它是**不完整**的，而且它也被明确地标记为**抽象**的。当一个定义是抽象的，它仅仅作为一个**纯粹的模板 bean ** 定义来使用的，充当子定义的父定义使用。

主观总结:
在使用初始化和摧毁的函数的时候可以使用初始化和摧毁的接口
不调用`context.registerShutdownHook();` 似乎摧毁的函数出不来
BeanPostProcessor 似乎是自动调用的,在当要初始化一个bean和初始化完成后的时候,  
id 是用来在mainapp里面get bean的
