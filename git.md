#### 一般提交操作为:
```
git add -all ==>  gaa
git commit -m "xxxx" ==> gc
git pull ==>   gl
git push  ==>  gp
```
#### 自动保存密码:
`git config --global credential.helper store`

#### git443错误
`OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443`

网上的解决方法都不管用

我的解决方法:重新clone到本地 进行上传 成功

#### git 上传脚本

由于上传命令太多了,所以写了脚本

```
#!/bin/bash
git add --all;git commit -m "$1";git pull;git push;
```
使用方法 `文件名 "comment"`
