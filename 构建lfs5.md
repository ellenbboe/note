
System V is the classic boot process that has been used in Unix and Unix-like systems such as Linux since about 1983.It consists of a small program, init, that sets up basic programs such as login (via getty) and runs a script. This script, usually named rc, controls the execution of a set of additional scripts that perform the tasks required to initialize the system.

The init program is controlled by the /etc/inittab file and is organized into run levels that can be run by the user:

```
0 — halt
1 — Single user mode(单用户模式)
2 — Multiuser, without networking
3 — Full multiuser mode
4 — User definable
5 — Full multiuser mode with display manager
6 — reboot
The usual default run level is 3 or 5.
```

#### 安装LFS-Bootscripts
该软件包里面有一系列系统启动和关机的脚本
#### 概述
传统的 Linux 不管硬件是否真实存在，都以创建**静态设备**的方法来处理硬件，因此需要在 `/dev` 目录下**创建大量的设备节点文件**(**有时会有上千个**)。这通常由 `MAKEDEV` **脚本**完成，它通过**大量调用 `mknod` 程序** 为这个世界上可能存在的**每一个设备**建立对应的主设备号和次设备号。

而使用 `udev `方法，**只有**当内核检测到硬件接入，**才** 会建立对应的节点文件。因为需要在系统启动的时候**重新**建立设备节点文件(动态建立文件)，所以将它存储在 `devtmpfs` 文件系统中（_完全存在于内存中的虚拟文件系统_）。设备节点文件无需太多的空间，所以占用的内存也很小。(动态建立)
#### 历史
2000 年 2 月，一种名叫 `devfs` 的文件系统被合并到 `2.3.46` 内核版本，`2.4` 系列的稳定内核中基本可用。尽管它存在于内核的源代码中，但是这种动态创建设备的方法却从来都得不到核心内核开发者的大力支持。

问题存在于它处理设备的检测、创建和命令的方式，其中最大的问题莫过于它对设备节点的命名方式。大部分开发者的观点是，设备的命名应该由系统的所有者决定，而不是开发者。 devfs 存在一个严重的设计缺陷：它存在严重的 `race conditions` 问题(_有两个方面的问题,两个不相干的进程争取一个相同资源,两个相干的进程竞争同一资源,相互等待,命名的方式会使得目标不明确_)，如不对内核做大量的修改就无法修正这一问题。最终，因为缺乏有效的维护，在 2006 年 6 月终被移出内核源代码。
再后来，随着非稳定的 2.5 版本的内核开发，到稳定的 2.6 内核，又出现了一种全新的虚拟文件系统 `sysfs`。`sysfs` 的工作是将系统的硬件配置导入到用户空间进程。通过对用户空间可视化的改善，代替`devfs`变得更加现实。

#### Sysfs
上文简单的提及了 `sysfs` 文件系统。有些人可能会问，`sysfs` 到底是如何知道当前系统有哪些设备，这些设备又该使用什么设备号呢。对于**那些已经编译进内核的设备**，会在内核检测到时**直接注册为 sysfs 对象**（**devtmpfs 内建**）(_通过保存在内存的设备系统,来注册设备_)。对于编译为内核模块的设备，将会在**模块载入的时候注册**。一旦 `sysfs` 文件系统挂载到 `/sys`，已经在 `sysfs` 注册的硬件数据就可以被**用户空间的进程**使用， `udevd`也就能够处理了（包括对设备节点进行修改）。(**总的来说,是先通过`devtmpfs`来注册电脑上有的设备,动态注册设备,之后一旦 sysfs 文件系统挂载到 /sys,就将这些注册的设备给用户进程使用**)

#### 设备节点的创建

