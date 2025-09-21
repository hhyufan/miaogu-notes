# CSS元素显示

## 概述

CSS元素显示控制着HTML元素在页面中的显示方式和行为。理解不同的显示类型对于网页布局和设计至关重要。

## 显示分类

### 块级元素（Block）

#### 特点
- **独占一行**：每个块级元素都会在新的一行开始
- **可以设置宽高**：可以通过CSS设置width和height属性
- **默认宽度**：占满父容器的整个宽度

#### 常见的块级元素
- `div` - 通用容器
- `p` - 段落
- `ul` - 无序列表
- `ol` - 有序列表
- `li` - 列表项
- `h1-h6` - 标题
- `form` - 表单

#### 示例
```css
.block-element {
    display: block;
    width: 300px;
    height: 100px;
    background-color: #f0f0f0;
    margin: 10px 0;
}
```

### 行级元素（Inline）

#### 特点
- **共享一行**：多个行级元素可以在同一行显示
- **无法设置宽高**：width和height属性无效
- **内容决定尺寸**：元素的尺寸由内容决定

#### 常见的行级元素
- `span` - 通用行级容器
- `a` - 超链接
- `strong` - 强调（粗体）
- `em` - 强调（斜体）
- `b` - 粗体
- `i` - 斜体
- `u` - 下划线

#### 示例
```css
.inline-element {
    display: inline;
    /* width和height无效 */
    background-color: yellow;
    padding: 5px;
}
```

### 行内块级元素（Inline-Block）

#### 特点
- **共享一行**：可以与其他元素在同一行显示
- **可以设置宽高**：支持width和height属性
- **结合两者优点**：既能排列在一行，又能控制尺寸

#### 常见的行内块级元素
- `img` - 图像
- `input` - 输入框
- `button` - 按钮

#### 示例
```css
.inline-block-element {
    display: inline-block;
    width: 100px;
    height: 50px;
    background-color: #ccc;
    margin: 5px;
    vertical-align: top;
}
```

## 设置显示方式

### display 属性

通过 `display` 属性可以改变元素的显示类型：

```css
/* 设置为块级元素 */
.make-block {
    display: block;
}

/* 设置为行级元素 */
.make-inline {
    display: inline;
}

/* 设置为行内块级元素 */
.make-inline-block {
    display: inline-block;
}
```

### 实际应用示例

#### 导航菜单
```css
/* 将列表项设置为行内块级，实现水平导航 */
.nav li {
    display: inline-block;
    margin-right: 20px;
}

.nav a {
    display: block;
    padding: 10px 15px;
    text-decoration: none;
}
```

#### 按钮组
```css
.button-group .btn {
    display: inline-block;
    width: 100px;
    height: 40px;
    margin-right: 10px;
}
```

## 隐藏元素

### display: none

#### 特点
- **完全隐藏**：元素不显示且不占用空间
- **原有位置不保留**：其他元素会填补空白
- **不可交互**：隐藏的元素无法接收事件

#### 示例
```css
.hidden-display {
    display: none;
}
```

#### 应用场景
- 模态框的显示/隐藏
- 响应式设计中隐藏某些元素
- JavaScript控制的动态显示

### visibility: hidden

#### 特点
- **视觉隐藏**：元素不可见但仍占用空间
- **原有位置保留**：布局不会发生变化
- **不可交互**：隐藏的元素无法接收事件

#### 示例
```css
.hidden-visibility {
    visibility: hidden;
}

/* 显示 */
.visible {
    visibility: visible;
}
```

#### 应用场景
- 保持布局稳定的隐藏效果
- 动画过渡效果
- 占位符元素

### 两种隐藏方式的对比

| 属性 | display: none | visibility: hidden |
|------|---------------|-------------------|
| 占用空间 | 不占用 | 占用 |
| 布局影响 | 影响布局 | 不影响布局 |
| 子元素 | 全部隐藏 | 可单独设置显示 |
| 性能 | 可能触发重排 | 只触发重绘 |

## 2D转换

### 概述
CSS 2D转换允许对元素进行移动、旋转、缩放和倾斜等变换操作。

