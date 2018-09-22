### 安装基本系统软件过程(重点过程)
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
编译:
```
./configure --prefix=/usr        \
            --disable-static     \
            --enable-thread-safe \
            --docdir=/usr/share/doc/mpfr-4.0.1
```
#### MPC-1.1.0
编译:
```
./configure --prefix=/usr    \
            --disable-static \
            --docdir=/usr/share/doc/mpc-1.1.0
```
#### GCC-7.3.0
If building on x86_64, change the default directory name for 64-bit libraries to “lib”:
```
case $(uname -m) in
  x86_64)
    sed -e '/m64=/s/lib64/lib/' \
        -i.orig gcc/config/i386/t-linux64
  ;;
esac
```

Remove the symlink created earlier as the final gcc includes will be installed here:
`rm -f /usr/lib/gcc`

编译:
```
SED=sed                               \
../configure --prefix=/usr            \
             --enable-languages=c,c++ \
             --disable-multilib       \
             --disable-bootstrap      \
             --with-system-zlib
```

`SED=sed`
Setting this environment variable prevents a hard-coded path to /tools/bin/sed.

`--with-system-zlib`
This switch tells GCC to link to the system installed copy of the Zlib library, rather than its own internal copy.

One set of tests in the GCC test suite is known to exhaust the stack, so increase the stack size prior to running the tests:
(一个测试会用尽tests,需要扩大栈的容量)
`ulimit -s 32768`
一些意料之外的错误总是难以避免。GCC 开发者通常意识到了这些问题，但还没有解决。除非测试结果和上面 URL 中的相差很大，不然就可以安全继续。

>On some combinations of kernel configuration and AMD processors there may be more than 1100 failures in the gcc.target/i386/mpx tests (which are designed to test the MPX option on recent Intel processors). These can safely be ignored on AMD processors.
我表示震惊....

一些软件包希望 GCC 安装在 /lib 目录。为了支持那些软件包，可以建立一个符号链接：

`ln -sv ../usr/bin/cpp /lib`
译者注：如果还在 gcc-build 目录，这里应该是 `ln -sv ../../usr/bin/cpp /lib` 。
很多软件包用命令 cc 调用 C 编译器。为了满足这些软件包，创建一个符号链接：
`ln -sv gcc /usr/bin/cc`

增加一个兼容符号链接启用编译程序时进行链接时间优化（Link Time Optimization，LTO）：
```
install -v -dm755 /usr/lib/bfd-plugins
ln -sfv ../../libexec/gcc/$(gcc -dumpmachine)/7.3.0/liblto_plugin.so \
        /usr/lib/bfd-plugins/
```
然后进行检验(步骤省略)
最后，移动位置放错的文件：
```
mkdir -pv /usr/share/gdb/auto-load/usr/lib
mv -v /usr/lib/*gdb.py /usr/share/gdb/auto-load/usr/lib
```
#### Bzip2-1.0.6
`Bzip2` 软件包包含压缩和解压缩的程序。用 `bzip2` 压缩文本文件能获得比传统的 `gzip` 更好的压缩比。
使用能为这个软件包安装帮助文档的补丁：
`patch -Np1 -i ../bzip2-1.0.6-install_docs-1.patch`

下面的命令确保安装的符号链接是相对链接：
`sed -i 's@\(ln -s -f \)$(PREFIX)/bin/@\1@' Makefile`

确认 man 页面安装到了正确的位置：
`sed -i "s@(PREFIX)/man@(PREFIX)/share/man@g" Makefile`

编译:
```
make -f Makefile-libbz2_so
make clean
```
`-f Makefile-libbz2_so`
这会使用不同的 Makefile 文件编译 `Bzip2`，在这里是 `Makefile-libbz2_so`，它会创建动态 `libbz2.so` 库，并把它链接到 `Bzip2` 工具。

安装使用动态链接库的 `bzip2` 二进制文件到 `/bin` 目录， 创建一些必须的符号链接并清理：
```
cp -v bzip2-shared /bin/bzip2
cp -av libbz2.so* /lib
ln -sv ../../lib/libbz2.so.1.0 /usr/lib/libbz2.so
rm -v /usr/bin/{bunzip2,bzcat,bzip2}
ln -sv bzip2 /bin/bunzip2
ln -sv bzip2 /bin/bzcat
```
#### Pkg-config-0.29.2
pkg-config 软件包包含一个在配置和 make 文件运行时把 include 路径和库路径传递给编译工具的工具。
```
./configure --prefix=/usr              \
            --with-internal-glib       \
            --disable-host-tool        \
            --docdir=/usr/share/doc/pkg-config-0.29.2
```
`--with-internal-glib`
这会让 pkg-config 使用它自己内部版本的 Glib，因为在 LFS 中没有可用的外部版本。

