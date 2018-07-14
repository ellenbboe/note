### 编译临时工具软件包过程
说明:主要列出重要信息(来自官方),切忌不要按照本文编译
我只是把它们列出来加深理解,还有一些配置我没有列出
包括make与make install

#### Binutils-2.25 - Pass 1
Binutils 软件包包括了一个**链接器**、**汇编器** 和 **其它处理目标文件** 的工具。

```
../binutils-2.25/configure     \
    --prefix=/tools            \
    --with-sysroot=$LFS        \
    --with-lib-path=/tools/lib \
    --target=$LFS_TGT          \
    --disable-nls              \
    --disable-werror
```

配置选项的含义：

`--prefix=/tools`
>告诉配置脚本将 Binutils 程序安装到 /tools 文件夹。

`--with-sysroot=$LFS`
>用于交叉编译，告诉编译系统在 $LFS 中查找所需的目标系统库。

`--with-lib-path=/tools/lib`
>指定需要配置使用的**链接器**的库路径。

`--target=$LFS_TGT` (这个还不是很清楚)
>因为 LFS_TGT 变量中的机器描述和 config.guess 脚本返回的值略有不同，这个选项会告诉 configure 脚本调整 Binutils 的编译系统来编译一个交叉链接器。

`--disable-nls`
>这会禁止国际化（i18n），因为国际化对临时工具来说没有必要。

`--disable-werror`
>这会防止来自宿主编译器的警告事件导致停止编译。

#### GCC-7.3.0 - Pass 1
GCC 软件包是 **GNU 编译器** 集合的一部分，其中包括 C 和 C++ 的编译器。

下面的指令将会修改 GCC 默认的**动态链接器**为安装在 `/tools` 文件夹中的。它也会从 GCC 的 include 搜索路径中移除 `/usr/include`


```
for file in \
 $(find gcc/config -name linux64.h -o -name linux.h -o -name sysv4.h)
do
  cp -uv $file{,.orig}
  sed -e 's@/lib\(64\)\?\(32\)\?/ld@/tools&@g' \
      -e 's@/usr@/tools@g' $file.orig > $file
  echo '
#undef STANDARD_STARTFILE_PREFIX_1
#undef STANDARD_STARTFILE_PREFIX_2
#define STANDARD_STARTFILE_PREFIX_1 "/tools/lib/"
#define STANDARD_STARTFILE_PREFIX_2 ""' >> $file
  touch $file.orig
done
```

>如果上面的看起来难以理解，让我们分开来看一下吧。首先我们找到 gcc/config 文件夹下的所有命名为 `linux.h`, `linux64.h` 或`sysv4.h` 的文件。对于找到的每个文件，我们把它复制到相同名称的文件，但增加了后缀 “`.orig`”。然后第一个 sed 表达式在每个 “`/lib/ld`”, “`/lib64/ld`” 或 “`/lib32/ld`” 实例前面增加“`/tools`”，第二个 sed 表达式替换 “`/usr`” 的硬编码实例。然后，我们添加这改变默认 `startfile` 前缀到文件末尾的定义语句。注意 “`/tools/lib/`” 后面的 “`/`” 是必须的。最后，我们用 `touch` 更新复制文件的时间戳。当与 `cp -u` 一起使用时，可以防止命令被无意中运行两次造成对原始文件意外的更改。(厉害厉害)

8.2版本中不用以下命令(可能修复了这个错误):
```
GCC 不能正确检测栈保护，这会导致编译 Glibc-2.21 时出现问题，用下面的命令修复这个问题：
sed -i '/k prot/agcc_cv_libc_provides_ssp=yes' gcc/configure
```
**准备编译 GCC:**
```
../gcc-4.9.2/configure                             \
    --target=$LFS_TGT                              \
    --prefix=/tools                                \
    --with-sysroot=$LFS                            \
    --with-newlib                                  \
    --without-headers                              \
    --with-local-prefix=/tools                     \
    --with-native-system-header-dir=/tools/include \
    --disable-nls                                  \
    --disable-shared                               \
    --disable-multilib                             \
    --disable-decimal-float                        \
    --disable-threads                              \
    --disable-libatomic                            \
    --disable-libgomp                              \
    --disable-libitm                               \
    --disable-libquadmath                          \
    --disable-libsanitizer                         \
    --disable-libssp                               \
    --disable-libvtv                               \
    --disable-libcilkrts                           \
    --disable-libstdc++-v3                         \
    --enable-languages=c,c++
```