设备文件是**通过内核中的 `devtmpfs` 文件系统创建**的。任何想要注册的设备都需要通过 `devtmpfs` （通过驱动程序核心）实现。**每当一个**`devtmpfs`实例挂载到 `/dev`，**就** 会建立一个设备节点文件，它拥有固定 的名称、权限、所有者。
很短的时间之后，内核将给 `udevd` 一个 `uevent`。基于 `/etc/udev/rules.d`，`/lib/udev/rules.d` 和 `/run/udev/rules.d`目录内文件指定的规则，`udevd` 将会**建立**到设备节点文件的**额外符号链接**，**这有可能更改其权限，所有者，所在组，或者是更改 `udevd` 内建接口（名称）。**(_创建符号链接的时候可能会出现问题_)
这三个目录下的规则都像 `LFS-Bootscripts` 包那样标有数字，**所有三个目录都会统一到一起**。如果 `udevd` **找不到** 和所创建设备相应的规则，它会保留 `devtmpfs` 里**初始化时**使用过的权限和属主。

#### 加载模块
编译成模块的设备驱动**可能会包含别名**。别名可以通过`modinfo`打印出来查看，一般是**模块支持的特定总线的设备描述符**。举个例子，驱动`snd-fm801`支持厂商 ID 为 `0x1319` 以及设备 ID 为 `0x0801` 的设备，它包含一个 “`pci:v00001319d00000801sv*sd*bc04sc01i*`” (_vesion,device,sv\*sd\*bc04sc01i*_)的**别名**，总线驱动导出该驱动别名并通过 `sysfs` 处理相关设备。例如，文件 `/sys/bus/pci/devices/0000:00:0d.0/modalias` 应该会包含字符串 “`pci:v00001319d00000801sv00001319sd00001319bc04sc01i00`”。`Udev` 采用的默认规则会让 `udevd` 根据 `uevent` 环境变量 `MODALIAS` 的内容（它应该和 `sysfs` 里的 `modalias` 文件内容一样）调用 `/sbin/modprobe`，这样就可以加载在通配符扩展后能和这个字符串一致的**所有模块**。(_modprobe命令 用于智能地向内核中加载模块或者从内核中移除模块。_)
在这个例子里，意味着，除了 `snd-fm801` 之外，一个已经废弃的（不是我们所希望的）驱动 `forte` 如果存在的话也会被加载。下面有几种可以避免加载多余驱动的方式。

内核本身也能够根据需要加载网络协议，文件系统以及 `NLS` 支持模块。

##### 处理热插拔/动态设备

在你插入一个设备时，例如一个通用串行总线（USB）MP3 播放器，内核检测到设备已连接就会生成一个`uevent`。这个 `uevent` 随后会被上面所说的`udevd`处理。

#### 加载模块和创建设备时可能碰到的问题
在自动创建设备节点时可能会碰到一些问题。
##### 内核模块没有自动加载
`Udev` 只会加载包含有特定总线别名而且已经被总线驱动导出到 `sysfs` 下的模块。在其它情况下，你应该考虑用其它方式加载模块。采用 Linux-4.15.3，`Udev` 可以加载编写合适的 `INPUT`、`IDE`、`PCI`、`USB`、`SCSI`、`SERIO` 和 `FireWire`设备驱动。

要确定你希望加载的驱动是否支持 `Udev`，可以用模块名字作为参数运行 `modinfo`。然后查看`/sys/bus`下的设备目录里是否有个`modalias`文件。

如果在 `sysfs` 下能找到`modalias`文件，那么就能驱动这个设备并可以直接操作它，但是如果该文件里没有包含设备别名，那意味着这个驱动有问题。我们可以先尝试不依靠 `Udev`直接加载驱动，等这个问题以后解决。

如果在 `/sys/bus` 下的相应目录里没有 `modalias` 的话，意味着内核开发人员还没有为这个总线类型增加 modalias 支持。使用 Linux-4.15.3 内核，应该是 ISA 总线的问题。希望这个可以在后面的内核版本里得到解决。

`Udev` 不会尝试加载类似 `snd-pcm-oss` 这样的“封装”驱动，也不会加载类似 `loop` 这样的非硬件驱动。(loop是指循环?)
##### 内核驱动没有自动加载，Udev 也没有尝试加载
如果是 “封装” 模块只是强化其它模块的功能（比如，`snd-pcm-oss` 模块通过允许 OSS 应用直接访问声卡的方式加强了 `snd-pcm` 模块的功能），需要配置 `modprobe` 在 `Udev` 加载硬件驱动模块后再加载相应的封装模块。可以在任意 `/etc/modprobe.d/<filename>.conf`文件里增加一行 “`softdep`”，例如：
`softdep snd-pcm post: snd-pcm-oss`(设置加载模块方式)
请注意 “`softdep`” 也支持 `pre`: 的依赖方式，或者混合 `pre`: 和 `post`:。查看 `modprobe.d(5`) 手册了解更多关于 “`softdep`” 语法和功能的信息。

