**内核**
以下是系统底层的快捷键，通常被用于调试。遇到系统问题，请尽可能尝试这些快捷键，而不是按住电源开关强制关机。

这些快捷键需要首先使用如下命令激活
`echo "1" > /proc/sys/kernel/sysrq`
如果你希望在系统启动时就开启，请编辑 `/etc/sysctl.d/99-sysctl.conf` 并添加配置 `kernel.sysrq = 1`. 如果你希望在挂载分区和启动引导前就开启的话, 请在内核启动参数上添加 `sysrq_always_enabled=1`.

记住这个激活命令的通用口诀是 "**R**eboot **E**ven **I**f **S**ystem **U**tterly **B**roken" (或者"**REISUB**")。

键盘快捷键	描述
`Alt+SysRq+R+` _Unraw_
>从X收回对键盘的控制
>
`Alt+SysRq+E+` _Terminate_
>向所有进程发送SIGTERM信号，让它们正常终止
>
`Alt+SysRq+I+` _Kill_
>向所有进程发送SIGKILL信号，强制立即终止
> 
`Alt+SysRq+S+` _Sync_
>将待写数据写入磁盘
>
`Alt+SysRq+U+` _Unmount_
>卸载所有硬盘然后重新按只读模式挂载
>
`Alt+SysRq+B+` _Reboot_
>重启
