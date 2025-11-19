---
title: CentOS7重置root密码
date: 2025-09-28 14:23:22
tags: Linux
---

# CentOS 7 重置root密码

CentOS 7 安装过程中没有设置root密码、没有将新建的用户加入管理员组，导致无法使用su和sudo命令

## 解决思路

进入single user mode设置root密码或将用户加入sudoers里面

## 解决步骤

1. 重启虚拟机，在GRUB引导页面按 `E` 键，进入编辑模式

2. 找到`linux`行，例如：

    ```
    linux16 /vmlinuz-3.10.0-862.e17...
    ```

    在这一行的末尾（方向键移动到行尾，建议按`END`键定位到末尾，有些同学可能不知道行尾的意思

3. 添加以下内容（不需要另起一行！！）

    ```
    rd.break console=tty0
    ```

    然后按`Ctrl+X`启动（进入单用户模式）

4. 以rw模式重新挂载/sysroot:

    ```
    mount -o rw,remount /sysroot
    ```

5. 切换到/sysroot：

    ```
    chroot /sysroot
    ```

6. 标准输入修改root密码

    ```
    echo '123456' | passwd --stdin root
    ```
    注意需要selinux处于disabled状态，如果不懂请参考方法2

7. (方法2) 将当前用户添加到sudoers文件：

    ```
    EDITOR=vim visudo
    ```

    找到这一行：（可以通过直接输入`/Allow root to run`快速搜索）

    ```
    root    ALL=(ALL)   ALL
    ```

    在下面插入（按`i`进入插入模式）：

    ```
    你的用户名  ALL=(ALL)   NOPASSWD:ALL
    ```

    然后按`Esc`退出插入模式，按住`Ctrl`连续按两下`Z`保存退出

    输入`exit`退出chroot容器

    输入`reboot`重启

8. (方法2) 修改root密码

    开机后登陆你的用户，打开终端，输入：

    ```
    sudo su
    ```

    进入root用户，然后输入

    ```
    passwd root
    ```

    输入你要设置的密码（输入两遍）即可重置root密码

