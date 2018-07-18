### 安装基本系统软件过程
部分在中文版中没有,取自英文版
#### Linux-4.15.3 API Headers
Linux API 头文件（在 linux-3.19.tar.xz 里）会将内核 API 导出给 Glibc 使用。

Linux 内核需要提供一个应用编程接口（API）供系统的 C 库（LFS 中的 Glibc）调用。这通过整理 Linux 内核源码包中的多个 C 头文件来完成。

确保在之前的动作里没有留下旧文件和依赖关系：
`make mrproper`
现在要从源代码里解压出用户需要的内核头文件。因为解压过程会删除目标目录下所有文件，所以我们会先输出到一个本地中间目录后再拷贝到需要的地方。而且里面还有一些隐藏文件是给内核开发人员用的，而 LFS 不需要，所以会将它们从中间目录里删除。

```
make INSTALL_HDR_PATH=dest headers_install
find dest/include \( -name .install -o -name ..install.cmd \) -delete
cp -rv dest/include/* /usr/include
```
#### Man-pages-4.15
Man-pages 软件包里包含了超过 2,200 份 man 手册页面。

Install Man-pages by running:
`make install`

#### Glibc-2.21
Glibc 软件包包含了主要的 C 函数库。这个库提供了分配内存、搜索目录、打开关闭文件、读写文件、操作字符串、模式匹配、基础算法等基本程序。
**注意**
有些 LFS 之外的软件包会建议安装 `GNU libiconv` 来转换不同编码的文字。根据项目主页（http://www.gnu.org/software/libiconv/ ）上的说法“这个库会提供函数 `iconv()` 的实现，应用于那些没有这个函数的系统，或者函数实现中不支持 `Unicode` 转换的系统。” `Glibc` 提供了函数 `iconv()` 的实现而且支持 `Unicode` 转换，所以对于 LFS 系统来说并不需要 `libiconv` 库。

有些 `Glibc` 程序会用到和 FHS 不兼容的 `/var/db` 目录来存储它们的运行时数据。打上如下的补丁让这些程序在 FHS 兼容的位置存储它们的运行时数据。

`patch -Np1 -i ../glibc-2.21-fhs-1.patch`

创建链接:
`ln -sfv /tools/lib/gcc /usr/lib`

创建系统链接(_create a symlink for LSB compliance_):
```
case $(uname -m) in
    i?86)    GCC_INCDIR=/usr/lib/gcc/$(uname -m)-pc-linux-gnu/7.3.0/include
            ln -sfv ld-linux.so.2 /lib/ld-lsb.so.3
    ;;
    x86_64) GCC_INCDIR=/usr/lib/gcc/x86_64-pc-linux-gnu/7.3.0/include
            ln -sfv ../lib/ld-linux-x86-64.so.2 /lib64
            ln -sfv ../lib/ld-linux-x86-64.so.2 /lib64/ld-lsb-x86-64.so.3
    ;;
esac
```
删除前面可能遗留的文件:
`rm -f /usr/include/limits.h`

编译:
```
CC="gcc -isystem $GCC_INCDIR -isystem /usr/include" \
../configure --prefix=/usr                          \
             --disable-werror                       \
             --enable-kernel=3.2                    \
             --enable-stack-protector=strong        \
             libc_cv_slibdir=/lib
unset GCC_INCDIR
```

`CC="gcc -isystem $GCC_INCDIR -isystem /usr/include"`
Setting the location of both gcc and system include directories avoids introduction of invalid(无效) paths in debugging symbols.

`--disable-werror`
This option disables the -Werror option passed to GCC. This is necessary for running the test suite.

`--enable-stack-protector=strong`
This option increases system security by adding extra code to check for buffer overflows(缓冲溢出), such as stack smashing attacks.

`libc_cv_slibdir=/lib`
This variable sets the correct library for all systems. We do not want lib64 to be used.

在安装 Glibc 时会抱怨找不到`/etc/ld.so.conf`文件，这只是无关紧要的输出信息。下面的方式可以避免这个警告：
`touch /etc/ld.so.conf`

Fix the generated Makefile to skip an unneeded sanity check that fails in the LFS partial environment:

`sed '/test-installation/s@$(PERL)@echo not running@' -i ../Makefile`

Install the configuration file and runtime directory for nscd:

`cp -v ../nscd/nscd.conf /etc/nscd.conf`
`mkdir -pv /var/cache/nscd`

##### 安装语言环境

上面的命令并没有安装可以让你的电脑用不同语言响应的语言环境。语言环境并不是必须的，只是如果有些语言环境缺失，后续的测试套件可能会跳过一些重要测试用例。

单独的语言环境可以用 `localedef` 程序安装。例如，下面第一个 `localedef` 命令将 `/usr/share/i18n/locales/cs_CZ` 字符无关的语言环境定义和 `/usr/share/i18n/charmaps/UTF-8.gz` 字符表定义组合在一起，并将结果附加到 `/usr/lib/locale/locale-archive` 文件末尾。下面的命令将安装能完美覆盖测试所需语言环境的最小集合：
```
mkdir -pv /usr/lib/locale
localedef -i cs_CZ -f UTF-8 cs_CZ.UTF-8
localedef -i de_DE -f ISO-8859-1 de_DE
localedef -i de_DE@euro -f ISO-8859-15 de_DE@euro
localedef -i de_DE -f UTF-8 de_DE.UTF-8
localedef -i en_GB -f UTF-8 en_GB.UTF-8
localedef -i en_HK -f ISO-8859-1 en_HK
localedef -i en_PH -f ISO-8859-1 en_PH
localedef -i en_US -f ISO-8859-1 en_US
localedef -i en_US -f UTF-8 en_US.UTF-8
localedef -i es_MX -f ISO-8859-1 es_MX
localedef -i fa_IR -f UTF-8 fa_IR
localedef -i fr_FR -f ISO-8859-1 fr_FR
localedef -i fr_FR@euro -f ISO-8859-15 fr_FR@euro
localedef -i fr_FR -f UTF-8 fr_FR.UTF-8
localedef -i it_IT -f ISO-8859-1 it_IT
localedef -i it_IT -f UTF-8 it_IT.UTF-8
localedef -i ja_JP -f EUC-JP ja_JP
localedef -i ru_RU -f KOI8-R ru_RU.KOI8-R
localedef -i ru_RU -f UTF-8 ru_RU.UTF-8
localedef -i tr_TR -f UTF-8 tr_TR.UTF-8
localedef -i zh_CN -f GB18030 zh_CN.GB18030
```
另外，安装适合你自己国家、语言和字符集的语言环境。

或者，也可以一次性安装在 `glibc-2.21/localedata/SUPPORTED` 文件里列出的所有语言环境（包括以上列出的所有语言环境以及其它更多），执行下面这个非常耗时的命令：
`make localedata/install-locales`
你需要的语言环境几乎不大可能没列在 `glibc-2.21/localedata/SUPPORTED` 文件中，但如果真的没有可以使用 `localedef` 命令创建和安装。
##### 配置 Glibc

尽管 `Glibc` 在文件 `/etc/nsswitch.conf` 丢失或损坏的情况下会创建一个默认的，但是我们需要手动该创建文件，因为 `Glibc` 的默认文件在网络环境下工作时有问题。另外，也需要设置一下时区。

运行下面的命令创建一个新文件 `/etc/nsswitch.conf`：

```
cat > /etc/nsswitch.conf << "EOF"
#Begin /etc/nsswitch.conf

passwd: files
group: files
shadow: files

hosts: files dns
networks: files

protocols: files
services: files
ethers: files
rpc: files

#End /etc/nsswitch.conf
EOF
```

安装时区数据：

```
tar -xf ../../tzdata2018c.tar.gz

ZONEINFO=/usr/share/zoneinfo
mkdir -pv $ZONEINFO/{posix,right}

for tz in etcetera southamerica northamerica europe africa antarctica  \
          asia australasia backward pacificnew systemv; do
    zic -L /dev/null   -d $ZONEINFO       -y "sh yearistype.sh" ${tz}
    zic -L /dev/null   -d $ZONEINFO/posix -y "sh yearistype.sh" ${tz}
    zic -L leapseconds -d $ZONEINFO/right -y "sh yearistype.sh" ${tz}
done

cp -v zone.tab zone1970.tab iso3166.tab $ZONEINFO
zic -d $ZONEINFO -p America/New_York
unset ZONEINFO
```

