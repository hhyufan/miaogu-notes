# CSS盒子模型

## 概述

CSS盒子模型是网页布局的基础概念，每个HTML元素都可以看作一个矩形的盒子。理解盒子模型对于掌握CSS布局至关重要。

## 五大要素

CSS盒子模型由五个主要部分组成：

1. **内容（Content）** - 元素的实际内容
2. **高度（height）** - 内容区域的高度
3. **宽度（width）** - 内容区域的宽度
4. **内边距（padding）** - 内容与边框之间的空白
5. **边框（border）** - 围绕内容和内边距的边界
6. **外边距（margin）** - 边框外部的空白区域

```box
┌─────────────────────────────────────┐
│              margin                 │
│  ┌───────────────────────────────┐  │
│  │           border              │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │        padding          │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │     content       │  │  │  │
│  │  │  │   width × height  │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 宽度和高度

### 基本语法

```css
width: 值;
height: 值;
```

### 单位类型

- **具体像素**: 固定尺寸
- **百分比**: 相对于父容器宽高的百分比

### 示例

```css
.box {
    width: 300px;        /* 固定宽度 */
    height: 200px;       /* 固定高度 */
}

.responsive-box {
    width: 80%;          /* 父容器宽度的80% */
    height: 50%;         /* 父容器高度的50% */
}
```

## 边框（Border）

### 边框三要素

1. **边框宽度（border-width）**
2. **边框颜色（border-color）**
3. **边框样式（border-style）**

### 边框样式

- **solid**: 实线
- **dashed**: 虚线
- **dotted**: 圆点线
- **none**: 无边框

### 边框简写

```css
border: 宽度 样式 颜色;
```

### 示例

```css
.border-example {
    border-width: 2px;
    border-style: solid;
    border-color: #333;
  
    /* 简写形式 */
    border: 2px solid #333;
}
```

### 方向边框

可以单独设置四个方向的边框：

- **border-top**: 上边框
- **border-right**: 右边框
- **border-bottom**: 下边框
- **border-left**: 左边框

```css
.directional-border {
    border-top: 1px solid red;
    border-right: 2px dashed blue;
    border-bottom: 3px dotted green;
    border-left: 4px solid orange;
}
```

### 更细粒度的控制

```css
.detailed-border {
    border-top-width: 1px;
    border-top-color: red;
    border-top-style: solid;
}
```

### 圆角边框

```css
border-radius: 上 右 下 左;
```

```css
.rounded-box {
    border-radius: 10px;           /* 四个角都是10px */
    border-radius: 10px 20px;      /* 上下10px，左右20px */
    border-radius: 10px 20px 30px; /* 上10px，左右20px，下30px */
    border-radius: 10px 20px 30px 40px; /* 上10px，右20px，下30px，左40px */
}
```

### 边框阴影

```css
box-shadow: 水平偏移量 垂直偏移量 模糊度 阴影颜色;
```

```css
.shadow-box {
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

## 轮廓（Outline）

轮廓与边框类似，但不占用空间，不影响元素的尺寸和位置。

### 设置方式

轮廓的设置方式和边框**完全一致**：

```css
.outline-example {
    outline-width: 2px;
    outline-style: solid;
    outline-color: blue;
  
    /* 简写形式 */
    outline: 2px solid blue;
}
```

### 轮廓与边框的区别

- 轮廓不占用空间
- 轮廓不能单独设置四个方向
- 轮廓通常用于焦点状态

## 边距

### 内边距（Padding）

#### 定义

边框与内容间的空白区域。

#### 特点

- 增加元素实际占用空间（除非使用 `box-sizing: border-box`）
- 继承父元素的背景色
- 不能为负值

#### 单位

- **px**: 像素
- **%**: 百分比（相对于父容器宽度）
- **em**: 相对于当前元素字体大小

#### 简写语法

```css
padding: 上 右 下 左;
```

#### 简写规则

```css
padding: 10px;                    /* 四个方向都是10px */
padding: 10px 20px;               /* 上下10px，左右20px */
padding: 10px 20px 30px;          /* 上10px，左右20px，下30px */
padding: 10px 20px 30px 40px;     /* 上10px，右20px，下30px，左40px */
```

#### 方向属性

```css
.padding-example {
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 15px;
    padding-left: 25px;
}
```

### 外边距（Margin）

#### 定义

边框与相邻元素或父容器的空白区域。

#### 特点

- 不增加元素自身尺寸
- 垂直方向相邻元素外边距会合并（margin collapse）
- 可以为负值
- `auto` 可用于水平居中

#### 简写语法

```css
margin: 上 右 下 左;
```

#### 简写规则

```css
margin: 10px;                     /* 四个方向都是10px */
margin: 10px 20px;                /* 上下10px，左右20px */
margin: 10px 20px 30px;           /* 上10px，左右20px，下30px */
margin: 10px 20px 30px 40px;      /* 上10px，右20px，下30px，左40px */
```

#### 方向属性

```css
.margin-example {
    margin-top: 10px;
    margin-right: 20px;
    margin-bottom: 15px;
    margin-left: 25px;
}
```

#### 水平居中

```css
.center-box {
    width: 300px;
    margin: 0 auto;    /* 水平居中 */
}
```

#### 外边距合并

```css
.box1 {
    margin-bottom: 20px;
}

.box2 {
    margin-top: 30px;
}
/* 实际间距是30px，不是50px */
```

## 溢出处理（Overflow）

当内容超出容器尺寸时的处理方式：

### 属性值

- **visible**: 默认值，内容溢出可见
- **hidden**: 隐藏溢出内容
- **scroll**: 始终显示滚动条
- **auto**: 需要时自动显示滚动条

### 示例

```css
.overflow-example {
    width: 200px;
    height: 100px;
    overflow: hidden;     /* 隐藏溢出内容 */
}

.scroll-box {
    width: 200px;
    height: 100px;
    overflow: auto;       /* 自动滚动 */
}
```

### 分别控制水平和垂直方向

```css
.overflow-control {
    overflow-x: hidden;   /* 水平方向隐藏 */
    overflow-y: scroll;   /* 垂直方向滚动 */
}
```

## Box-Sizing 属性

控制盒子模型的计算方式：

### content-box（默认）

宽度和高度只包含内容区域：

```css
.content-box {
    box-sizing: content-box;
    width: 200px;
    padding: 20px;
    border: 5px solid #333;
    /* 实际宽度 = 200 + 20*2 + 5*2 = 250px */
}
```

### border-box

宽度和高度包含内容、内边距和边框：

```css
.border-box {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 5px solid #333;
    /* 实际宽度 = 200px，内容宽度 = 200 - 20*2 - 5*2 = 150px */
}
```

## 实践示例

### 完整的盒子模型示例

```css
.complete-box {
    /* 尺寸 */
    width: 300px;
    height: 200px;
  
    /* 内边距 */
    padding: 20px;
  
    /* 边框 */
    border: 2px solid #333;
    border-radius: 10px;
  
    /* 外边距 */
    margin: 20px auto;
  
    /* 背景 */
    background-color: #f0f0f0;
  
    /* 溢出处理 */
    overflow: auto;
  
    /* 盒子模型 */
    box-sizing: border-box;
  
    /* 阴影 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

### 响应式盒子

```css
.responsive-box {
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    padding: 5%;
    margin: 0 auto;
    box-sizing: border-box;
}
```

## 常见问题和解决方案

### 1. 外边距合并

```css
/* 问题：垂直外边距合并 */
.item {
    margin: 20px 0;
}

/* 解决方案：使用padding或border */
.item {
    padding: 20px 0;
}
```

### 2. 盒子尺寸计算

```css
/* 推荐：使用border-box */
* {
    box-sizing: border-box;
}
```

### 3. 水平居中

```css
/* 块级元素水平居中 */
.center {
    width: 300px;
    margin: 0 auto;
}

/* 行内元素水平居中 */
.text-center {
    text-align: center;
}
```

## 总结

CSS盒子模型是网页布局的基础，掌握以下要点：

1. **理解五大要素**：内容、宽高、内边距、边框、外边距
2. **合理使用box-sizing**：推荐使用 `border-box`
3. **注意外边距合并**：垂直方向的外边距会合并
4. **灵活运用溢出处理**：根据需求选择合适的overflow值
5. **善用简写属性**：提高代码效率和可读性

理解并熟练运用盒子模型，是成为优秀前端开发者的必备技能。