`--with-newlib`
由于**还没有可用的 C 库**，这确保编译 `libgcc` 时定义了常数 inhibit_libc。这可以防止编译任何需要 libc 支持的代码。

`--without-headers`
创建一个完成的交叉编译器的时候，GCC 要求标准头文件和目标系统兼容。对于我们的目的来说，不需要这些头文件。这个选项可以防止 GCC 查找它们。

`--with-local-prefix=/tools`
GCC 会查找本地已安装的 include 文件的系统位置。默认是 /usr/local。把它设置为 /tools 能把主机位置中的 /usr/local 从 GCC 的搜索路径中排除。

`--with-native-system-header-dir=/tools/include`
GCC 默认会在/usr/include 中查找系统头文件。和 sysroot 选项一起使用，会转换为 $LFS/usr/include。在后面两个章节中头文件会被安装到 $LFS/tools/include。这个选项确保 gcc 能正确找到它们。第二次编译 GCC 时，**同样的选项可以保证不会去寻找主机系统的头文件。**

`--disable-shared`
这个选项强制 GCC 静态链接到它的内部库。我们这样做是_为了避免与主机系统可能出现的问题。_

`--disable-decimal-float`, `--disable-threads`, `--disable-libatomic`, `--disable-libgomp`, `--disable-libitm`, `--disable-libquadmath`, `--disable-libsanitizer`, `--disable-libssp`, `--disable-libvtv`, `--disable-libcilkrts`, `--disable-libstdc++-v3`
这些选项取消了对十进制浮点数扩展、线程化、libatomic、 libgomp、 libitm、 libquadmath、 libsanitizer、 libssp、 libvtv、 libcilkrts 和 C++ 标准库的支持。这些功能在编译交叉编译器的时候会导致编译失败，对于交叉编译 临时 libc 来说也没有必要。

--disable-multilib
在 x86_64 机器上， LFS 还不支持 multilib 配置。这个选项对 x86 来说无害。

--enable-languages=c,c++
这个选项确保只编译 C 和 C++ 编译器。这些是现在唯一需要的语言。



#### Linux-4.15.3 API Headers

供系统 C 库（在 LFS 中是 Glibc）使用的应用程序编程接口（API）

#### Glibc-2.27
Glibc 软件包包括主要的 C 库。这个库提供了基本的**内存分配**、**文件夹搜素**、**读写文件**、**字符串处理**、**模式匹配**、**算术** 等等例程。

编译:
```
../glibc-2.21/configure                             \
      --prefix=/tools                               \
      --host=$LFS_TGT                               \
      --build=$(../glibc-2.21/scripts/config.guess) \
      --disable-profile                             \
      --enable-kernel=2.6.32                        \
      --with-headers=/tools/include                 \
      libc_cv_forced_unwind=yes                     \
      libc_cv_ctors_header=yes                      \
      libc_cv_c_cleanup=yes
```

`--host=$LFS_TGT, --build=$(../glibc-2.21/scripts/config.guess)`
这些选项的组合效果是 Glibc 的构建系统配置它自己用 /tools 里面的交叉链接器和交叉编译器交叉编译自己。

`--disable-profile`
编译库但不包含分析信息。如果临时工具需要分析信息则忽略此选项。

`--enable-kernel=3.2`
这告诉 Glibc 编译能支持 Linux 3.2 以及之后的内核库。更早的内核版本不受支持。

`--with-headers=/tools/include`
告诉 Glibc 利用刚刚安装在 tools 文件夹中的头文件编译自身，此能够根据内核的具体特性提供更好的优化。

`libc_cv_forced_unwind=yes`
在 “Binutils-2.25 - Pass 1” 中安装的链接器是交叉编译的，在安装完 Glibc 之前不能使用。由于依赖于工作的链接器，这意味着 force-unwind 支持的配置测试会失败。将 libccvforced_unwind=yes 变量传递进去告诉configure 命令 force-unwind 支持是可用的，不需要进行测试。

`libc_cv_c_cleanup=yes`
类似的，我们传递 libc_cv_c_cleanup=yes 到 configure 脚本_跳过测试_就完成了 C 清理支持的配置。