`zic -L /dev/null ...`
这会创建没有时间补偿的 `posix` 时区数据。一般将它们同时放在 `zoneinfo` 和 `zoneinfo/posix` 目录下。另外需要将 `POSIX` 时区数据放到 `zoneinfo` 目录下，否则很多测试套件会报错。在嵌入式平台，如果存储空间紧张而且你也不准备更新时区，也可以不用 `posix` 目录从而节省 1.9MB，但是一些应用程序或测试套件也许会出错。

`zic -L leapseconds ...`
这会创建包含时间补偿的 right 时区数据。在嵌入式平台，空间比较紧张而且你也不打算更新时区或者不需要准确时间，你可以忽略 right 目录从而节省 1.9MB。

`zic ... -p ...`
这会创建 `posixrules` 文件。我们使用纽约是因为 `POSIX` 要求夏令时规则与 `US` 标准一致。

一种确定本地时区的方式是运行下面的脚本：
`tzselect`

然后运行下面的命令创建 `/etc/localtime` 文件：
`ln -sfv /usr/share/zoneinfo/<xxx> /etc/localtime`
将命令中的 <xxx> 替换成你所在实际时区的名字（比如 Canada/Eastern）。
我的是 `Asia/Shanghai`.


##### 配置动态库加载器
默认情况下，动态库加载器（`/lib/ld-linux.so.2`）会搜索目录 `/lib` 和 `/usr/lib` 查找程序运行时所需的动态库文件。不过，如果库文件不在 `/lib` 和 `/usr/lib` 目录下，需要把它所在目录加到 `/etc/ld.so.conf` 文件里，保证动态库加载器能找到这些库。通常有两个目录包含额外的动态库，`/usr/local/lib` 和 `/opt/lib`，把这两个目录加到动态库加载器的搜索路径中。

运行下面的命令创建一个新文件`/etc/ld.so.conf`：
```
cat > /etc/ld.so.conf << "EOF"
# Begin /etc/ld.so.conf
/usr/local/lib
/opt/lib

EOF
```
如果需要的话，动态库加载器也可以查找目录并包含里面配置文件的内容。通常在这个包含目录下的文件只有一行字指向库目录。运行下面的命令增加这个功能：

```
cat >> /etc/ld.so.conf << "EOF"
# Add an include directory
include /etc/ld.so.conf.d/*.conf

EOF

mkdir -pv /etc/ld.so.conf.d
```
#### 调整工具链(测试)

现在最后的 C 语言库已经装好了，是时候调整工具链，让新编译的程序链接到这些新的库上。

首先,备份 /tools 链接器，然后用我们在第五章调整过的链接器代替它。我们还会创建一个链接，链接到 /tools/$(gcc -dumpmachine)/bin 的副本：

mv -v /tools/bin/{ld,ld-old}
mv -v /tools/$(gcc -dumpmachine)/bin/{ld,ld-old}
mv -v /tools/bin/{ld-new,ld}
ln -sv /tools/bin/ld /tools/$(gcc -dumpmachine)/bin/ld


接下来，修改 GCC 参数文件，让它指向新的动态连接器。只需删除所有 “/tools” 的实例，这样应该可以留下到达动态链接器的正确路径。还要调整参数文件，这样 GCC 就知道怎样找到正确的头文件和 Glibc 启动文件。一个 sed 命令就能完成这些:
```
gcc -dumpspecs | sed -e 's@/tools@@g'                   \
-e '/\*startfile_prefix_spec:/{n;s@.*@/usr/lib/ @}' \
-e '/\*cpp:/{n;s@$@ -isystem /usr/include@}' >      \
`dirname $(gcc --print-libgcc-file-name)`/specs
```
确保已调整的工具链的基本功能（编译和链接）都能如期进行是非常必要的。 怎样做呢？执行下面这条命令：
```
echo 'main(){}' > dummy.c
cc dummy.c -v -Wl,--verbose &> dummy.log
readelf -l a.out | grep ': /lib'
```
如果没有任何错误，上条命令的输出应该是（不同的平台上的动态链接器可能名字不同）：

