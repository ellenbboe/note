### 让 LFS 系统可引导
#### 创建 /etc/fstab 文件
/etc/fstab 文件的作用是让其它程序确定存储设备的默认挂载点、挂载参数和检查信息（例如完整性检测）。
```
cat > /etc/fstab << "EOF"
# Begin /etc/fstab

# file system  mount-point  type     options             dump  fsck
#                                                              order

/dev/<xxx>     /            <fff>    defaults            1     1
/dev/<yyy>     swap         swap     pri=1               0     0
proc           /proc        proc     nosuid,noexec,nodev 0     0
sysfs          /sys         sysfs    nosuid,noexec,nodev 0     0
devpts         /dev/pts     devpts   gid=5,mode=620      0     0
tmpfs          /run         tmpfs    defaults            0     0
devtmpfs       /dev         devtmpfs mode=0755,nosuid    0     0

# End /etc/fstab
EOF
```

其中，<xxx>，<yyy> 和 <fff> 请使用适当的值替换。例如 `sda2`，`sda5` 和 `ext4`。关于文件中六个字段的含义，请查看 man 5 fstab（译者注：fsck 列的数值来决定需要检查的文件系统的检查顺序。允许的数字是0, 1, 和2。根目录应当获得最高的优先权 1, 其它所有需要被检查的设备设置为 2。0 表示设备不会被 fsck 所检查）。

基于 `MS-DOS` 或者是来源于 `Windows` 的文件系统`（例如：vfat，ntfs，smbfs，cifs，iso9660，udf）`需要在挂载选项中添加「iocharset」，才能让非 ASCII 字符的文件名正确解析。此选项的值应该与语言区域设置的值相同，以便让内核能正确处理。此选项在相关字符集定义已为内核内建或是编译为模块时生效（在文件系统 -> 本地语言支持中查看）。此外，`vfat` 和 `smbfs` 还需启用「codepage」支持。例如，想要挂载 `USB` 闪存设备，`zh-CN.GBK` 用户需要在 `/etc/fstab` 中添加以下的挂载选项：
`noauto,user,quiet,showexec,iocharset=koi8r,codepage=866`
对于 `zh_CN.UTF-8` 用户的对应选项是：
`noauto,user,quiet,showexec,iocharset=utf8,codepage=936`
主要是设置挂载参数
**本机**
```
$ cat /etc/fstab
# Static information about the filesystems.
# See fstab(5) for details.

# <file system> <dir> <type> <options> <dump> <pass>
# /dev/sda5
UUID=c36eedfb-08b3-4e28-8483-03f6d5f1ad0c	/         	ext4      	rw,relatime,data=ordered	0 1

# /dev/sda2
UUID=608A-F457      	/boot     	vfat      	rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=iso8859-1,shortname=mixed,utf8,errors=remount-ro	0 0
```
之后就是
1.编译内核
2.安装grub引导(注意备份)
3.重新启动

之后安装其他的小程序 sudo,dhcp,wget等
## 结束