`libc_cv_ctors_header=yes`
类似的，我们传递 libc_cv_ctors_header=yes 到 configure 脚本_跳过测试_就完成了 gcc 构建器支持的配置。


#### Libstdc++-7.3.0
Libstdc++ 是标准的 C++ 库。g++ 编译器正确运行需要它。Libstdc++ 是标准的 C++ 库。g++ 编译器正确运行需要它。

编译:
```
../gcc-4.9.2/libstdc++-v3/configure \
    --host=$LFS_TGT                 \
    --prefix=/tools                 \
    --disable-multilib              \
    --disable-shared                \
    --disable-nls                   \
    --disable-libstdcxx-threads     \
    --disable-libstdcxx-pch         \
    --with-gxx-include-dir=/tools/$LFS_TGT/include/c++/4.9.2
```

--host=...
指示使用我们刚才编译的交叉编译器，而不是 /usr/bin 中的。

--disable-libstdcxx-threads
由于我们还没有编译 C 线程库，C++ 的也还不能编译。

--disable-libstdcxx-pch
此选项防止安装预编译文件，此步骤并不需要。

--with-gxx-include-dir=/tools/$LFS_TGT/include/c++/7.3.0
这是 C++ 编译器搜索标准 _include_ 文件的位置。在**一般的编译**中，这个信息自动从顶层文件夹中传入 Libstdc++ configure 选项。_在我们的例子中，必须明确给出这信息。_

#### Binutils-2.30 - Pass 2

编译:
```
CC=$LFS_TGT-gcc                \
AR=$LFS_TGT-ar                 \
RANLIB=$LFS_TGT-ranlib         \
../binutils-2.25/configure     \
    --prefix=/tools            \
    --disable-nls              \
    --disable-werror           \
    --with-lib-path=/tools/lib \
    --with-sysroot

```

`CC=$LFS_TGT-gcc AR=$LFS_TGT-ar RANLIB=$LFS_TGT-ranlib`
因为这是真正的原生编译 Binutils，设置这些变量能_确保编译系统使用交叉编译器和相关的工具_，而不是宿主系统中已有的。

`--with-lib-path=/tools/lib`
这告诉配置脚本在编译 Binutils 的时候指定库搜索目录，此处将 /tools/lib 传递到链接器。这可以_防止链接器搜索宿主系统的库目录_。

`--with-sysroot`
sysroot 功能_使链接器可以找到包括在其命令行中的其它共享对象明确需要的共享对象_。 否则的话，在某些主机上一些软件包可能会编译不成功。(....未理解)

为下一章的“再调整”阶段准备链接器：
```
make -C ld clean
make -C ld LIB_PATH=/usr/lib:/lib
cp -v ld/ld-new /tools/bin
```

`-C ld clean`
告诉 make 程序移除所有 ld 子目录中编译过的文件。

`-C ld LIB_PATH=/usr/lib:/lib`
这个选项重新编译 ld 子目录中的所有文件。在命令行中指定 Makefile 的 LIB_PATH 变量可以使我们能够重写临时工具的默认值并指向正确的最终路径。该变量的值指定链接器的默认库搜索路径。 下一章中会用到这个准备。

#### GCC-7.3.0 - Pass 2
我们第一次编译 GCC 的时候安装了一些内部系统头文件。其中的一个 `limits.h` 会反过来包括对应的系统头文件 `limits.h`， 在我们的例子中，是 `/tools/include/limits.h`。但是，第一次编译 gcc 的时候 `/tools/include/limits.h` **并不存在**，因此 GCC 安装的内部头文件只是部分的自包含文件， 并不包括系统头文件的扩展功能。这足以编译临时 libc，但是这次编译 GCC 要求完整的内部头文件。 使用和正常情况下 GCC 编译系统使用的相同的命令创建一个_完整版本_的内部头文件：

```
cat gcc/limitx.h gcc/glimits.h gcc/limity.h > \
  `dirname $($LFS_TGT-gcc -print-libgcc-file-name)`/include-fixed/limits.h
```


准备编译 GCC:
```
CC=$LFS_TGT-gcc                                    \
CXX=$LFS_TGT-g++                                   \
AR=$LFS_TGT-ar                                     \
RANLIB=$LFS_TGT-ranlib                             \
../gcc-4.9.2/configure                             \
    --prefix=/tools                                \
    --with-local-prefix=/tools                     \
    --with-native-system-header-dir=/tools/include \
    --enable-languages=c,c++                       \
    --disable-libstdcxx-pch                        \
    --disable-multilib                             \
    --disable-bootstrap                            \
    --disable-libgomp
```

