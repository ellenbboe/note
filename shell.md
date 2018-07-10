#### shell开头
```
#!/bin/bash
#!/bin/sh
#!/usr/bin/awk
#!/usr/bin/env python
#!/usr/bin/perl
```
>这几行在第一行,不再第一行就是注释
不用的话就用相关解释器带上文件名执行
在写脚本的时候如果不加前面的也会交给bash解释,但是还是指定解释器比较好

#### 注意点一
定义变量名的时候等号旁边没有空格

要在登录后显示初始化内容可以将脚本文件放到 /etc/profile.d/

的下面或者是更改/etc/motd 文件

单引号中\`\` 命令无效

当参数大于9个要使用${}方式

> touch 主要是用来更新时间的....

> 使用cat连接两个文件

> ln -s 源文件 快捷方式 s表示链接

有多个命令就使用;号,若将输出全都重定向用{}扩起来,{}是父shell,()是子shell
#### 注意点二
```
read读到换行符为止,所以就使用循环可以将文件读完,不然好像只能读一行
黑洞/dev/null 了解一下-.-
cp mv rm 加上-i 进行确认
`command` == $(command)
`read file` 是要求用户输入并且保存到file变量中...
`read -p "" ver `就像scanf一样..(我下所的)
readonly xxx=1 或者readonly xxx(已定义) 表示只读无法改变包括unset
用重定向代替输入
```
> shell中0给了stdin 1给了stdout 2给了stderr

> 其余数字可以来关联输出文件 例如文件中>&3 命令用3>文件 输出到文件中

`exec` 将文件关联
`paste `两个文件连接
`tr`替换
`if`空格`[]` `while`空格:
> expand unexpand 将tab 转换成空格 一般只早开头 使用-a 替换全部

> unset 消除定义的变量

> ${array[\*]} == ${array[@]} ""${array[\*]}  != "${array[@]}"前面是整个数组的字符串,后面时整个数组

```
条件语句if or elif 后面要跟上 then 如:

if [ xx ]
then
    xxxxx
elif [ xxx ]
then
    xxxxx
fi
```
```
[  ]是shell的内置命令 下列给出操作符:
-eq equal to
-ne not equal to
-lt less than
-gt great than
ge (没有-哦) great or equal
如果条件判断与then写在统一行then前面加;
[]两侧要有空格
```
#### 注意点三
>在case中 中止case语句用;;如果用;& or ;;&来终止还是执行下去,他中止的是子句,会使用word在去匹配pattern,直到遇到;;结束case
递增可以使用let x=$x+1 当然也可以使用expr语句-.-我也是随机选择的....
do 和while [  ]写在一起的时候do前面有分号
while 后面可以加上命令list 使用分号;来隔开,决定是否推出循环的是最后一个命令返回值,注意是最后一个!!!
其中命令都是用[]扩起来的列入[];[];[]
[] 是条件
-n String 判断字符串长度是否非0
-z Stirng 判断字符串长度为0时就断(zero)
String=String
String!=String

```
for 后面不加in就选择传入的参数
同时也可以写的像c的for一样但是写成要这样

for((p=1,k=321;p<10;p++,k++))
do
    xxxxx
done
```
```
select var in xxx xxx xxx xxx
do
    xxxx(可以是case或者是if条件判断)
done
```
在select中要写退出循环的条件,不然会一直循环下去,还有就是要写其他选项的条件,不然不科学-.-
#### option 参数的代码
```
while getopts x:x:x: OPTION 这个option可以随便定义
do
    case $OPTION in
        x)
            xxx=$OPTAGE;; 这个变量时规定的 与$REPLY一样
done
```
写的函数可以直接调用 条件中-r 可读 -w 可写 -a and
```
${xx:-dsa}等:(也可以通过其他方式来实现)
    :-先默认后赋值,不改变
    :+先赋值,不改变
    :=改变
    :?若是空的则输出错误退出脚本
```
`$PAGER` 似乎是系统变量
> 显示文档的less也可以通过其他方式来实现

> echo -n 不换行输出 -e 激活转移字符

> sort -u 忽略相同行

> 当不能使用管道时可以使用命令替代参数

>数字或者字符串expression不能出现在$()中,要用()扩起来后在放到$()中间......

> 循环的话要注意变量的赋值

>find 命令 从给定的文件位置开始找 -iname 忽略大小写
-mtime 表示修改时间 -mtime n修改时间为n天
-mtime +n 大于n天
-mtime -n 小于n天

>如果有多个命令使用-a来连接 其中如果有()要使用\ 来转义 -o 或者

>xargs 可以处理很多参数
>
>locate 查询本地的数据库 find是直接查找文件系统
>
>dd if=file of=file count=blocks bs=bytes

#### 信号
>通过trap xx(函数名) 数字 可以将让函数才该信号出现的时候调用该函数
使用trap也可以脚本结束后调用函数,数字是0
使用'' 或者: 是屏蔽中断INT信号
使用trap INT 来恢复
exit xx 中xx是信号
kill 进程的时候要先kill掉子进程,不然会交给init进程接管
使用&&连接多个命令的时候是一个一个执行的,会创建子bash执行进程


`command|sed 'command'`
`sed 'command' file`
> 使用;分号来连接多个command(不用另起'') 或者使用-e(要''分离每个命令)
也可以将多个command写在一个文件中,-f指定文件
!可以对取值范围取反
sed stream editor 可以从管道或者文件中读取参数

`sed -n '1~2p' 1 start  2 step`
> sed还能加上正则/^$/
使用正则还能代替行号
使用&表示正则表达式获取的结果

#### awk 'script' files
```
'script' 中一般为
    /pattern/{action}
    exprssion {action}其中特殊的有: value ~ /pattern/ 与正则匹配 加个!就是不匹配  可以使用()将判断分离,这样()间可以使用||或者&&链接

分割符通过-F指定
可以在awk文件中写好命令之后使用-f来指定文件
使用BEGIN{

}来执行处理数据之前执行的初始化操作
使用next来表示 将两个命令的结果连接起来
```

`#!/bin/bash/awk -f awk脚本 .awk`
 > awk中有内建变量
    NR为行数
    FS分割符
    等等
