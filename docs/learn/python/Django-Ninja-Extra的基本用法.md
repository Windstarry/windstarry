---
title: Django-Ninja-Extra的基本用法
description: Django-Ninja-Extra的基本用法
date: 2024-1-26
recommend: 1
sticky: 1
tags:
 - python
 - 项目实战
 - Django
categories:
 - python
---

# Django-Ninja-Extra的基本用法
## 介绍
Django-Ninja-Extra是一个基于Django-Ninja的扩展，提供了基于类的方法和额外的功能，可以加快Django Ninja的RESTful API开发速度。

### 主要特点：
#### 所有 Django-Ninja 功能：
- 简单：设计为易于使用和直观。
- 快速执行：由于 Pydantic 和异步支持，性能非常高。
- 快速编码：键入提示和自动文档可让您仅关注业务逻辑。
- 基于标准：基于 API 的开放标准：OpenAPI（以前称为 Swagger）和 JSON Schema。
- Django 友好：（显然）与 Django 核心和 ORM 有很好的集成。
#### 额外：
- 基于类：以基于类的方式设计 API。
- 权限：通过在路由级别或控制器级别定义的权限和授权，轻松保护端点。
- 依赖注入：控制器类支持使用 python Injector 或 django_injector 进行依赖注入。使您能够将 API 可靠的服务注入 APIController 类，并在需要时使用它们
## 基本用法
### 安装
```shell
pip install django-ninja-extra
```
安装完成后添加ninja_extra到INSTALLED_APPS
```python
INSTALLED_APPS = [
    ...,
    'ninja_extra',
]
```
### 用法
在 django 项目中，在urls.py同目录下创建新文件：api.py
```python
from ninja_extra import NinjaExtraAPI, api_controller, http_get

api = NinjaExtraAPI()

# 传统方法
@api.get("/add", tags=['Math'])
def add(request, a: int, b: int):
    return {"result": a + b}

# 基于类的方法
@api_controller('/', tags=['Math'], permissions=[])
class MathAPI:

    @http_get('/subtract',)
    def subtract(self, a: int, b: int):
        """Subtracts a from b"""
        return {"result": a - b}

    @http_get('/divide',)
    def divide(self, a: int, b: int):
        """Divides a by b"""
        return {"result": a / b}

    @http_get('/multiple',)
    def multiple(self, a: int, b: int):
        """Multiples a with b"""
        return {"result": a * b}

api.register_controllers(
    MathAPI
)
```
在urls.py中添加路由
```python

from django.urls import path
from .api import api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),  # <---------- !
]
```
### 生成文档
转到 http://127.0.0.1:8000/api/docs, 可以看到Swagger UI生成的交互式文档