`--enable-languages=c,c++`
这个选项确保编译了 C 和 C++ 编译器。

`--disable-libstdcxx-pch`
不为 `libstdc++` 编译预编译的头文件(PCH)。_这会花费很多时间，却对我们没有用处。_

`--disable-bootstrap`
对于原生编译的 GCC，默认是做一个**“引导”构建**。这不仅会编译 GCC，而且会_多次编译_。 它用第一次编译的程序去第二次编译自己，然后同样进行第三次。 比较第二次和第三次迭代确保它可以完美复制自身。这也意味着已经成功编译。 _但是，LFS 的构建方法能够提供一个稳定的编译器，而不需要每次都重新引导。_

#### Tcl-core-8.6.8
Tcl软件包包含工具命令语言（Tool Command Language）相关程序。

此软件包和后面三个包（`Expect`、`DejaGNU` 和 `Check`）用来为 `GCC` 和 `Binutils `还有其他的一些软件包的测试套件_提供运行支持_。仅仅为了测试目的而安装 4 个软件包，看上去有点奢侈，虽然因为大部分重要的工具都能正常工作而并不需要去做测试。 尽管在本章中并没有执行测试套件（并不做要求），但是在第六章 中都要求执行这些软件包自带的测试套件。
_不强求为本章中所构建的临时工具运行测试套件。_


#### Expect-5.45
Expect 软件包包含一个实现用脚本和其他交互式程序进行对话的程序。

首先，强制 `Expect` 的 `configure` 配置脚本使用 `/bin/stty` 替代宿主机系统里可能存在的 `/usr/local/bin/stty`。这样可以保证我们的测试套件工具在工具链的最后一次构建能够正常。
```
cp -v configure{,.orig}
sed 's:/usr/local/bin:/bin:' configure.orig > configure
```

编译:
```
./configure --prefix=/tools       \
            --with-tcl=/tools/lib \
            --with-tclinclude=/tools/include
```
`--with-tcl=/tools/lib`
这个选项可以保证 `configure` 配置脚本会从临时工具目录里找 `Tcl` 的安装位置， 而不是在宿主机系统中寻找。

`--with-tclinclude=/tools/include`
这个选项会给 `Expect` 显式地指定 `Tcl` 内部头文件的位置。通过这个选项可以避免 `configure` 脚本不能自动发现 `Tcl` 头文件位置的情况。

#### DejaGNU-1.6.1
`./configure --prefix=/tools
`
#### M4-1.4.18
M4 软件包包含一个宏预处理器。
`./configure --prefix=/tools
`
#### Ncurses-6.1
```
./configure --prefix=/tools \
            --with-shared   \
            --without-debug \
            --without-ada   \
            --enable-widec  \
            --enable-overwrite
```

`--without-ada`
这个选项会保证 `Ncurse` 不会编译对宿主机系统里可能存在的 Ada 编译器的支持， _而这在我们 chroot 切换环境后就不再可用_。

`--enable-overwrite`
这个选项会告诉 `Ncurses` 安装它的头文件到 `/tools/include` 目录， 而不是 `/tools/include/ncurses` 目录， 保证其他软件包可以正常找到 `Ncurses` 的头文件。

`--enable-widec`
这个选项会控制编译`宽字符库`（比如，libncursesw.so.5.9） 而不是`默认的普通库`（比如，libncurses.so.5.9）。 这些宽字符库在多字节和传统的 8 位环境下使用，而普通库只能用于 8 位环境。 宽字符库和普通库的源代码是兼容的，但并不是二进制兼容。

#### Bash-4.4.18
Bash 软件包包含 Bourne-Again SHell 终端程序
编译:
```
./configure --prefix=/tools --without-bash-malloc
```

`--without-bash-malloc
`这个选项会禁用 Bash 的内存分配功能（malloc）， 这个功能已知会导致段错误。而禁用这个功能后，Bash 将使用 Glibc 的 malloc 函数，这样会更稳定。

#### Bison-3.0.4
The Bison package contains a parser generator.(解析器生成器)

