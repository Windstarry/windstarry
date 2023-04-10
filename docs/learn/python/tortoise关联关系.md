---
title: tortoise关联关系
description: tortoise 关联关系（外键、多对多）相关问题
date: 2023-4-10
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
# tortoise 关联关系（外键、多对多）相关问题
主要介绍在**tortoise-orm**中使用pydantic_model_creator创建Pydantic时,关联关系出现的一些问题、关联字段丢失、继承失败等
## 使用全局初始化关联关系
全局初始化会使所有模型的外键、一对多、多对多等关系自动建立，这个适用于关联关系简单的数据库表。
- 优点：简单易用，不用手动简历关联关系
- 缺点：适用于简单关联关系表，自定义关系字段时比较麻烦，需要手动exclude排除多余的关联字段  
  
实现方法如下,在**setting.py**中数据库配置：
```python
DATABASE_CONFIG = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.mysql",
            "credentials": {
                "host": os.getenv("DATABASE_HOST", PROJECT_CONFIG["database"]["host"]),
                # FS_DATABASE_HOST 数据库名称环境变量根据需求修改
                "port": int(os.getenv("DATABASE_PORT", PROJECT_CONFIG["database"]["port"])),
                "user": os.getenv("DATABASE_USER", PROJECT_CONFIG["database"]["user"]),
                "password": os.getenv("DATABASE_PASSWORD", PROJECT_CONFIG["database"]["password"]),
                "database": os.getenv("DATABASE_NAME", PROJECT_CONFIG["database"]["db_name"]),
                "minsize": PROJECT_CONFIG["database"]["minsize"],
                "maxsize": PROJECT_CONFIG["database"]["maxsize"],
                "charset": "utf8mb4",
                "pool_recycle": PROJECT_CONFIG["database"]["pool_recycle"],
            }
        },

    },
    "apps": {
        # 1.注意此处的app代表的并不与FastAPI的routers对应，为Tortoise中的app概念
        # 2.在Tortoise-orm使用外键时，需要用到该app名称来指执行模型，"app.model"，所以同一个app中不要出现名称相同的两个模型类
        # 3.app的划分结合 规则2与实际情况进行划分即可
        "cp_model": {
            "models": [
                "src.faster.database.models",
            ],
            "default_connection": "default",
        },
    },
    "routers": ["src.my_tools.tortoise_tools.routers.WriteOrReadRouter"],
    #设置数据库总是存储utc时间
    "use_tz": True,
    # "timezone": DEFAULT_TIMEZONE,  # 设置时区转换，即从数据库取出utc时间后会被转换为timezone所指定的时区时间（待验证）
    "timezone": LOCAL_TIMEZONE,
}
```
在routers的**init.py**中最上面写这行初始化代码：
```python
from src.settings import DATABASE_CONFIG
from tortoise import Tortoise

# 在模型schema初始化前，调用外键关联
# 1.这将调用Tortoise子带的外键关联，如果想自定义外键关联的字段，需要自己写Pydantic
# 2.如果想偷懒只要能返回外键关联信息，则使用此方法

Tortoise.init_models(DATABASE_CONFIG["apps"]["cp_model"]["models"], "cp_model")
```
:::tip 重要提示
若需要自动生成外键关联，则需要在模型schema初始化前，调用外键关联。也就是要在导入各个routers之前初始化关联关系，否则会无效。
:::
## 自定义关联关系字段
在创建Pydantic时，用户可以根据表字段的关联关系自定义。适合复杂关系表的Pydantic建立关联字段。
这个时候需要注释掉上面的自动关联关系的初始化代码。
拿一个论坛项目的几张表做例子，先举例数据模型：
```python
class Post(models.Model):
    """岗位表"""
    id = fields.CharField(max_length=50, pk=True)
    name = fields.CharField(max_length=32, null=False, default="")

class Department(AbstractDefaultColumn):
    """部门表"""
    id = fields.CharField(max_length=50, pk=True)
    name = fields.CharField(max_length=64, help_text='部门名')

class User(models.Model):
    """用户表"""
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=32, index=True)
    phone_no = fields.CharField(max_length=32, unique=True)
    email = fields.CharField(max_length=32, null=True)
    department = fields.ForeignKeyField("cp_model.Department", on_delete=fields.SET_NULL, null=True,
                                        related_name="depart_users", help_text='所属部门')
    post = fields.ForeignKeyField("cp_model.Post", on_delete=fields.SET_NULL, null=True, related_name="post_users",
                                  help_text='岗位')

class ForumArticle(AbstractDefaultColumn):
    """文章"""
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("cp_model.User", on_delete=fields.CASCADE)
    title = fields.CharField(max_length=32, default='', null=True)  # 文章标题
    content = fields.TextField(default='', null=True, blank=True)  # 文章正文
    tags = fields.ManyToManyField('cp_model.ArticleTag', related_name='tags_article',
                                  through="cp_forum_article_tags",
                                  forward_key="cp_tag_id",
                                  backward_key="cp_forum_article_id"
                                  )  # 标签

    posters = fields.ManyToManyField("cp_model.CPImage", related_name="posters_article",
                                     through="cp_forum_article_posters",
                                     forward_key="cp_image_id",
                                     backward_key="cp_forum_article_id"
                                     )

class ArticleComment(AbstractDefaultColumn):
    """评论"""
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("cp_model.User", related_name="user_comments", on_delete=fields.CASCADE)
    to_user_id = fields.IntField(default=0)  # 回复用户的id
    to_user_name = fields.CharField(max_length=32, default="", null=True, blank=True)  # 回复用户的name
    article = fields.ForeignKeyField("cp_model.ForumArticle", on_delete=fields.SET_NULL, null=True,
                                     related_name="article_comments")

class ArticleUpvoteRecord(AbstractDefaultColumn):
    """用户论坛文章的点赞记录"""
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("cp_model.User", related_name="user_article_upvotes", on_delete=fields.CASCADE)
    article = fields.ForeignKeyField("cp_model.ForumArticle", related_name="article_upvotes", on_delete=fields.CASCADE)
  
```
### 外键关系
:::tip
- 如果模型字段比较多，但是序列化给前端只要几个字段，可以通过include添加字段，只会序列化include里面的字段和Pydantic里面用户自己添加的字段。
- 如果模型字段比较少，就可以通过exclude来排除不需要的字段，会序列化模型所有字段除去exclude里面的字段。exclude和include都不写就序列化模型所有的字段。
:::
用户Pyandtic:
```python
class PostSimpleSchema(pydantic_model_creator(Post, name="PostSimpleSchema", exclude=())):
    """职位"""
    pass

class UserSimpleSchema(
    pydantic_model_creator(
        User, name="UserSimpleSchema", include=("id", "name", "image", "post")
   )
):
    """简单展示用户信息，通过include只会序列化这四个字段"""
    id: int
    name: str
    image: str = None
    post: PostSimpleSchema = None   # 外键岗位字段关系序列化
    pass
```

