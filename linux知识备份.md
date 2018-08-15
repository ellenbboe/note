#### ARCH降级:(未实证,先记录一下)

>使用downgrade降级程序
先要在/etc/pacman.conf添加
[archlinuxfr]
SigLevel = Never
Server =
http://repo.archlinux.fr/$arch

之后使用-Sy来更新仓库
安装downgrade

#### (记录备忘)关于linux下/srv、/var和/tmp的职责区分 ([转载自这儿](https://blog.csdn.net/u012107143/article/details/54972544?utm_source=itdadao&utm_medium=referral))
`/srv` ：主要用来存储本机或本服务器提供的服务或数据。（用户主动生产的数据、对外提供服务）

>/srv contains site-specific data which is served by this system.



`/var` ：系统产生的不可自动销毁的缓存文件、日志记录。（系统和程序运行后产生的数据、不对外提供服务、只能用户手动清理）（包括mail、数据库文件、日志文件）

>/var contains variable data files. This includes spool directories and files, administrative and logging data, and transient and temporary files.
Some portions of /var are not shareable between different systems. For instance, /var/log, /var/lock, and /var/run. Other portions may be shared, notably /var/mail, /var/cache/man, /var/cache/fonts, and /var/spool/news.
/var is specified here in order to make it possible to mount /usr read-only. Everything that once went into /usr that is written to during system operation (as opposed to installation and software maintenance) must be in /var.
If /var cannot be made a separate partition, it is often preferable to move /var out of the root partition and into the /usr partition. (This is sometimes done to reduce the size of the root partition or when space runs low in the root partition.) However, /var must not be linked to /usr because this makes separation of /usr and /var more difficult and is likely to create a naming conflict. Instead, link /var to /usr/var.
Applications must generally not add directories to the top level of /var. Such directories should only be added if they have some system-wide implication, and in consultation with the FHS mailing list.



`/tmp` ：保存在使用完毕后可随时销毁的缓存文件。（有可能是由系统或程序产生、也有可能是用户主动放入的临时数据、系统会自动清理）

>The /tmp directory must be made available for programs that require temporary files.
Programs must not assume that any files or directories in /tmp are preserved between invocations of the program.

--------------------------------------------------------------------

所以，服务器被用作Web开发时，html文件更应该被放在/srv/www下，而不是/var/www下（因为/srv目录是新标准中才有的，出现较晚；而且Apache将/var/www设为了web默认目录，所以现在绝大多数人都把web文件放在/var/www，这是个历史遗留问题）。

如ftp、流媒体服务等也应该被放在/srv对应的目录下。如果对应目录太大，应该另外挂载分区。


### Bumblebee使用控制独显

##### 安装:
`bumblebee` - 提供守护进程以及程序的主要安装包。
`mesa` - 开源的 `OpenGL` 标准实现。
对于合适的NVIDIA驱动。
`xf86-video-intel` - `Intel` 驱动（可选）。
对于32位程序 (必须启用Multilib）在64位机器上的支持，安装:

`lib32-virtualgl` - 为32位应用提供的渲染/显示桥。
`lib32-nvidia-utils` 或者 `lib32-nvidia-340xx-utils`（和64位对应）。
要使用`Bumblebee`，请确保添加你的用户到 `bumblebee` 组：
`gpasswd -a user bumblebee`
并启用(**enable**) `bumblebeed.service`。之后重启系统

可以明显的感受到风扇转速下降

重启之后
**测试**
安装 `mesa-demos`并使用 `glxgears` 测试 `Bumblebee` 是否工作：
`optirun glxgears -info`
看到有图形出现,并且风扇开始转动,独显开始工作,成功!!