`[Requesting program interpreter: /lib/ld-linux.so.2]`
注意 /lib 现在是我们动态链接库的前缀。

现在确保我们已经设置好了启动文件：
`grep -o '/usr/lib.*/crt[1in].*succeeded' dummy.log`
上一条命令的输出应该是：
```
/usr/lib/crt1.o succeeded
/usr/lib/crti.o succeeded
/usr/lib/crtn.o succeeded
```
确保链接器能找到正确的头文件：
`grep -B1 '^ /usr/include' dummy.log`
这条命令应该返回如下输出：
```
#include <...> search starts here:
 /usr/include
 ```
接下来，确认新的链接器已经在使用正确的搜索路径：

`grep 'SEARCH.*/usr/lib' dummy.log |sed 's|; |\n|g'`
应该忽略指向带有 '-linux-gnu' 的路径，上条命令的输出应该是：
```
SEARCH_DIR("/usr/lib")
SEARCH_DIR("/lib");
```
然后我们要确定我们使用的是正确的 libc:
`grep "/lib.*/libc.so.6 " dummy.log`

上条命令的输出应该是（在 64 位主机上会有 lib64 目录）：
`attempt to open /lib/libc.so.6 succeeded`

最后，确保 GCC 使用的是正确的动态链接器：
`grep found dummy.log`

上条命令的结果应该是（不同的平台上链接器名字可以不同，64 位主机上是 lib64 目录）：
`found ld-linux.so.2 at /lib/ld-linux.so.2`

如果显示的结果不一样或者根本没有显示，那就出了大问题。检查并回溯之前的步骤，找到出错的地方并改正。最有可能的原因是参数文件的调整出了问题。在进行下一步之前所有的问题都要解决。
一旦所有的事情都正常了，清除测试文件：
`rm -v dummy.c a.out dummy.log`

#### Zlib-1.2.11
Zlib 软件包包括一些程序所使用的压缩和解压缩例程。

共享库需要移动到 /lib，因此需要重建 /usr/lib 里面的 .so 文件：
```
mv -v /usr/lib/libz.so.* /lib
ln -sfv ../../lib/$(readlink /usr/lib/libz.so) /usr/lib/libz.so
```

#### File-5.22
File 软件包包括一个判断给定的某个或某些文件文件类型的工具。
#### Readline-7.0
Readline 软件包是一个提供命令行编辑和历史能力的一些库

`sed -i '/MV.*old/d' Makefile.in`
`sed -i '/{OLDSUFF}/c:'support/shlib-install`

编译:
```
./configure --prefix=/usr    \
            --disable-static \
            --docdir=/usr/share/doc/readline-7.0
```

```
make SHLIB_LIBS="-L/tools/lib -lncursesw"
```

`SHLIB_LIBS="-L/tools/lib -lncursesw"`
This option forces Readline to link against the libncursesw library.

转移动态库到合适位置,修复一些链接符号:
```
mv -v /usr/lib/lib{readline,history}.so.* /lib
ln -sfv ../../lib/$(readlink /usr/lib/libreadline.so) /usr/lib/libreadline.so
ln -sfv ../../lib/$(readlink /usr/lib/libhistory.so ) /usr/lib/libhistory.so
```
如果需要的话,安装文档:
`install -v -m644 doc/*.{ps,pdf,html,dvi} /usr/share/doc/readline-7.0`
#### M4-1.4.18
M4软件包包含一个宏处理器
#### Bc-1.07.1
Bc软件包用于数学处理
change an internal script to use sed instead of ed:
```
cat > bc/fix-libmath_h << "EOF"
#! /bin/bash
sed -e '1   s/^/{"/' \
    -e     's/$/",/' \
    -e '2,$ s/^/"/'  \
    -e   '$ d'       \
    -i libmath.h

sed -e '$ s/$/0}/' \
    -i libmath.h
EOF
```
Create temporary symbolic links so the package can find the readline library and confirm that its required libncurses library is available. Even though the libraries are in /tools/lib at this point, _the system will use /usr/lib at the end of this chapter._
```
ln -sv /tools/lib/libncursesw.so.6 /usr/lib/libncursesw.so.6
ln -sfv libncurses.so.6 /usr/lib/libncurses.so
```
Fix an issue in configure due to missing files in the early stages of LFS:
`sed -i -e '/flex/s/as_fn_error/: ;; # &/' configure`
编译:
```
./configure --prefix=/usr           \
            --with-readline         \
            --mandir=/usr/share/man \
            --infodir=/usr/share/info
```
`--with-readline`
This option tells Bc to use the _readline library_ that is already installed on the system rather than _using its own readline version._