### 外键反向查询（多对一）和m2m（多对多）
- 多对一关系，可以直接根据关联关系名，related_name，来指定,比如下面评论表的帖子信息`article: CommentArticleSchema = None`;
- 多对多可以用List[]来指定,比如下面`posters: List[ImageSimpleSchema] = None`;
```python
class CommentArticleSchema(
    pydantic_model_creator(ForumArticle,
                           name="CommentArticleSchema",
                           exclude=("article_comments", ), exclude_readonly=True)
):
    """帖子"""
    user: UserSimpleSchema = Field(description="发帖人")
    posters: List[ImageSimpleSchema] = None
    id: int
    pass

class CommentBaseSchema(
    pydantic_model_creator(ArticleComment,
                           name="CommentSimpleSchema",
                           exclude=("write_date", "upvote_score",))
):
    """评论"""
    user: UserSimpleSchema = Field(description="评论人")
    posters: List[ImageSimpleSchema] = None

class CommentListSchema(CommentBaseSchema):
    """用于帖子列表里面的评论"""
    user: UserSimpleSchema = Field(description="评论人")
    posters: List[ImageSimpleSchema] = None
    parent_comment: CommentBaseSchema = None  # 父评论
    article: CommentArticleSchema = None
    anonymous_user: AnonymousUserSimpleSchema = None
```
:::tip
Pydantic继承会有一些问题，关联关系会继承失败，所以需要在子类重新声明一下关联关系字段
:::