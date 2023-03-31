---
title: python入门实例
description: python入门实例
date: 2023-3-31
recommend: 1
sticky: 3
tags:
 - python
 - 项目实战
categories:
 - python
---
# Python入门编程实战

## 两数之和

```python
number1 = 123
number2 = 456

sum = number1 + number2
// f 代表在字符串中间可以写变量
print(f"{number1} + {number2} = {sum}")
```

## 统计学生成绩的最高，最低，平均分

```python
"""
输入文件：
三列：学号、姓名、成绩
列之间用逗号分割，比如"101,小冉,88"
行之间用\n换行分割
输出：最高分、最低分、平均分
"""
def computer_score():
    scores = []
    with open("./student_grade_input.txt", encoding="utf-8") as fin:
        for line in fin:
            # 去掉最后的换行符
            line = line[:-1]
            # split 通过指定分隔符对字符串进行切片,以","分割
            fields = line.split(",")
            # 取成绩那一栏数据,在数据中是最后一行,所以是-1
            scores.append(int(fields[-1]))
    max_score = max(scores)
    min_score = min(scores)
    avg_score = round(sum(scores) / len(scores), 2)
    return max_score, min_score, avg_scoremax_score, min_score, avg_score = computer_score()if name == 'main':
    print(f"max_score:{max_score}, min_score:{min_score}, avg_score:{avg_score}")
```

## 统计英语文章每个单词的出现次数

```python
pyword_count = {}with open("./demo.txt", encoding='utf-8') as fin:
    for line in fin:
        line = line[:-1]
        # .split() 通过指定分隔符对符合进行切片
        words = line.split()
        for word in words:
            if word not in word_count:
                word_count[word] = 0
            word_count[word] += 1print(
    # sorted进行排序
    sorted(word_count.items(),
           key=lambda x: x[1],
           reverse=True
           )[:10]
)
```

## 获取目录的大小

```python

import os

print(os.path.getsize("./demo.txt"))

sum_size = 0
for file in os.listdir("."):
    # os.path.isfile() 判断对象是否为文件
    if os.path.isfile(file):
        # os.path.getsize() 指定获取路径path下的文件大小，以字节为单位
        sum_size += os.path.getsize(file)

print("所有文件大小：", sum_size / 1000)
```