### 设置方式

#### 方法1：transform 属性
```css
.transform-element {
    transform: 转换函数;
}
```

#### 方法2：单独的转换属性
```css
.transform-element {
    转换函数名: 转换函数参数;
}
```

### 转换函数

#### translate（位移）

##### translateX() 和 translateY()
```css
.translate-x {
    transform: translateX(50px);    /* 水平向右移动50px */
}

.translate-y {
    transform: translateY(-30px);   /* 垂直向上移动30px */
}
```

##### translate()
```css
.translate-xy {
    transform: translate(50px, -30px);  /* x轴50px，y轴-30px */
    transform: translate(50px);         /* 只设置x轴，y轴默认为0 */
}
```

##### 实际应用
```css
/* 元素居中 */
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

#### rotate（旋转）

##### rotate()
```css
.rotate-element {
    transform: rotate(45deg);       /* 顺时针旋转45度 */
    transform: rotate(-90deg);      /* 逆时针旋转90度 */
}
```

##### rotateX() 和 rotateY()
```css
.rotate-x {
    transform: rotateX(45deg);      /* 沿x轴旋转，宽度视觉变小 */
}

.rotate-y {
    transform: rotateY(45deg);      /* 沿y轴旋转，高度视觉变小 */
}
```

##### 实际应用
```css
/* 悬停旋转效果 */
.card:hover {
    transform: rotate(5deg);
    transition: transform 0.3s ease;
}
```

#### scale（缩放）

##### 特点
- **始终以中心位置缩放**
- **值大于1放大，小于1缩小**
- **值为负数会翻转元素**

##### scaleX() 和 scaleY()
```css
.scale-x {
    transform: scaleX(1.5);         /* 水平方向放大1.5倍 */
}

.scale-y {
    transform: scaleY(0.8);         /* 垂直方向缩小到0.8倍 */
}
```

##### scale()
```css
.scale-uniform {
    transform: scale(1.2);          /* 等比例放大1.2倍 */
}

.scale-different {
    transform: scale(1.5, 0.8);     /* x轴1.5倍，y轴0.8倍 */
}
```

##### 实际应用
```css
/* 悬停放大效果 */
.image:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
```

#### skew（倾斜）

##### skewX() 和 skewY()
```css
.skew-x {
    transform: skewX(15deg);        /* 沿x轴倾斜15度 */
}

.skew-y {
    transform: skewY(-10deg);       /* 沿y轴倾斜-10度 */
}
```

##### skew()
```css
.skew-both {
    transform: skew(15deg, -10deg); /* x轴15度，y轴-10度 */
}
```

### 组合变换

#### 多个变换函数
```css
.complex-transform {
    transform: translate(50px, 100px) rotate(45deg) scale(1.2);
}
```

#### 变换顺序的重要性
```css
/* 不同的顺序会产生不同的效果 */
.order1 {
    transform: rotate(45deg) translate(100px, 0);
}

.order2 {
    transform: translate(100px, 0) rotate(45deg);
}
```

### 变换原点

#### transform-origin
```css
.transform-origin {
    transform-origin: center center;    /* 默认值 */
    transform-origin: top left;         /* 左上角 */
    transform-origin: 50px 100px;       /* 具体坐标 */
    transform-origin: 25% 75%;          /* 百分比 */
}
```

## CSS3前缀

### 浏览器兼容性
CSS3的某些特性在不同浏览器中需要添加前缀以确保兼容性。

### 主流浏览器前缀
- **Chrome**: `-webkit-`
- **Firefox**: `-moz-`
- **IE、Edge**: `-ms-`
- **Opera**: `-o-`

### 使用示例
```css
.prefixed-transform {
    -webkit-transform: rotate(45deg);   /* Chrome, Safari */
    -moz-transform: rotate(45deg);      /* Firefox */
    -ms-transform: rotate(45deg);       /* IE, Edge */
    -o-transform: rotate(45deg);        /* Opera */
    transform: rotate(45deg);           /* 标准语法 */
}

.prefixed-transition {
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
}
```