To test bc, run the commands below. There is quite a bit of output, so you may want to redirect it to a file. There are a very small percentage of tests (10 of 12,144) that will indicate a round off error at the last digit.
`echo "quit" | ./bc/bc -l Test/checklib.b`
#### Binutils-2.25
Binutils 软件包包含一个链接器、一个汇编器、以及其它处理目标文件的工具。
验证:
`expect -c "spawn ls`"
正常输出:
`spawn ls`
假如输出包括下面的信息，那么表示没有为 PTY 操作设置好环境。在运行 Binutils 和 GCC 的测试套件之前需要解决这个问题：
```
The system has no more ptys.
Ask your system administrator to create more.
```

编译:
```
../configure --prefix=/usr       \
             --enable-gold       \
             --enable-ld=default \
             --enable-plugins    \
             --enable-shared     \
             --disable-werror    \
             --enable-64-bit-bfd \
             --with-system-zlib
```

`--enable-gold`
Build the gold linker and install it as ld.gold (along side the default linker).

`--enable-ld=default`
Build the original bdf linker and install it as both ld (the default linker) and ld.bfd.

`--enable-plugins`
Enables plugin support for the linker.

`--enable-64-bit-bfd`
Enables 64-bit support (on hosts with narrower word sizes). May not be needed on 64-bit systems, but _does no harm_.

`--with-system-zlib`
Use the installed zlib library rather than building the included version.

编译:
`make tooldir=/usr`

`tooldir=/usr`
一般来说，`tooldir` (最终存放可执行文件的目录) 设置为 `$(exec_prefix)/$(target_alias)`。例如,`x86_64`机器会把它扩展为`/usr/x86_64-unknown-linux-gnu`。因为这是个自定制的系统，并不需要 `/usr` 中的特定目标目录。如果系统用于交叉编译（例如，在 Intel 机器上编译能生成在 PowerPC 机器上运行的代码的软件包）会使用 `$(exec_prefix)/$(target_alias)`。

测试
`make -k check`
安装:
`make tooldir=/usr install`

#### GMP-6.1.2
GMP 软件包包含一些数学库。这里有对任意精度数值计算很有用的函数。

如果你是为 32 位的 x86 系统编译，但是你的 CPU 可以运行 64 位代码 而且 环境中你有指定的 `CFLAGS`，那么配置脚本会尝试配置为 64 位并导致失败。用下面的方式执行配置命令来避免这个问题:
`ABI=32 ./configure ...`

The default settings of GMP produce libraries optimized for the host processor. If libraries suitable for processors less capable than the host's CPU are desired,
(库对于处理器的适合度小于宿主的cpu的能力,然后创建通用的库),generic libraries can be created by running the following:
```
cp -v configfsf.guess config.guess
cp -v configfsf.sub   config.sub
```

`--enable-cxx`
这个参数启用 C++ 支持

`--docdir=/usr/share/doc/gmp-6.1.2`
这个变量指定保存文档的正确位置。

Ensure that all 190 tests in the test suite passed.
`awk '/# PASS:/{total+=$3} ; END{print total}' gmp-check-log`

```
./configure --prefix=/usr    \
            --enable-cxx     \
            --disable-static \
            --docdir=/usr/share/doc/gmp-6.1.2
```
#### MPFR-4.0.1