`--disable-host-tool`
这个选项取消创建到 pkg-config 程序的不必要的硬链接。
#### Ncurses-6.1
Ncurses 软件包包含用于不依赖于特定终端的字符屏幕处理的库。
Don't install a static library that is not handled by configure:
`sed -i '/LIBTOOL_INSTALL/d' c++/Makefile.in`

编译:
```
./configure --prefix=/usr           \
            --mandir=/usr/share/man \
            --with-shared           \
            --without-debug         \
            --without-normal        \
            --enable-pc-files       \
            --enable-widec
```
`--enable-widec`
这个选项会编译宽字符库（例如 libncursesw.so.5.9）而不是常规的）例如 libncurses.so.5.9）。宽字符库可用于多字节和传统的 8 位本地字符， 而常规的库只能用于 8 位本地字符。宽字符库和常规的库是源文件兼容的，而不是二进制文件兼容的。

`--enable-pc-files`
该选项为 pkg-config 生成和安装 .pc 文件。

`--without-normal`
该选项取消生成与安装静态库

Move the shared libraries to the /lib directory, where they are expected to reside(转移库文件):
`mv -v /usr/lib/libncursesw.so.6* /lib`

Because the libraries have been moved, one symlink points to a non-existent file. Recreate it(重新链接库文件):
`ln -sfv ../../lib/$(readlink /usr/lib/libncursesw.so) /usr/lib/libncursesw.so`

很多应用程序仍然希望编辑器能找到非宽字符的 Ncurses 库。通过符号链接和链接器脚本欺骗这样的应用链接到宽字符库：
```
for lib in ncurses form panel menu ; do
    rm -vf                    /usr/lib/lib${lib}.so
    echo "INPUT(-l${lib}w)" > /usr/lib/lib${lib}.so
    ln -sfv ${lib}w.pc        /usr/lib/pkgconfig/${lib}.pc
done
```
最后，确保在编译时会查找 -lcurses 的旧应用程序仍然可以编译：

```
rm -vf                     /usr/lib/libcursesw.so
echo "INPUT(-lncursesw)" > /usr/lib/libcursesw.so
ln -sfv libncurses.so      /usr/lib/libcurses.so
```
**注意**
上面的指令并**不会创建**非宽字符 `Ncurses` 库，因为_没有从源文件中编译安装的软件包会在运行时链接它们_。如果你由于一些仅有二进制的应用程序或要和 `LSB` 兼容而必须要有这样的库，用下面的命令重新编译软件包：
```
make distclean
./configure --prefix=/usr    \
            --with-shared    \
            --without-normal \
            --without-debug  \
            --without-cxx-binding \
            --with-abi-version=5
make sources libs
cp -av lib/lib*.so.5* /usr/lib
```
#### Attr-2.4.47
attr 软件包包含管理文件系统对象的扩展属性的工具。
Modify the documentation directory so that it is a versioned directory:
`sed -i -e 's|/@pkg_name@|&-@pkg_version@|' include/builddefs.in`

Prevent installation of manual pages that were already installed by the man pages package:
`sed -i -e "/SUBDIRS/s|man[25]||g" man/Makefile`

Fix a problem in the test procedures caused by changes in perl-5.26:
(修复问题)
`sed -i 's:{(:\\{(:' test/run`

```
./configure --prefix=/usr \
            --bindir=/bin \
            --disable-static
```

The shared library needs to be moved to /lib, and as a result the .so file in /usr/lib will need to be recreated:
`mv -v /usr/lib/libattr.so.* /lib`
`ln -sfv ../../lib/$(readlink /usr/lib/libattr.so) /usr/lib/libattr.so`

#### Acl-2.2.52

Modify the documentation directory so that it is a versioned directory:

`sed -i -e 's|/@pkg_name@|&-@pkg_version@|' include/builddefs.in`
Fix some broken tests:

`sed -i "s:| sed.*::g" test/{sbits-restore,cp,misc}.test`
Fix a problem in the test procedures caused by changes in perl-5.26:

`sed -i 's/{(/\\{(/' test/run`
Additionally, fix a bug that causes getfacl -e to segfault on overly long group name:
```
sed -i -e "/TABS-1;/a if (x > (TABS-1)) x = (TABS-1);" \
    libacl/__acl_to_any_text.c
    ```
Prepare Acl for compilation:
```
./configure --prefix=/usr    \
            --bindir=/bin    \
            --disable-static \
            --libexecdir=/usr/lib
```
#### Libcap-2.25
Libcap 软件包实现了可用在 Linux 内核上的对 POSIX 1003.1e 功能的用户空间接口。 这些功能将所有强大 root 权限划分为不同的权限组合。
Install the package:
```
make RAISE_SETFCAP=no lib=lib prefix=/usr install
chmod -v 755 /usr/lib/libcap.so
```
The meaning of the make option:
`RAISE_SETFCAP=no`
This parameter skips trying to use setcap on itself. This avoids an installation error if the kernel or file system does not support extended capabilities.

