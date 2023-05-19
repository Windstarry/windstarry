---
title: tortoise-orm入门之单表常用操作
description: tortoise-orm入门之单表常用操作
date: 2023-5-19
recommend: 1
sticky: 3
tags:
 - python
 - 项目实战
 - tortoise
 - fastapi
categories:
 - python
---
# tortoise-orm入门之单表常用操作

## 创建用户模型
- 在创建模型类时，把一些公共的字段抽离出来，用继承方式重复利用。
- 如果模型类型的字段与数据库字不一样时候，可以通过source_field指定。
- Meta定义表的元数据信息，例如：表名，表描述信息等等

```python
#models.py
class MixinTimeFiled:

    # 添加数据时间
    created = fields.DatetimeField(null=True, auto_now_add=True)
    # 修改数据时间
    modified = fields.DatetimeField(null=True, auto_now=True)

class userModel(MixinTimeFiled,Model):

    id = fields.BigIntField(pk=True,description="用户ID",index=True,source_field="user_id")
    name = fields.CharField(max_length=100,description="用户名",source_field="name")
    phone = fields.CharField(max_length=11,description="电话号")
    idcard =fields.CharField(max_length=18,description="身份号")
    birthDate = fields.CharField(max_length=18,description="出生年月")
    email = fields.CharField(max_length=50,description="邮箱地址")
    address = fields.CharField(max_length=200,description="地址信息")

  
    class Meta:
        table = "users"
```
关于各字段的用法查看[官方文档](https://tortoise.github.io/fields.html#tortoise.models.Model.in_bulk)

## 配置数据库相关信息

```python
async def init():
    await Tortoise.init(
        db_url='mysql://didiplus:didiplus558@192.168.0.220:3306/tortoise',
        modules={'models': ['models']}

    )
    # Generate the schema
    await Tortoise.generate_schemas()  # safe：仅在表不存在时创建表
```
## 增(Create)
Tortoise ORM 模型提供了create方法，通过查看源码create方法实际上也是调用了save方法。所以，有两种方式添加数据。

![图片](./images/7bf174c3fb457543d7356c5e659046b9c1e6e2f8eb91c43dd8a432952c815952.png)  

可以使用Faker这个库去模拟用户数据，具体的用法请参考这篇[文章](https://juejin.cn/post/7064457994540417038)

### 1.save 方法新增数据：
通过实例化用户模型类的方式，调用save方式创建数据，核心代码如下：

```python

fake = Faker(["zh_CN"])
id_card = fake.ssn()
async def add():
    user = userModel(
        name=fake.name(),
        phone = fake.phone_number(),
        idcard = fake.ssn(),
        birthDate = id_card[6:14],
        email = fake.email(),
        address = fake.address()
    )
    return  await user.save()
```
由于Tortoise ORM采用了异步编程方式，所以，需要通过run_async函数去调用add方式.核心代码如下：

```python

if __name__ == "__main__":
    run_async(init()) #连接数据库
    run_async(add())
```
### 2.create方法新增数据
直接通过用户模型类赋值方式，然后调用create方法。核心代码如下：

```python
async def add2():
    return await userModel().create(
        name=fake.name(),
        phone = fake.phone_number(),
        idcard = fake.ssn(),
        birthDate = id_card[6:14],
        email = fake.email(),
        address = fake.address()
    )
```
执行之后，数据库会生成两条数据，如下图：
![图 4](./images/a67fb7595f9d4fbe8887a1bf8b9bffc9310f243894defca1e3b3d99f130bcb4b.png)  

### 3.批量添加数据
Tortoise ORM模型类中也封装了批量新增数据的函数bulk_create。
通过观察源码的注解，该方法调用方式，只要传入一个list列表，列表里的元素是user模型对象即可。

```python
async def bulk_add():
    usersList =[]
    for _ in range(0,10):
        id_card = fake.ssn()
        user = userModel(
            name=fake.name(),
            phone = fake.phone_number(),
            idcard = fake.ssn(),
            birthDate = id_card[6:14],
            email = fake.email(),
            address = fake.address()
        )
        usersList.append(user)
    return await userModel.bulk_create(usersList)
```
先通过一个for循环生成11个userModel对象，然后中通过调userModel的bulk_create方法，把这个11个用户信息写入数据库中。

![图 3](./images/0a564d4d2af312d8076dc3ef08aafdfa800bfa34af2694ef86c1b42231c2e4e6.png)  


## 删除(Delete)
Tortoise ORM模型类中封装了Delete方法，通过过来查询出要删除的对象，然后再调用delete方法。核心代码如下：

```python
#删除ID为1的数据，返回的是被改的行数
async def deleteById(id):
    return await userModel.filter(id=id).delete()
```
Tortoise ORM模型中没有封装批量删除的方式，后续可以根据自己的业务情况自行封装。

## 修改(update)
Tortoise ORM模型中封装了几个有关更新的方法，分别是update_from_dict、update_or_create、update。其中update是通过filter查询对象，再更新相应的字段。

```python
async def update():
    return await userModel.filter(id=2).update(address=fake.address())
```
## 查看(select)
### 1.all
```python
#查询所有，返回是用户模型对象[<userModel: 2>,...]
await userModel.all() 
#过滤需要的字段，返回dict对象
await userModel.all().values("id","name")
await userModel.all().order_by("-created") #排序，-是降序
#分页查询
await userModel.all().offset(2).limit(5)
```
### 2.get
```python
#根据条件查询符合的对象，条件需唯一 return UserModel
await userModel.get(id=13) 
#查询不到返回None，避免出现对象不存在的异常
await userModel.get_or_none(id=15)
```
### 3.filter 条件过滤
其实filter的用法和get的差不多，都是通过条件过滤。

```python
# 获取第一个符合条件的 return UserModel
await userModel.filter(name="林超").first()
# 获取原生sql
userModel.filter(name="林超").sql()
```

### 原生SQL
在项目中有时候可能需要执行原生的SQL语言。可以使用下面的方式执行：

```python
async def executSQL(sql):
    conn = connections.get("default")
    res= await conn.execute_query_dict(sql)
    return res
```

## filter Q
在使用之前先执行如下代码引入依赖

```python
from tortoise.models import Q
await userModel.filter(Q(name="蒋洁",id=13,join_type="OR")).all()
```
关于Q的更多用法请查阅[官方文档](https://tortoise.github.io/expressions.html?h=q#tortoise.models.Model.in_bulk)