如果问题模块不是一个**封装**而且也是有用的，配置 `modules`开机脚本在引导系统的时候加载模块。这样需要把模块名字添加到 `/etc/sysconfig/modules` 文件里的单独一行。这个也可以用于封装模块，但是只是**备用**方式。
##### Udev 加载了一些无用模块
要么不要编译该模块，或者把它加入到模块黑名单 `/etc/modprobe.d/blacklist.conf` 里，像下面的例子里屏蔽了 forte 模块：`blacklist forte`
>被屏蔽的模块仍然可以用 modprobe 强行加载。

##### Udev 创建了错误的设备节点，或错误的软链接
这个情况通常是因为设备匹配错误。例如，一条写的不好的规则可能同时匹配到 SCSI 磁盘（希望加载的）和对应厂商的 SCSI 通用设备（错误的）。找出这条问题规则，并通过 udevadm info 命令的帮助改得更具体一些。(_一条规则对应到两个设备_)

##### Udev 规则工作不可靠
这可能是上个问题的另一种表现形式。如果不是，而且你的规则使用了 `sysfs` 特性，那可能是内核时序问题，希望在后面版本内核里能解决。目前的话，你可以暂时建立一条规则等待使用的 `sysfs` 特性，并附加到`/etc/udev/rules.d/10-wait_for_sysfs.rules` 文件里（如果没有这个文件就创建一个）。如果你碰到这种情形请通知 LFS 开发邮件列表，这个对我们有帮助。

##### Udev 没有创建设备
后面的内容会假设驱动已经静态编译进内核或已经作为模块加载，而且你也已经确认 `Udev` 没有创建相应的设备节点。
如果内核驱动没有将自己的数据导出到 `sysfs` 里，`Udev` 就没有相关信息来创建设备节点。这通常发生在内核树之外的第三方驱动里。我们可以使用合适的主/副设备数字 ID（查看内核文档里或第三方驱动厂商提供的文档里的 devices.txt 文件） 在 `/lib/udev/devices` 目录里创建一个静态设备节点。这个静态设备节点随后会被 `udev` 引导脚本复制到 `/dev` 里。

##### 设备名称顺序在重启后随机改变
这是因为 `Udev`被设计成并行处理 `uevents` 并加载模块，所以是不可预期的顺序。这个不会“修复”。你不应该依赖稳定的内核模块名称。而是，在检测到设备的稳定特征，比如序列号或 Udev 安装的一些*\_id应用的输出，来判断设备的稳定名称，之后  创建自己的规则生成相应的软链接。
#### 管理设备
##### 网络设备
Udev, by default, names network devices according to Firmware/BIOS data or physical characteristics like the bus, slot, or MAC address.
>(通过固件/bios或者说是设备自带的属性进行命名)这种方式使得命名一致,而不是基于发现网卡的时间来确定(老方法)

新的方法一般会变成enp5s0 or wlp3s0这样的形式
你也可以禁用新的方法使用老的

创建传统的udev规则
根据现有的初始化规则来创建
`bash /lib/udev/init-net-rules.sh`
`cat /etc/udev/rules.d/70-persistent-net.rules`

具有相同功能的设备出现在 `/dev` 目录下的顺序是随机的。假如你有一个 USB 摄像头和一个电视调谐器，`/dev/video0` 有可能是 USB 摄像头，`/dev/video1` 是电视调谐器，有时候又可能是反过来的。对于**除声卡和网卡**外的设备，都可以通过创建自定义持久性符号链接的 udev 规则来固定。

