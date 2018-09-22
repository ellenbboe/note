    pacman -D --asexplicite xxx 设置为单独安装的包
    pacman -Qtd 出来的包可以删 但有些删除可能会有影响,大多没用
    pacman -Rscn 可以删除干净包
    pacman -Rdd 是在出现了依赖问题的时候用用,一般就不用它,他是强行破坏
    依赖关系
    有些依赖关系不一定会长久存在,所以pacman -Qtd不是删除干净包就一定没有东西的
    可能会在你装包的时候出现依赖的更新
    pacman不会自动帮你删除孤包
    Rdd所操作的对象往往是这个包同时被其他的包依赖，
    如果你正常情况下用R去卸它是会报错提示破坏依赖的。
    比如一条依赖树a-b-c，即c依赖b，b又依赖a，
    那么如果你用R或者Rs去卸载b就会报错提示你c的依赖将被破坏所以不能卸。
    如果是用Rdd卸载b就是不管谁依赖它就是强行把b一个东西删掉，
    本质上是临时破坏一下依赖。这个做法往往是出了什么问题才会用的。
    卸载同时删配置文件的参数是-n，-c的意思是同时把依赖它的包也卸载掉


**总结一下**

    对于a-b-c这样一条依赖树且a和b都是作为依赖安装的，
    那么如果使用-R、-Rs去卸载b就会报错提示c的依赖被破坏并中断操作，
    使用-Rdd卸载b就会强行删b，同时a和c被保留。
    使用-Rc卸b就会把b和c卸载掉，用-Rsc卸b就会把abc全卸掉
```
    pacman -Sy abc              #和源同步后安装名为abc的包
    pacman -S   abc             #从本地数据库中得到abc的信息，下载安装abc包
    pacman -Sf abc              #强制安装包abc
    pacman -Ss abc              #搜索有关abc信息的包
    pacman -Si abc              #从数据库中搜索包abc的信息
    pacman -Q                   #列出已经安装的软件包
    pacman -Q abc               #检查 abc 软件包是否已经安装
    pacman -Qi abc              #列出已安装的包abc的详细信息
    pacman -Ql abc              #列出abc软件包的所有文件
    pacman -Qo /path/to/abc     #列出abc文件所属的软件包
    pacman -Syu                 #同步源，并更新系统
    pacman -Sy                  #仅同步源
    pacman -Su                  #更新系统
    pacman -R   abc             #删除abc包
    pacman -Rd abc              #强制删除被依赖的包
    pacman -Rc abc              #删除abc包和依赖abc的包
    pacman -Rsc abc             #删除abc包和abc依赖的包
    pacman -Sc                  #清理/var/cache/pacman/pkg目录下的旧包
    pacman -Scc                 #清除所有下载的包和数据库
    pacman -U   abc             #安装下载的abs包，或新编译的abc包
    pacman -Sd abc              #忽略依赖性问题，安装包abc
    pacman -Su --ignore foo     #升级时不升级包foo
    pacman -Sg abc              #查询abc这个包组包含的软件包
```
