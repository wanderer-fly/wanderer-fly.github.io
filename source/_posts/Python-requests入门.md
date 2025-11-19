---
title: Python requests入门
date: 2025-11-18 09:46:17
tags:
---

# Python基础知识之request

`requests`是Python中一个强大且易用的第三方HTTP库，用于发送HTTP请求和处理响应

## 安装

```bash
pip install requests
```

## GET请求

```python
import requests

r = requests.get("http://127.0.0.1/")

print(r.status_code)
print(r.text)
```

### 带参数的GET

```python
import requests

params = {
    "id": 1,
    "name": "wanderer"
}

r = requests.get("http://127.0.0.1/", params=params)

print(r.url) # http://127.0.0.1/?id=1&name=wanderer
```

## POST发送表单数据

```python
import requests

data = {
    "username": "admin",
    "password": "123456"
}

r = requests.post("http://127.0.0.1/login", data=data)

print(r.text)
```

### POST发送JSON

```python
import requests

json = {
    "name": "Wang Ba",
    "age": 114514
}

r = requests.post("http://127.0.0.1/user", json=json)

try:
    print(r.json())
    json_data = r.json()
    print(json.dumps(json_data))

    name = json_data.get("name") # 字段不存在返回None
except Exception as e:
    print(e)

```

**json=xxx 会自动设置 `Content-Type: application/json`**

## 添加Headers

```python
headers = {
    "User-Agent": "Motherfucker Browser 114514.0",
    "Authorization": "Bearer this_is_a_fucking_token"
}

r = requests.get("http://127.0.0.1", headers=headers)
```

打印输出Headers:

```python
for k, v in r.request.headers.items():
    print(f"{k}: {v}"")
```

输出：

```
User-Agent, python-requests/2.32.5
Accept-Encoding, gzip, deflate, zstd
Accept, */*
Connection, keep-alive
Content-Length, 30
Content-Type, application/x-www-form-urlencoded
```

## 处理JSON响应

```python
r = requests.get("http://127.0.0.1/data")

data = r.json()
print(data)
```

## 发送Cookie

```python
cookies = {
    "name": "shabi"
}

r = requests.get("http://127.0.0.1", cookies=cookies)
```

## 携带Session

```python
session = requests.Session()

# 登陆
session.post("http://127.0.0.1/login", data={"a":1,"b":2})

r = session.get("http://127.0.0.1/profile")
```

## 上传文件

```python
files = {
    "files": open("file.txt", "rb")
}

r = requests.get("http://127.0.0.1", files=files)
```

## 下载文件

```python
r = requests.get("http://127.0.0.1/file.zip")

with open("file.zip", "wb") as f:
    f.write(r.content)
```

### 如果文件过大，我们不应该一次性写入内存，可以使用流式读取：

```python
url = "http://127.0.0.1/bigfile.md"
with requests.get(url, stream=True) as r:
    with open("bigfile.md", "wb") as f:
        for chunk in r.iter_content(chunk_size=1024):
            f.write(chunk)
```

## 异常捕获

```python
import requests

try:
    r = requests.get("http://127.0.0.1", timeout=5)
except Exception as e:
    print("[-] Failed to request: ", e)
```

## 常见用法（以上没列出的）

### 代理

```python
proxies = {
    "http": "http://127.0.0.1:8080",
    "https": "http://127.0.0.1:8080"
}

requests.get(url, proxies=proxies)
```

### 忽略SSL错误

```python
import urllib3
urllib3.disable_warnings() # 不加这一行可能会产生提示

requests.get(url, verify=False)
```

### Keep-Alive相关

**requests默认Keep-Alive**，关闭Keep-Alive：

```python
requests.get("http://127.0.0.1", headers={"Connection": "close"}) # 关闭

requests.get("http://127.0.0.1", headers={"Connection": "keep-alive"}) #保持长链接
```

### 流式读取

上面已经提到了，这里只做一个例子：

```python
r = requests.get(url, steam=True)
for line in r.iter_lines():
    print(line.decode())
```

### 禁止重定向

```python
requests.get(url, allow_redirects=False)
```


## 所有HTTP方法

```python
requests.get(url)
requests.post(url)
requests.put(url)
requests.delete(url)
requests.patch(url)
requests.options(url)
```

## 常用的请求信息

```python
response = requests.get(url)
req = response.request

req.url         # 请求URL
req.method      # 请求方法
req.headers     # Headers
req.body        # 请求体
```

例如：

```python
import requests

data = {
    "username": "admin",
    "password": "123456"
}

r = requests.post("https://www.google.com", data=data)

print(f"请求地址{r.request.url}")
print(f"请求方法：{r.request.method}")
print(f"请求体：{r.request.body}")

for k, v in r.request.headers.items():
    print(f"{k}, {v}")
```

输出：

```
请求地址https://www.google.com/
请求方法：POST
请求体：username=admin&password=123456
User-Agent, python-requests/2.32.5
Accept-Encoding, gzip, deflate, zstd
Accept, */*
Connection, keep-alive
Content-Length, 30
Content-Type, application/x-www-form-urlencoded
```

## 常用的响应信息

```python
response.status_code    # HTTP状态码
response.headers        # 响应Headers
response.text           # 字符串内容
response.json()         # JSON内容
```

## FAQ

1. `r = requests(url)` 中 `r` 是 `response` ，主播懒得写全，看不懂别学了

2. 什么是请求，什么是响应？问出来这个问题建议先学会上网

3. 为什么找不到包`requests`？答：问问你辅导员你们学校转专业有什么要求吗？

## 附录1: JSON数据提取

### 例1:

对于JSON数据（假设返回对象）:

```json
{
    "data": {
        "token": "my_token",
        "user": {
            "id": 1,
            "name": "斯卡拉姆齐"
        }
    },
    "status": "ok"
}
```

提取其中的数据：

```python
json_data = r.json()

token = json_data["data"]["token"]
user_id = json_data["data"]["user"]["id"]
name = data.get("data, {}").get("user", {}).get("name")
```

### 例2:

```json
{
    "items": [
        {"id": 1, "name": "A"},
        {"id": 2, "name": "B"}
    ]
}
```

```python
names = [i["name"] for i in json_data["items"]] #提取所有name
id_1 = json_data["items"][0]["id"] # 提取第一个id
```

## ~~附录2: Python + requests访问谷歌返回搜索结果~~

**requests直接访问谷歌可能会导致403报错，这里伪装一下Headers**

*刚试了伪装Headers也没用这里不写了，`requests`做不到，因为谷歌强制要求js*