# CSS选择器

## 概述

CSS选择器用于从HTML文档的**DOM（文档对象模型）**树中**"筛选"**目标元素，为其绑定**预设**的**样式规则**。

**基本语法**：
```css
selector { 
    key: value; 
    ...
}
```

## 基本选择器

### 1. 通用选择器 `*`

- **作用**：适用于页面所有标签
- **语法**：`* { key: value; ... }`

```css
/* 清除所有元素的默认边距和内边距 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### 2. 标签选择器

- **作用**：适用于页面中特定的标签
- **语法**：`标签名 { key: value; ... }`

```css
/* 设置所有段落的样式 */
p {
    color: #333;
    line-height: 1.6;
}

/* 设置所有标题的样式 */
h1 {
    font-size: 2em;
    color: #2c3e50;
}
```

### 3. 类选择器

- **作用**：匹配所有带有**指定类名**的元素（一个类可作用于多个元素）
- **类名指定**：在HTML标签中指定`class`或`className`属性
- **语法**：`.类名 { key: value; ... }`

```html
<!-- HTML -->
<p class="highlight">重要段落</p>
<div class="container main">容器</div>
```

```css
/* CSS */
.highlight {
    background-color: yellow;
    font-weight: bold;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}
```

**注意**：一个标签可以指定多个类名：`class="class1 class2"`

### 4. ID选择器

- **作用**：匹配**唯一**带有**指定ID**的元素（HTML中**ID不可重复**）
- **语法**：`#id { key: value; ... }`

```html
<!-- HTML -->
<div id="header">页面头部</div>
```

```css
/* CSS */
#header {
    background-color: #f8f9fa;
    padding: 20px;
    border-bottom: 1px solid #dee2e6;
}
```

## 关系选择器

用于**限定**两个选择器的**关系**。

### 1. 并集选择器 `E, F`

- **含义**：**或** - `E`和`F`都应用此选择器

```css
/* 同时设置h1和h2的样式 */
h1, h2 {
    color: #2c3e50;
    font-family: Arial, sans-serif;
}
```

### 2. 交集选择器 `EF`

- **含义**：**且** - `E`和`F`都要符合才应用选择器

```css
/* 选择同时具有class="box"和class="red"的元素 */
.box.red {
    background-color: red;
}

/* 选择class="highlight"的p元素 */
p.highlight {
    background-color: yellow;
}
```

### 3. 后代选择器 `E F`

- **含义**：选择`E`的所有后代`F`元素

```css
/* 选择div内部的所有p元素 */
div p {
    margin-bottom: 10px;
}

/* 选择.container内部的所有.item元素 */
.container .item {
    padding: 15px;
}
```

### 4. 子代选择器 `E > F`

- **含义**：选择`E`的直接子`F`元素

```css
/* 只选择ul的直接子li元素 */
ul > li {
    list-style-type: disc;
}
```

### 5. 兄弟选择器 `E ~ F`

- **含义**：选择在`E`下方的同级的`F`元素

```css
/* 选择h2后面的所有同级p元素 */
h2 ~ p {
    color: #666;
}
```

### 6. 相邻兄弟选择器 `E + F`

- **含义**：选择在`E`下方的紧邻的`F`元素

```css
/* 选择h2后面紧邻的p元素 */
h2 + p {
    margin-top: 0;
    font-weight: bold;
}
```

## 属性选择器

### 基本属性选择器

```css
/* 选择具有title属性的元素 */
[title] {
    cursor: help;
}

/* 选择type="text"的input元素 */
input[type="text"] {
    border: 1px solid #ccc;
    padding: 8px;
}
```

### 高级属性选择器

- `E[attr~=val]`：以**空格**分隔的，其中**一个值**为`val`的属性
- `E[attr|=val]`：以连字符分隔的`-`，以`val-`开头的属性
- `E[attr^=val]`：以`val`开头的属性
- `E[attr$=val]`：以`val`结束的属性
- `E[attr*=val]`：包含`val`字符串的属性

```css
/* 选择class属性包含"button"的元素 */
[class~="button"] {
    display: inline-block;
}

/* 选择href以"https"开头的链接 */
a[href^="https"] {
    color: green;
}

/* 选择href以".pdf"结尾的链接 */
a[href$=".pdf"] {
    color: red;
}

/* 选择alt属性包含"logo"的图片 */
img[alt*="logo"] {
    max-width: 200px;
}
```

## 伪类选择器

### 结构相关伪类

```css
/* 选择第一个子元素 */
li:first-child {
    font-weight: bold;
}

/* 选择最后一个子元素 */
li:last-child {
    margin-bottom: 0;
}

/* 选择第n个子元素 */
li:nth-child(2) {
    color: red;
}

/* 选择奇数位置的子元素 */
tr:nth-child(odd) {
    background-color: #f9f9f9;
}

/* 选择偶数位置的子元素 */
tr:nth-child(even) {
    background-color: #ffffff;
}

/* 选择唯一子元素 */
p:only-child {
    text-align: center;
}

/* 选择同类型的第一个元素 */
h2:first-of-type {
    margin-top: 0;
}

/* 选择同类型的最后一个元素 */
h2:last-of-type {
    margin-bottom: 20px;
}

/* 选择同类型的第n个元素 */
p:nth-of-type(2) {
    font-style: italic;
}

/* 反选：不匹配指定选择器的元素 */
input:not([type="submit"]) {
    margin-bottom: 10px;
}

/* 选择没有任何子元素的元素 */
p:empty {
    display: none;
}

/* 选择当前锚点目标元素 */
:target {
    background-color: #ffff99;
}
```

