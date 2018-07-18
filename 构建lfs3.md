### 安装基本的系统软件
注意使用root用户

#### 准备虚拟内核文件系统

内核会挂载几个文件系统用于自己和用户空间程序交换信息。这些文件系统是虚拟的，并不占用实际磁盘空间，它们的内容会放在内存里。

开始先创建将用来挂载文件系统的目录：

`mkdir -pv $LFS/{dev,proc,sys,run}`

#### 创建初始设备节点
在内核引导系统的时候，它依赖于几个设备节点，特别是 `console` 和 `null` 两个设备。这些设备节点需要创建在硬盘上，这样在 `udevd` 启动之前它们也仍然有效，特别是在 Linux 使用`init=/bin/bash` 参数启动的时候。运行下面的命令创建这几个设备节点：

`mknod -m 600 $LFS/dev/console c 5 1`
`mknod -m 666 $LFS/dev/null c 1 3`
**注**: mknod创建设备文件 -m设置权限
#### 挂载和激活 /dev
通常激活 `/dev` 目录下设备的方式是在 `/dev`目录挂载一个虚拟文件系统（比如 `tmpfs`），然后允许在检测到设备或打开设备时在这个虚拟文件系统里**动态**创建设备节点。这个通常是在启动过程中由 `Udev` 完成。由于我们的新系统还没有 `Udev` 而且也_没有被引导启动_，_有必要手动挂载和激活_ `/dev` 目录。这可以通过绑定挂载宿主机系统的 `/dev` 目录实现。绑定挂载是一种特殊的挂载模式，它允许在另外的位置创建某个目录或挂载点的镜像。运行下面的命令来实现：

`mount -v --bind /dev $LFS/dev`

#### 挂载虚拟文件系统
现在挂载剩下的虚拟内核文件系统：
```
mount -vt devpts devpts $LFS/dev/pts -o gid=5,mode=620
mount -vt proc proc $LFS/proc
mount -vt sysfs sysfs $LFS/sys
mount -vt tmpfs tmpfs $LFS/run
```
**注**:`mount [-fnrsvw] [-t vfstype] [-o options] device dir`

`gid=5`
这个选项会让 `devpts` 创建的**所有设备节点属主**的组 ID 都是 5。这是我们待会将要指定给 `tty` 组的 `ID`。现在我们先用 `ID `代替组名，因为宿主机系统可能会为它的 `tty` 组分配了不同的 `ID`。

`mode=0620`
这个选项会让 `devpts` 创建的**所有设备节点的属性**是 `0620`（属主用户可读写，组成员可写）。和上一个选项同时使用，可以保证 `devpts` 所创建的设备节点能满足 `grantpt()` 函数的要求，这意味着不需要 `Glibc` 的 `pt_chown` 帮助程序（默认没有安装）了。

在某些宿主机系统里，`/dev/shm` 是一个指向 `/run/shm` 的软链接。这个 `/run` 下的 `tmpfs` 文件系统已经在之前挂载了，所以在这里只需要创建一个目录。
```
if [ -h $LFS/dev/shm ]; then
  mkdir -pv $LFS/$(readlink $LFS/dev/shm)
fi
```
#### 升级问题
软件包管理器可以在软件新版本发布后轻松升级。一般来说 LFS 和 BLFS 手册里的指令可以用来升级到新版本。下面是一些在你准备升级软件包时需要注意的事情，特别是在一个运行中的系统。

1.如果需要升级 Glibc 到新版本（比如，从 glibc-2.19 升级到 glibc-2.20），重新构建整个 LFS 会比较安全。虽然你也许能够按依赖关系重新编译所有的软件包，不过我们不建议这样做。

2.如果某个包含的动态库的软件包升级了，而且库名字有改变，那么所有动态链接到这个库的软件包都需要重新链接新的库。（请注意软件包版本和库名字并不存在相关性。）举个例子，某个软件包 foo-1.2.3 安装了一个名叫 libfoo.so.1 的动态库。然后假设你把这个软件包升级到了新版本 foo-1.2.4，而新版本会安装名叫 libfoo.so.2的动态库。在这种情况下，所有动态链接到 libfoo.so.1 的软件包都需要重新编译链接到 libfoo.so.2。注意在所有依赖软件包重新编译完成之前，请不要删除旧版的库文件。
##### 创建软件包存档
在这种方式里，像之前的软链接软件包管理方式里所描述的那样，软件包被伪装安装到一个独立的目录树里。在安装完成后，会将已安装文件打包成一个软件包存档。然后这个存档会用来在本地机器或其他机器上安装软件包。

这种方式为商业发行版中的大多数包管理器所采用。一些例子是 RPM（它顺便也是 Linux 标准规范 里所要求的）、pkg-utils、Debian 的 apt、以及 Gentoo 的 Portage 系统。该页面描述了如何在 LFS 系统里采用这种包管理方式： http://www.linuxfromscratch.org/hints/downloads/files/fakeroot.txt。

