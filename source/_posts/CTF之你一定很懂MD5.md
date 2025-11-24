---
title: CTF之你一定很懂MD5
date: 2025-11-22 14:08:38
tags: [CTF, MD5, Crypto]
---

# 题目

## 你一定很懂MD5

~~我懂个🥚的md5~~

```python
import uuid
import hashlib

if __name__ == "__main__":
    flag = "aicx{xxxxxxxxxxx}"
    for char in flag:
        md5_hash = hashlib.md5(char.encode('utf-8')).hexdigest()
        print(f"{md5_hash}")

'''output:
0cc175b9c0f1b6a831c399e269772661
865c0c0b4ab0e063e5caa3387c1a8741
4a8a08f09d37b73795649038408b5f33
9dd4e461268c8034f5c8564e155c67a6
f95b70fdc3088560732a5ac135644506
8fa14cdd754f91cc6554c9e71929cce7
45c48cce2e2d7fbdea1afc51c7c6ad26
a87ff679a2f3e71d9181a67b7542122c
8277e0910d750195b448797616e091ad
eccbc87e4b5ce2fe28308fd9f2a7baf3
cfcd208495d565ef66e7dff9f98764da
c4ca4238a0b923820dcc509a6f75849b
1679091c5a880faf6fb5e6087eb1b2dc
336d5ebc5436534e61d16e63ddfca327
a87ff679a2f3e71d9181a67b7542122c
0cc175b9c0f1b6a831c399e269772661
8fa14cdd754f91cc6554c9e71929cce7
c4ca4238a0b923820dcc509a6f75849b
336d5ebc5436534e61d16e63ddfca327
a87ff679a2f3e71d9181a67b7542122c
cfcd208495d565ef66e7dff9f98764da
45c48cce2e2d7fbdea1afc51c7c6ad26
92eb5ffee6ae2fec3ad71c777531578f
336d5ebc5436534e61d16e63ddfca327
c9f0f895fb98ab9159f51fd0297e236d
e4da3b7fbbce2345d7772b0674a318d5
eccbc87e4b5ce2fe28308fd9f2a7baf3
8f14e45fceea167a5a36dedd4bea2543
336d5ebc5436534e61d16e63ddfca327
92eb5ffee6ae2fec3ad71c777531578f
c9f0f895fb98ab9159f51fd0297e236d
45c48cce2e2d7fbdea1afc51c7c6ad26
a87ff679a2f3e71d9181a67b7542122c
45c48cce2e2d7fbdea1afc51c7c6ad26
c81e728d9d4c2f636f067f89cc14862c
8fa14cdd754f91cc6554c9e71929cce7
45c48cce2e2d7fbdea1afc51c7c6ad26
cfcd208495d565ef66e7dff9f98764da
8277e0910d750195b448797616e091ad
e4da3b7fbbce2345d7772b0674a318d5
1679091c5a880faf6fb5e6087eb1b2dc
cbb184dd8e05c9709e5dcaedaa0495cf
'''
```
## 解题思路

题目给出这段程序的输出output，在离线的情况下我们可以尝试通过for循环枚举的方式解决：

```python
import hashlib

def count_md5(c):
    return hashlib.md5(c.encode('utf-8')).hexdigest()

def main():
    md5 = '''
0cc175b9c0f1b6a831c399e269772661
865c0c0b4ab0e063e5caa3387c1a8741
4a8a08f09d37b73795649038408b5f33
9dd4e461268c8034f5c8564e155c67a6
f95b70fdc3088560732a5ac135644506
8fa14cdd754f91cc6554c9e71929cce7
45c48cce2e2d7fbdea1afc51c7c6ad26
a87ff679a2f3e71d9181a67b7542122c
8277e0910d750195b448797616e091ad
eccbc87e4b5ce2fe28308fd9f2a7baf3
cfcd208495d565ef66e7dff9f98764da
c4ca4238a0b923820dcc509a6f75849b
1679091c5a880faf6fb5e6087eb1b2dc
336d5ebc5436534e61d16e63ddfca327
a87ff679a2f3e71d9181a67b7542122c
0cc175b9c0f1b6a831c399e269772661
8fa14cdd754f91cc6554c9e71929cce7
c4ca4238a0b923820dcc509a6f75849b
336d5ebc5436534e61d16e63ddfca327
a87ff679a2f3e71d9181a67b7542122c
cfcd208495d565ef66e7dff9f98764da
45c48cce2e2d7fbdea1afc51c7c6ad26
92eb5ffee6ae2fec3ad71c777531578f
336d5ebc5436534e61d16e63ddfca327
c9f0f895fb98ab9159f51fd0297e236d
e4da3b7fbbce2345d7772b0674a318d5
eccbc87e4b5ce2fe28308fd9f2a7baf3
8f14e45fceea167a5a36dedd4bea2543
336d5ebc5436534e61d16e63ddfca327
92eb5ffee6ae2fec3ad71c777531578f
c9f0f895fb98ab9159f51fd0297e236d
45c48cce2e2d7fbdea1afc51c7c6ad26
a87ff679a2f3e71d9181a67b7542122c
45c48cce2e2d7fbdea1afc51c7c6ad26
c81e728d9d4c2f636f067f89cc14862c
8fa14cdd754f91cc6554c9e71929cce7
45c48cce2e2d7fbdea1afc51c7c6ad26
cfcd208495d565ef66e7dff9f98764da
8277e0910d750195b448797616e091ad
e4da3b7fbbce2345d7772b0674a318d5
1679091c5a880faf6fb5e6087eb1b2dc
cbb184dd8e05c9709e5dcaedaa0495cf
'''
    for item in md5.split('\n'):
        for c in range(45, 126):
            unit = count_md5(chr(c))
            if unit != item:
                continue
            else:
                print(f"{chr(c)}", end='')
        
    
if __name__ == '__main__':
    main()
```

太low，不解释