### 交互状态伪类

```css
/* 鼠标悬停样式 */
button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

/* 鼠标按下样式 */
button:active {
    transform: translateY(0);
}

/* 获得焦点样式 */
input:focus {
    outline: 2px solid #007bff;
    border-color: #007bff;
}
```

### 链接状态伪类

```css
/* 未访问的链接 */
a:link {
    color: #007bff;
    text-decoration: none;
}

/* 已访问的链接 */
a:visited {
    color: #6c757d;
}
```

### 表单状态伪类

```css
/* 启用状态的表单元素 */
input:enabled {
    background-color: white;
}

/* 禁用状态的表单元素 */
input:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
}

/* 必填字段 */
input:required {
    border-left: 3px solid #dc3545;
}

/* 可选字段 */
input:optional {
    border-left: 3px solid #28a745;
}

/* 选中状态（单选框、复选框） */
input:checked {
    transform: scale(1.1);
}
```

## 伪元素选择器

伪元素允许开发者选中元素的**特定部分**或**创建虚拟元素**，而**无需修改HTML**结构。

### 必备属性：content

- 表示插入的内容，仅限`::before`和`::after`
- 即使不需要内容，也需设置`content: ""`，否则伪元素不会显示

### 常用伪元素

```css
/* 在元素内容前插入虚拟元素 */
.quote::before {
    content: "\201C"; /* 左双引号 */
    font-size: 1.2em;
    color: #666;
}

/* 在元素内容后插入虚拟元素 */
.quote::after {
    content: "\201D"; /* 右双引号 */
    font-size: 1.2em;
    color: #666;
}

/* 选中块级元素的第一个字符 */
p::first-letter {
    font-size: 2em;
    font-weight: bold;
    float: left;
    margin-right: 5px;
}

/* 选中块级元素的首行 */
p::first-line {
    font-weight: bold;
    color: #2c3e50;
}

/* 鼠标选中的文本样式 */
::selection {
    background-color: #007bff;
    color: white;
}

/* 火狐浏览器的选中文本样式 */
::-moz-selection {
    background-color: #007bff;
    color: white;
}

/* 列表标记样式 */
li::marker {
    color: #007bff;
    font-weight: bold;
}
```

## 选择器优先级

当多个选择器应用到同一元素时，按照以下优先级计算：

1. **内联样式**：1000
2. **ID选择器**：100
3. **类选择器、属性选择器、伪类**：10
4. **标签选择器、伪元素**：1
5. **通用选择器**：0

**示例**：
```css
/* 优先级：1 + 10 + 1 = 12 */
div.container p { }

/* 优先级：100 + 1 = 101 */
#header p { }

/* 优先级：10 + 10 = 20 */
.nav.active { }
```

## 实用技巧

### 1. 选择器组合使用

```css
/* 选择导航中的活跃链接 */
.nav a.active:hover {
    background-color: #007bff;
    color: white;
}

/* 选择表格中偶数行的单元格 */
table tr:nth-child(even) td {
    background-color: #f8f9fa;
}
```

### 2. 响应式设计中的选择器

```css
/* 移动端隐藏某些元素 */
@media (max-width: 768px) {
    .desktop-only {
        display: none;
    }
}
```

### 3. 表单验证样式

```css
/* 有效输入 */
input:valid {
    border-color: #28a745;
}

/* 无效输入 */
input:invalid {
    border-color: #dc3545;
}
```

### 4. 滚动条样式控制

由于不同浏览器对滚动条样式的支持不同，需要使用不同的选择器：

#### Webkit内核浏览器（Chrome、Safari、Edge）

```css
/* 滚动条整体样式 */
::-webkit-scrollbar {
    width: 12px; /* 垂直滚动条宽度 */
    height: 12px; /* 水平滚动条高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 6px;
    transition: background 0.3s ease;
}

/* 滚动条滑块悬停状态 */
::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 滚动条滑块激活状态 */
::-webkit-scrollbar-thumb:active {
    background: #787878;
}

/* 滚动条角落 */
::-webkit-scrollbar-corner {
    background: #f1f1f1;
}

/* 针对特定元素的滚动条 */
.custom-scroll::-webkit-scrollbar {
    width: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
}
```

#### Firefox浏览器

```css
/* Firefox滚动条样式（较新版本） */
.custom-scroll {
    scrollbar-width: thin; /* auto | thin | none */
    scrollbar-color: #c1c1c1 #f1f1f1; /* 滑块颜色 轨道颜色 */
}

/* 隐藏滚动条但保持滚动功能 */
.hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE和Edge */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none; /* Webkit内核浏览器 */
}
```

#### 跨浏览器兼容的滚动条样式

```css
/* 通用滚动条样式 */
.scrollable-container {
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #888 #f0f0f0;
    
    /* IE和Edge */
    -ms-overflow-style: -ms-autohiding-scrollbar;
}

/* Webkit内核浏览器 */
.scrollable-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    transition: background 0.2s;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* 自定义主题滚动条 */
.dark-theme::-webkit-scrollbar-track {
    background: #2d2d2d;
}

.dark-theme::-webkit-scrollbar-thumb {
    background: #555;
}

.dark-theme::-webkit-scrollbar-thumb:hover {
    background: #777;
}

.dark-theme {
    scrollbar-color: #555 #2d2d2d;
}
```