创建带有依赖关系的软件包存档非常复杂，已经超出 LFS 手册范围了。

##### 基于用户的软件包管理
在这种方式，是 LFS 特有的，由 Matthias Benkmann 所设计，可以在 Hints Project 里能找到。在这种方式里，每个软件包都由一个单独的用户安装到标准的位置。属于某个软件包的文件可以通过检查**用户 ID** 轻松识别出来。关于这种方式的特性和短处非常复杂，在本节里说不清楚。详细的信息请参看 http://www.linuxfromscratch.org/hints/downloads/files/more_control_and_pkg_man.txt。

##### 在多个系统上布置 LFS
LFS 系统的一个优点是没有会依赖磁盘系统里文件位置的文件。克隆一份 LFS 到和宿主机器相似配置的机器上，简单到只要对包含根目录的 LFS 分区（对于一个基本的 LFS 构建不压缩的话大概有 250MB）使用 tar命令打包，然后通过网络传输或光盘拷贝到新机器上展开即可。在这之后，还需要调整一些配置文件，包括：/etc/hosts、/etc/fstab、/etc/passwd、/etc/group、/etc/shadow 和 /etc/ld.so.conf。
根据系统硬件和原始内核配置文件的差异，可能还需要重新编译一下内核。
最后，需要使用 8.4 “用 GRUB 设置引导过程”里所介绍的方法让新系统可引导

#### 进入 Chroot 环境
```
chroot "$LFS" /tools/bin/env -i \
    HOME=/root                  \
    TERM="$TERM"                \
    PS1='\u:\w\$ '              \
    PATH=/bin:/usr/bin:/sbin:/usr/sbin:/tools/bin \
    /tools/bin/bash --login +h(选项来关闭其哈希功能)
    ```
给 `env` 命令传递 `-i` 选项会清除这个 `chroot` 切换进去的**环境里所有变量**。随后，只重新设定了 `HOME`、`TERM`、`PS1` 和 `PATH` 变量。`TERM=$TERM` 语句会设定 `chroot` 进入的环境里的 `TERM` 变量**为进入前该变量同样的值**。许多程序需要这个变量才能正常工作，比如 `vim` 和 `less`。如果还需要设定其他变量，比如 CFLAGS 或 CXXFLAGS，就在这里一起设定比较合适。

从这里以后，就不再需要 `LFS` 变量了，因为后面所有工作都将被限定在 LFS 文件系统里。这是因为我们已经告诉 Bash 终端 $LFS 就是当前的根目录（/）。

请注意 `/tools/bin` 放在了 `PATH` 变量的最后。意思是在每个软件的最后版本编译安装好后就不再使用临时工具了。这还需要让 `shell` 不要“记住”每个可执行文件的位置—这样的话，还要给 `bash` 加上 `+h` 选项来关闭其哈希功能。

注意一下 `bash` 的提示符是 `I have no name!`。这是正常的，因为这个时候 `/etc/passwd `文件还没有被创建。

**注意:**
非常重要，本章从这以后的命令，以及后续章节里的命令都要在 chroot 环境下运行。如果因为某种原因（比如说重启）离开了这个环境，请保证要按照 **“挂载和激活 /dev”** 和 **“挂载虚拟内核文件系统”** 里所说的那样挂载虚拟内核文件系统，然后在继续构建之前重新运行 chroot 进入环境。

创建目录
```
mkdir -pv /{bin,boot,etc/{opt,sysconfig},home,lib/firmware,mnt,opt}
mkdir -pv /{media/{floppy,cdrom},sbin,srv,var}
install -dv -m 0750 /root
install -dv -m 1777 /tmp /var/tmp
mkdir -pv /usr/{,local/}{bin,include,lib,sbin,src}
mkdir -pv /usr/{,local/}share/{color,dict,doc,info,locale,man}
mkdir -v  /usr/{,local/}share/{misc,terminfo,zoneinfo}
mkdir -v  /usr/libexec
mkdir -pv /usr/{,local/}share/man/man{1..8}

case $(uname -m) in
 x86_64) mkdir -v /lib64 ;;
esac

mkdir -v /var/{log,mail,spool}
ln -sv /run /var/run
ln -sv /run/lock /var/lock
mkdir -pv /var/{opt,cache,lib/{color,misc,locate},local}
```

一般目录默认会按 `755` 的权限创建，但是这并不适用于所有的目录。在上面的命令里，有两个改动—一个是 `root` 用户的主目录，另一个是存放临时文件的目录。

第一个模式改动能保证不是所有人都能进入 `/root`目录—同样的一般用户也需要为他/她的主目录设置这样的模式。第二个模式改动能保证所有用户都可以写目录 `/tmp` 和 `/var/tmp`。还增加了一个所谓的 “粘滞位”的限制，即位掩码 `0x1777` 中最高位的比特(1)。