##### 处理类似的设备
对于你所有的硬件，都有可能遇到此问题（尽管此问题可能在你当前的 Linux 发行版上不存在），在 `/sys/class` 或 `/sys/block` 目录下找到对应目录，比如，显卡可能的路径为 `/sys/class/video4linux/videoX`。找到该设备的唯一设备标识（通常，厂商和产品 ID 以及/或 序列号会有用）：
`udevadm info -a -p /sys/class/video4linux/video0`
然后通过写入规则建立符号链接：
```
cat > /etc/udev/rules.d/83-duplicate_devs.rules << "EOF"
# Persistent symlinks for webcam and tuner
KERNEL=="video*", ATTRS{idProduct}=="1910", ATTRS{idVendor}=="0d81", \
    SYMLINK+="webcam"
KERNEL=="video*", ATTRS{device}=="0x036f", ATTRS{vendor}=="0x109e", \
    SYMLINK+="tvtuner"

EOF
```
最终，`/dev/video0` 和 `/dev/video1` 依旧会**随机**分配给 USB 摄像头和电视调谐器，但是 `/dev/tvtuner` 和 `/dev/webcam` 将会**固定**的分配给正确的设备。

#### 通用网络设置
网络脚本启动和关闭哪些接口通常取决于`/etc/sysconfig/`中的文件。此目录应包含要配置的每个接口的文件，例如ifconfig.xyz，其中“xyz”应描述网卡。
使用`ip link` 或者 `ls /sys/class/net` 查看接口名称

通过配置文件配置接口(静态ip)
具体按照自己情况来
```
cd /etc/sysconfig/
cat > ifconfig.eth0 << "EOF"
ONBOOT=yes 是否在booting的时候调用nic(网卡全称 network interface card)
IFACE=eth0 接口名称
SERVICE=ipv4-static 获取IP地址的方法
IP=192.168.1.2
GATEWAY=192.168.1.1 默认网关IP地址
PREFIX=24 网络掩码
BROADCAST=192.168.1.255 广播地址
EOF
```
For more information see the `ifup` man page.

**DNS解析**
通过将ISP服务器或网络管理员提供的DNS服务器的IP地址放入/etc/resolv.conf来实现ip地址的解析。
```
cat > /etc/resolv.conf << "EOF"
# Begin /etc/resolv.conf

domain <Your Domain Name>
nameserver <IP address of your primary nameserver>
nameserver <IP address of your secondary nameserver>

# End /etc/resolv.conf
EOF
```
>Google 公开 IPv4 DNS 解析服务器地址为 8.8.8.8 和 8.8.4.4。
译者注：国内也有一些 IT 公司提供公开可用的 DNS 解析服务：
114 DNS：114.114.114.114 和 114.114.115.115
阿里 DNS：223.5.5.5 和 223.6.6.6
百度 DNS：180.76.76.76
OpenDNS：208.67.220.220）

**自定义host文件**(一般是自动从dns的服务器中得到缓存,也可以手动配置)
就算没有网卡，也应该提供有效的完整域名，否则某些软件可能无法正常运行。
```
Private Network Address Range      Normal Prefix
10.0.0.1 - 10.255.255.254           8
172.x.0.1 - 172.x.255.254           16
192.168.y.1 - 192.168.y.254         24
```

>x can be any number in the range 16-31. y can be any number in the range 0-255.

#### System V Bootscript
SysVinit(init)默认处于3的级别
```
0: halt the computer 关闭计算机
1: single-user mode 单人模式
2: multi-user mode without networking 多人单机
3: multi-user mode with networking 多人联机
4: reserved for customization, otherwise does the same as 3
5: same as 4, it is usually used for GUI login (like X's xdm or KDE's kdm)
6: reboot the computer 重启
```
内核初始化的时候，无论是命令行指定运行的第一个程序，还是默认的 init。该程序会读入初始化文件 `/etc/inittab`
初始化文件的解释可以参考 `inittab` 的 `man` 手册页面。对于LFS，运行的核心命令是 **rc**。上面的初始化文件将指示 `rc` 运行 `/etc/rc.d/rcS.d` 目录中，所有以 `S` 开头的脚本，然后便是 `/etc/rc.d/rc?.d` 目录中，所有以 `S` 开头的脚本。目录中的问号由指定的 `initdefault` 值来决定。