#### Bzip2-1.0.6
Bzip2 软件包包含压缩和解压文件的工具。 用 bzip2 压缩文本文件比传统的 gzip 压缩比高得多。
#### Coreutils-8.29
Coreutils 软件包包含一套用于显示和设定基本系统属性的工具。
```
./configure --prefix=/tools --enable-install-program=hostname
--enable-install-program=hostname
```
这个选项会允许编译和安装 hostname 程序 – 默认是不安装的但是 Perl 测试套件需要它。
#### Diffutils-3.6
Diffutils软件包包含用来比较文件或目录之间差异的工具。
#### File-5.32
File 软件包包含用来判断文件类型的工具。
#### Findutils-4.6.0
Findutils 软件包包含用来查找文件的工具。这些工具可以用来在目录树中递归查找，或者创建、维护和搜索数据库（一般会比递归查找快，但是如果不经常更新数据库的话结果不可靠）。
#### Gawk-4.2.0
Gawk 软件包包含处理文本文件的工具。
#### Gettext-0.19.8.1
Gettext 软件包包含了国际化和本地化的相关应用。它支持程序使用 NLS（本地语言支持）编译，允许程序用用户本地语言输出信息。
```
cd gettext-tools
EMACS="no" ./configure --prefix=/tools --disable-shared
```

`EMACS="no"`
这个选项会禁止配置脚本侦测安装 Emacs Lisp 文件的位置，已知在某些系统中会引起错误。

`--disable-shared`
这次我们不需要安装任何的 Gettext 动态库，所以不需要编译。

#### Grep-3.1
Grep 软件包包含了在文件中搜索的工具。
#### Gzip-1.9
Gzip 软件包包含压缩和解压缩文件的工具。
#### Make-4.2.1
Make 软件包包含了一个用来编译软件包的程序。
```
./configure --prefix=/tools --without-guile
--without-guile
```
这个选项会保证 Make 不会链接宿主系统上可能存在的 Guile 库，而在下一章里通过 chroot 切换环境后就不再可用

#### Patch-2.7.6
Patch 软件包包含一个可以通过应用“补丁”文件来修改或创建文件的程序，补丁文件通常由diff程序生成。
#### Perl-5.26.1
Perl 软件包包含了处理实用报表提取语言（Practical Extraction and Report Language）的程序。
#### Sed-4.4
Sed 软件包包含一个字符流编辑器。
#### Tar-1.30
Tar 软件包包含了一个存档工具。
#### Texinfo-6.5
Texinfo软件包包含了读写和转换info文档的工具。
#### Util-linux-2.31.1
Util-linux 软件包包含了各种各样的小工具。
```
./configure --prefix=/tools                \
            --without-python               \
            --disable-makeinstall-chown    \
            --without-systemdsystemunitdir \
            PKG_CONFIG=""
```
`--without-python`
这个选项会禁止使用宿主系统中可能安装了的 Python。这样可以避免构建一些不必要的捆绑应用。

`--disable-makeinstall-chown`
这个选项会禁止在安装的时候使用 chown 命令。这对我们安装到 /tools 目录没有意义而且可以避免使用 root 用户安装。

`--without-systemdsystemunitdir`
对于使用 systemd 的系统，这个软件包会尝试安装 systemd 特定文件到 /tools 下一个不存在的目录里。这个选项可以避免这个不必要的动作。

`PKG_CONFIG=""`
设定这个环境变量可以避免增加一些宿主机上存在却不必要的功能。请注意这里设定环境变量的方式和 LFS 其他部分放在命令前面的方式不同。_在这里是为了展示一下使用 configure 脚本配置时设定环境变量的另一种方式。_

#### Xz-5.2.3
Xz 软件包包含了用于压缩和解压文件的程序。它提供了对 lzma 和更新的 xz 压缩格式的支持。使用 xz 压缩文本文件能比传统的 gzip 或 bzip2 命令有更高的压缩比。

#### 提醒
$LFS/tools 目录可以在 LFS 系统构建完成后删除，但仍然可以保留下来用于构建额外的相同版本 LFS 系统。备份 $LFS/tools 目录到底有多少好处取决于你个人
_如果你想保留临时工具用来构建新的 LFS 系统，现在就要备份好。本书随后第六章中的指令将对当前的工具做些调整，导致在构建新系统时会失效_

**到此,准备工作完成**
