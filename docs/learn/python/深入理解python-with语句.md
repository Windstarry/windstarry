---
title: 深入理解python-with语句
description: 深入理解python-with语句
date: 2023-4-19
recommend: 3
sticky: 3
tags:
 - python
 - 项目实战
categories:
 - python
---
# 深入理解python with 语句
python中with 语句作为try/finally 编码范式的一种替代, 适用于对资源进行访问的场合，确保不管使用过程中是否发生异常都会执行必要的“清理”操作，释放资源，比如文件使用后自动关闭、线程中锁的自动获取和释放等
:::tip with语句的优点
- 采用with语句的代码更简洁；
- 防止因为忘记写f.close()而引发的错误；
- 一个对象（上下文）的操作有进入、退出过程就可以抽取出来，并做成自动化执行；
:::
##  1.使用with打开文件
你应该见过下面这种打开文件的方式
```python
with open('data', 'r', encoding='utf-8') as f:
    data = f.readlines()
```
上面的写法，与下面的写法在最终效果上是一致的
```python
f = open('data', 'r', encoding='utf-8')
try:
    data = f.readlines()
except:
    pass
finally:
    f.close()
```
对比两段代码不难发现，使用with语句时，代码更加简洁，而且不用主动关闭文件，在with语句体退出时，会自动关闭文件，即便with语句体中发生了异常。
## 2.上下文管理器和with 语句有关的概念
想要理解with语句，就必须先理解以下几个概念
### 2.1 上下文管理协议
简单来说，就是实现两个方法，__enter__() 和__exit__()
### 2.2 上下文管理器
实现了__enter__() 和__exit__()的对象就是上下文管理器
>Python上下文管理器是一种特殊类型的函数，可以在其执行期间捕获和管理变量，以及在函数执行结束时自动释放资源。
### 2.3 运行时上下文
由上下文管理器创建，在with语句体代码执行前，通过__enter__()进入，语句体代码执行结束后，通过__exit__()退出
### 2.4 上下文表达式
在with关键字后面的表达式，表达式返回上下文管理器对象
### 2.5 语句体
with语句包裹起来的代码
## 3.使用with语句控制线程锁的释放
使用with不仅能够自动的关闭打开的文件对象，还可以自动的释放线程锁，这样可以避免死锁的发生，在python多线程---线程锁一文中，为避免多个线程同时对一个变量对象进行修改，在关键语句上加了线程锁
```python
def worker():
    time.sleep(1)
    global a
    for i in range(100000):
        m_lock.acquire()    # 加锁
        a += 1
        m_lock.release()    # 释放锁
```
如果你忘记了写m_lock.release() 对锁进行释放，那么这将导致其他线程永远也无法获取到线程锁，这样就形成了死锁，上面的代码在acquire之后，使用release释放所，使用with语句，可以更加优雅的实现加锁和释放锁的操作。
```python
def worker():
    time.sleep(1)
    global a
    for i in range(100000):
        with m_lock:
            a += 1
```
## 4.同时打开多个文件
许多人都不知道，with语句可以同时打开多个文件，这样做可以减少代码的缩进，让代码的编写更加容易，两个open语句之间用逗号分隔即可。
```python
with open('a1', 'w')as f1, open('a2', 'w')as f2:
    f1.write('a')
    f2.write('b')
```
## 5.自定义上下文管理器
在调试程序性能时，如果只是想知道某个函数的执行时长，可以使用一个可以统计函数运行时长的装饰器进行处理，但程序往往很复杂，一段代码里，要做很多操作，不只是调用了一个函数，也可能存在循环，因此，单纯的知道某个函数的执行时长，不能帮助我们更好的了解程序的性能。

我们需要针对某个代码段进行时间统计，知道这一段代码的执行时长对我们很有帮助。你可以使用time.time()方法在代码段开始时获取到时间，在结束时再次获取到时间，两个时间做差就可以得到这个代码段的运行时长，这种操作方式写起来很麻烦，如果有多处代码段需要统计，就得写多次，很不方便。