为了方便，`rc` 会从 `/lib/lsb/init-functions` 中读取函数库。该库还会读取一个可选的配置文件 `/etc/sysconfig/rc.site`。任何在后续章节中描述到的系统配置文件中的参数，都可以放在这个文件中，允许将所有的系统参数合并到该文件中。

为了调试方便，函数脚本会将日志输出到 `/run/var/bootlog` 文件中。由于 `/run` 目录是个 `tmpfs`（临时文件系统），所以该文件在启动之后就不会持续存在了，但在启动过程的最后，这些内容会被添附到更为持久的 `/var/log/boot.log` 文件中。

想要改变运行级，可以使用命令 `init <runlevel>`，其中的 `<runlevel>` 便是想要切换到的运行级。举个例子，若是想要重启计算机，可以使用命令 `init 6`，这是 `reboot` 命令的别名。就像，`init 0` 是 `halt` 的别名一样。

对于中文，日语，韩语以及一些其他的语言需要的字符，Linux 的控制台还无法通过配置是之正常显示。用户若要使用这些语言，需要安装 `X Window 系统`，用于扩充所需字符域的字体，以及合适的输入法.

可选的 `/etc/sysconfig/rc.site` 文件中包含着那些为每个 `System V` 启动脚本自动设置好的设定。这些设定也可以在 `/etc/sysconfig/` 目录中的 `hostname`，`console`，和`clock` 文件中设置。如果这些设定值同时在以上的这些文件和 `rc.site` 中设定了，那么脚本中的设定值将会被**优先采用**

**自定义启动和关闭的脚本**
>LFS 启动脚本会以相当效率的方式启动和关闭系统，不过你可以在 `rc.site` 文件中进行调整，来提升速度或是根据需求调整消息。若是有这样的需求，就去调整上面 `/etc/sysconfig/rc.site` 文件的设置吧！
在启动脚本 `udev` 运行时，会调用一次 `udev settle`，完成检测需要很长时间。这段时间根据当前系统的设备，可花可不花。如果你需要的仅仅是简单的分区和单个网卡，在启动的过程中，就没有必要等待这个命令执行。通过设置变量 `OMIT_UDEV_SETTLE=y`，可以跳过此命令。
启动脚本` udev_retry` 默认也执行`udev settle`。该命令仅在 `/var` 目录是分开挂载的情况下需要。因为这种情况下时钟需要文件 `/var/lib/hwclock/adjtime`。其他的自定义设置可能也需要等待 `udev` 执行完成，但是在许多的安装中不需要。设置变量 `OMIT_UDEV_RETRY_SETTLE=y` 跳过命令。
默认情况下，文件系统检测静默执行。看上去就像是启动过程中的一个延迟。想要打开 `fsck` 的输出，设置变量。
重起时，你可能想完全的跳过文件系统检测 `fsck`。为此，可以创建 `/fastboot` 文件或是以 `/sbin/shutdown -f -r now` 命令重启系统。另一方面，你也可以通过创建 `/forcefsck`，或是在运行 `shutdown` 命令时，用 `-F` 参数代替`-f`，以此来强制检测整个文件系统。
设置变量 `FASTBOOT=y` 将禁用启动过程中的 `fsck`，直至你将其移除。不推荐长时间地使用该方式。
通常，`/tmp` 目录中的所有文件会在启动时删除。根据存在目录与文件的数量，该操作会导致启动过程中明显的延迟。如果要跳过移除文件的操作，设置变量 `SKIPTMPCLEAN=y`。
在关机的过程中，`init` 程序会向每一个已经启动的程序（例如，`agetty`）发送一个 `TERM` 信号，等一段时间（默认为 3 秒），然后给每个进程发送 `KILL` 信号。对没有被自身脚本关闭的进程，`sendsignals` 脚本会**重复**此过程。`init` 的延迟可以通过参数来设置。比方说，想去掉 `init` 的延迟，可以通过在关机或重启时使用 `-t0` 参数（如，`/sbin/shutdown -t0 -r now`）。`sendsignals` 脚本的延迟可以通过设置参数 `KILLDELAY=0` 跳过。

创建 /etc/inputrc 文件 可编辑控制行的语句
创建 /etc/shells 文件 shell的类似索引的东西