`lib=lib`
This parameter installs the library in `$prefix/lib` rather than `$prefix/lib64` on `x86_64`. It has no effect on`x86`.

#### Sed-4.4
The Sed package contains a stream editor.
First fix an issue in the LFS environment and remove a failing test:
`sed -i 's/usr/tools/'                 build-aux/help2man`
`sed -i 's/testsuite.panic-tests.sh//' Makefile.in`

Prepare Sed for compilation:
`./configure --prefix=/usr --bindir=/bin`

#### Shadow-4.5
Shadow 软件包包含以安全方式处理密码的程序。
**注意**
如果你喜欢强制使用更强的密码，在编译 Shadow 之前可以根据 http://www.linuxfromscratch.org/blfs/view/systemd/postlfs/cracklib.html 安装 `CrackLib`。然后在下面的 configure 命令中增加 `--with-libcrack`。

取消安装 `groups` 程序以及它的 `man` 文档，因为 Coreutils 提供了一个更好的版本：
```
sed -i 's/groups$(EXEEXT) //' src/Makefile.in
find man -name Makefile.in -exec sed -i 's/groups\.1 / /'   {} \;
find man -name Makefile.in -exec sed -i 's/getspnam\.3 / /' {} \;
find man -name Makefile.in -exec sed -i 's/passwd\.5 / /'   {} \;
```

比起默认的 crypt 方法，用更安全的 SHA-512 方法加密密码，它允许密码长度超过 8 个字符。也需要把 Shadow 默认使用的用户邮箱由陈旧的 /var/spool/mail 位置改为正在使用的 /var/mail 位置
```
sed -i -e 's@#ENCRYPT_METHOD DES@ENCRYPT_METHOD SHA512@' \
         -e 's@/var/spool/mail@/var/mail@' etc/login.defs
```
**Note**
如果你选择编译支持 Cracklib 的 Shadow，运行下面的命令：
`sed -i 's@DICTPATH.*@DICTPATH\t/lib/cracklib/pw_dict@' etc/login.defs`

做个小的改动使 useradd 的默认设置和 LFS 的组文件一致：
`sed -i 's/1000/999/' etc/useradd`

Prepare Shadow for compilation:
`./configure --sysconfdir=/etc --with-group-name-max-length=32`

The meaning of the configure option:
`--with-group-name-max-length=32`
最长用户名为 32 个字符，使组名称也是如此

##### Configuring Shadow
该软件包包含增加、更改、以及删除用户和组的工具；设置和修改密码；执行其它特权级任务。软件包解压后的 `doc/HOWTO` 文件有关于 `password` `shadowing` 的完整解释。如果使用 `Shadow` 支持，记住需要验证密码（显示管理器、FTP 程序、pop3 守护进程等）的程序必须和 `Shadow` 兼容。 也就是说，它们要能使用 Shadow 加密的密码。

运行下面的命令启用 shadow 密码；
`pwconv`

运行下面的命令启用 shadow 组密码：
`grpconv`

用于 useradd 工具的 Shadow 配置有一些需要解释的注意事项。首先，useradd 工具的默认操作是创建用户以及和用户名相同的组。默认情况下，用户 ID(UID) 和组 ID(GID) 的数字从 1000 开始。这意味着如果你不传递参数给 useradd，系统中的每个用户都会属于一个不同的组。如果不需要这样的结果，你需要传递参数 -g 到 useradd。默认参数保存在 /etc/default/useradd 文件中。你需要修改该文件中的两个参数来实现你的特定需求。

`/etc/default/useradd` 参数解释

`GROUP=1000`
该参数设定 /etc/group 文件中使用的起始组序号。你可以把它更改为任何你需要的数字。注意 useradd 永远不会重用 UID 或 GID。如果该参数指定的数字已经被使用了，将会使用它之后的下一个可用数字。另外注意如果你系统中没有序号为 1000 的组，第一次使用useradd 而没有参数 -g 的话，你会在终端中看到一个提示信息： useradd: unknown GID 1000。你可以忽视这个信息，它会使用组号 1000。

`CREATE_MAIL_SPOOL=yes`
这个参数会为 useradd 新添加的用户创建邮箱文件。useradd 会使组 mail 拥有该文件的所有权，并赋予组 0660 的权限。如果你希望 useradd 不创建这些邮箱文件，你可以运行下面的命令：
`sed -i 's/yes/no/' /etc/default/useradd`

##### 设置 root 密码
运行下面的命令为用户 root 设置密码：
`passwd root`

#### (由于构建文档太长,此篇到此结束,还有50多个工具的编译过程没有记录,主要还是要看构建文档)