#### 关于 FHS 兼容性
这个目录树是基于文件系统目录结构标准（FHS）（参看 https://wiki.linuxfoundation.org/en/FHS) ,FHS 标准还规定了要有 /usr/local/games 和 /usr/share/games 目录。另外 FHS 标准关于/usr/local/share 里子目录的结构要求并不清晰，所以我们只创建了我们需要的目录。不过，如果你更喜欢严格遵守 FHS 标准，创建这些目录也不会有问题。

#### 创建必需的文件和符号链接
有些程序里会使用写死的路径_调用其它暂时还未安装的程序_。为了满足这种类型程序的需要，我们将创建一些符号链接，在完成本章内容后这些软件会安装好，并替代之前的符号链接:
```
ln -sv /tools/bin/{bash,cat,dd,echo,ln,pwd,rm,stty} /bin
ln -sv /tools/bin/{install,perl} /usr/bin
ln -sv /tools/lib/libgcc_s.so{,.1} /usr/lib
ln -sv /tools/lib/libstdc++.{a,so{,.6}} /usr/lib
ln -sv bash /bin/sh
```
由于历史原因，Linux 在文件`/etc/mtab`中维护一个已挂载文件系统的列表。而现代内核改为在内部维护这个列表，并通过 `/proc` 文件系统输出给用户。为了满足一些依赖 `/etc/mtab` 文件的应用程序，我们要创建下面的符号链接：
`ln -sv /proc/self/mounts /etc/mtab`
为了让 `root` 用户能正常登录，而且 `root` 的名字能被正常识别，必须在文件 `/etc/passwd` 和 `/etc/group` 中写入相应的内容。

运行下面的命令创建 /etc/passwd 文件

```
cat > /etc/passwd << "EOF"
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/dev/null:/bin/false
daemon:x:6:6:Daemon User:/dev/null:/bin/false
messagebus:x:18:18:D-Bus Message Daemon User:/var/run/dbus:/bin/false
nobody:x:99:99:Unprivileged User:/dev/null:/bin/false
EOF
```

root 用户的实际密码（**这里的 “x” 只是占位符**）将在后面创建。

运行下面的命令创建 `/etc/group` 文件：
```
cat > /etc/group << "EOF"
root:x:0:
bin:x:1:daemon
sys:x:2:
kmem:x:3:
tape:x:4:
tty:x:5:
daemon:x:6:
floppy:x:7:
disk:x:8:
lp:x:9:
dialout:x:10:
audio:x:11:
video:x:12:
utmp:x:13:
usb:x:14:
cdrom:x:15:
adm:x:16:
messagebus:x:18:
systemd-journal:x:23:
input:x:24:
mail:x:34:
nogroup:x:99:
users:x:999:
EOF
```


这里创建的用户组没有参照任何标准 — 它们一部分是为了满足本章中配置 Udev 的需要，还有一部分来自一些现存 Linux 发行版的通用设定。另外，某些测试套件也依赖特定用户或组。而 Linux 标准规范 （LSB，参见http://www.linuxbase.org ）只要求以组 ID（GID）为 0 创建用户组 root 以及以 GID 为 1 创建用户组 bin。系统管理员可以自由分配其它所有用户组名字和 GID，因为优秀的程序不会依赖 GID 数字，而是使用组名。

为了移除 “I have no name!” 的提示符，可以打开一个新 shell。由于完整的 Glibc 已经在 第五章 里装好了，而且已经创建好了 /etc/passwd 和 /etc/group 文件，用户名和组名就可以正常解析了：

`exec /tools/bin/bash --login +h`


注意这里使用了 +h 参数。这样会告诉 bash 不要使用它内建的路径哈希功能。而不加这个参数的话， bash 将会记住曾经执行过程序的路径。_为了在新编译安装好程序后就能马上使用，参数 +h 将在本章中一直使用。_

程序 `login`，`agetty` 和` init`（还有一些其它的）会使用一些日志文件来记录信息，比如`谁在什么时候登录了系统`。不过，在日志文件不存在的时候这些程序一般不会写入。下面初始化一下日志文件并加上合适的权限：
```
touch /var/log/{btmp,lastlog,wtmp}
chgrp -v utmp /var/log/lastlog
chmod -v 664  /var/log/lastlog
chmod -v 600  /var/log/btmp
```


>The /var/log/wtmp file records all logins and logouts.
The /var/log/lastlog file records when each user last logged in.
The /var/log/faillog file records failed login attempts.
The /var/log/btmp file records the bad login attempts.
文件 /run/utmp 会记录当前已登录的用户。这个文件会在启动脚本中动态创建。

接下来还是漫长的构建的过程,尤其是`glibc`和`gcc` (吐血)
