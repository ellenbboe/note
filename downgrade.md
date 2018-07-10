ARCH降级:(未实证,先记录一下)

    使用downgrade降级程序
    先要在/etc/pacman.conf添加
    [archlinuxfr]
    SigLevel = Never
    Server =
    http://repo.archlinux.fr/$arch

    之后使用-Sy来更新仓库
    安装downgrade