下面是一个可以统计代码段运行时长的上下文管理器
```python
import time


class ProTime(object):
    def __init__(self, tag=''):
        self.tag = tag

    def __enter__(self):
        self.start_time = time.time()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        time_diff = self.end_time - self.start_time
        msg = "代码段{tag}运行时长{time_diff}".format(tag=self.tag, time_diff=time_diff)
        print(msg)


with ProTime('first') as pt:
    # 这里是你要统计运行时长的代码块
    time.sleep(1)

with ProTime('second') as pt:
    # 这里是你要统计运行时长的代码块
    time.sleep(2)
```
理解这段代码的关键之处，在with语句所包裹的语句体执行之前，先要执行__enter__方法，语句体执行结束之后，不论是否有异常，都要执行__exit__，在__exit__方法里，三个参数提供了异常的全部信息，如果你想处理异常，可以在这个方法里做处理。

__init__方法有一个tag参数，设置这个参数的目的，是为了在输出信息里区分多个代码块，如果不想设置这个tag，可以考虑对这个上下文管理器进行修改，通过调用栈获得调用信息，准确的指出是哪个代码段的执行时长。

修改后的上下文管理器如下
```python
import time
import sys


class ProTime(object):
    def __init__(self, tag=''):
        frame = sys._getframe()
        tag_frame = frame.f_back
        self.lineno = tag_frame.f_lineno
        self.filename = tag_frame.f_code.co_filename
        self.tag = tag

    def __enter__(self):
        self.start_time = time.time()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        time_diff = self.end_time - self.start_time
        if self.tag:
            msg = "代码段{tag}运行时长{time_diff}".format(tag=self.tag, time_diff=time_diff)
        else:
            msg = "文件{filename} 第 {lineno} 行代码块执行时长{time_diff}".format(filename=self.filename, lineno=self.lineno, time_diff=time_diff)
        print(msg)


with ProTime('first') as pt:
    # 这里是你要统计运行时长的代码块
    time.sleep(1)

with ProTime() as pt:
    # 这里是你要统计运行时长的代码块
    time.sleep(2)


def test():
    with ProTime() as pt:
        # 这里是你要统计运行时长的代码块
        time.sleep(1)

test()
```
## 6.开发时常用的with语句
### 6.1打开文件或数据库
文件：
```python
with open('file.txt', 'r') as f:  
    content = f.read()  
print(content)
```  
数据库：
```python
import sqlite3

# 定义数据库连接参数
db_file = "mydb.sqlite"  # 数据库文件名

# 使用 with 语句连接数据库
with sqlite3.connect(db_file) as conn:
    cursor = conn.cursor()
```
>在 with 语句块结束后，连接对象 conn 会自动关闭，从而确保数据库连接被正确关闭，避免资源泄露。

### 6.2处理资源，如内存对象或网络连接
```python
class MyFile:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode

    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()

# 使用自定义上下文管理器处理文件资源
with MyFile("myfile.txt", "r") as file:
    contents = file.read()
    # 对文件内容进行处理
```
>在 with 语句块结束后，文件资源会自动关闭。

### 6.3处理线程
```python
import threading
import time

class MyThread:
    def __init__(self, name):
        self.name = name
        self.thread = threading.Thread(target=self.run)

    def __enter__(self):
        self.thread.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.thread.join()

    def run(self):
        # 线程的实际运行逻辑
        print(f'Thread {self.name} started')
        time.sleep(3)
        print(f'Thread {self.name} finished')

# 使用上下文管理器处理线程
with MyThread("Thread 1") as t1:
    print("Created Thread 1")
    time.sleep(1)
```
>在with语句块中，通过MyThread类的实例t1启动了一个线程，并在线程中执行了一些操作。在with语句块结束后，线程会自动运行完毕并资源会被释放。

### 6.4处理代理对象
```python
class MyProxy:
    def __init__(self, target_object):
        self.target_object = target_object

    def __enter__(self):
        # 在 __enter__() 方法中进行代理对象的初始化操作
        print("Initializing proxy")
        self.target_object.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # 在 __exit__() 方法中进行代理对象的资源释放操作
        print("Closing proxy")
        self.target_object.close()

# 模拟代理对象
class MyTargetObject:
    def connect(self):
        print("Connecting to target object")

    def do_something(self):
        print("Doing something")

    def close(self):
        print("Closing target object")

# 使用上下文管理器处理代理对象
with MyProxy(MyTargetObject()) as proxy:
    proxy.target_object.do_something()

print("Done")
```
>在 with 语句块中，通过MyProxy类的实例proxy获取了一个代理对象，并在代理对象上执行了操作。
>在 with语句块结束后，垃圾回收机制会自动调用__exit__()方法，从而进行代理对象的资源释放。