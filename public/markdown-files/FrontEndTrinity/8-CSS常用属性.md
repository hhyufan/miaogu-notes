# CSS常用属性

## 颜色

### 颜色属性
- **color**: 表示颜色（通常为字体颜色）
- **border-color**: 边框颜色
- **background-color**: 背景颜色

### 颜色表示方式

#### 1. 纯英文
```css
color: red;
color: blue;
color: green;
```

#### 2. RGB
- **语法**: `rgb(red, green, blue)`
- **说明**: 红（Red）、绿（Green）、蓝（Blue）
- **取值范围**: 0-255

```css
color: rgb(255, 0, 0);    /* 红色 */
color: rgb(0, 255, 0);    /* 绿色 */
color: rgb(0, 0, 255);    /* 蓝色 */
```

#### 3. RGBA
- **语法**: `rgba(red, green, blue, alpha)`
- **说明**: alpha 范围是 0~1，控制透明度

```css
color: rgba(255, 0, 0, 0.5);    /* 半透明红色 */
color: rgba(0, 0, 0, 0.8);      /* 80% 不透明黑色 */
```

#### 4. 十六进制
- **组成**: 0~9, a~f
- **使用**: `#` 表示
- **6位形式**: `#RRGGBB`
- **3位形式**: `#RGB`

```css
color: #FF0000;    /* 红色 */
color: #00FF00;    /* 绿色 */
color: #F00;       /* 红色简写 */
```

## 字体

### font-style（字体样式）
- **normal**: 常规
- **italic**: 斜体
- **oblique**: 倾斜

```css
font-style: normal;
font-style: italic;
font-style: oblique;
```

### font-weight（字体粗细）
- **normal**: 常规
- **bold**: 加粗
- **bolder**: 比父元素更粗
- **lighter**: 比父元素更细
- **100-900**: 数值（100最细，900最粗，常用 400/700 对应正常/加粗）
- **百分比**: 相对于父元素

```css
font-weight: normal;
font-weight: bold;
font-weight: 400;    /* 等同于 normal */
font-weight: 700;    /* 等同于 bold */
```

### 其他字体属性
- **font-size**: 字体大小（如：16px）
- **line-height**: 行高（如：1.5）
- **font-family**: 字体族（如："Microsoft YaHei", sans-serif）

### font 简写属性
同时设置多个字体样式：
```css
font: [font-style] [font-variant] [font-weight] <font-size>[/<line-height>] <font-family>;
```

示例：
```css
font: italic bold 16px/1.5 "Arial", sans-serif;
```

## 文本

### text-decoration（文本修饰）
- **overline**: 上划线
- **underline**: 下划线
- **line-through**: 穿越线
- **none**: 无修饰线

```css
text-decoration: underline;
text-decoration: line-through;
text-decoration: none;
```

### text-transform（文本转换）
英文大小写转换：
- **uppercase**: 大写
- **lowercase**: 小写
- **capitalize**: 单词首字母大写

```css
text-transform: uppercase;
text-transform: lowercase;
text-transform: capitalize;
```

### text-align（文本对齐）
文本水平方向对齐方式：
- **left**: 居左（默认）
- **center**: 居中
- **right**: 居右

```css
text-align: left;
text-align: center;
text-align: right;
```

### text-indent（文本缩进）
- **单位**: 具体像素、em（单词宽度）

```css
text-indent: 20px;
text-indent: 2em;
```

### text-shadow（文本阴影）
**语法**: `text-shadow: 水平偏移量 垂直偏移量 模糊度 阴影颜色`

```css
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
text-shadow: 1px 1px 2px #333;
```

## 背景

### 背景颜色
```css
background-color: #f0f0f0;
background-color: rgba(255, 255, 255, 0.8);
```

### 背景图片
```css
background-image: url('./images/bg.jpg');
```
- **特点**: 图片小时，会循环铺满区域

### background-repeat（背景重复）
- **repeat**: 循环（默认）
- **repeat-x**: x轴循环
- **repeat-y**: y轴循环
- **no-repeat**: 不循环

```css
background-repeat: no-repeat;
background-repeat: repeat-x;
```

### background-position（背景位置）
#### 值的形式
- **水平位置, 垂直位置**

#### 相对位置
**水平方向**:
- left
- right
- center

**垂直方向**:
- top
- bottom
- center

```css
background-position: left top;
background-position: center center;
background-position: 50px 100px;
```

### background-size（背景尺寸）
#### 值的形式
- **宽, 高**: 具体像素值

#### 特殊值
- **cover**: 自动拉伸，等比拉伸，填充满区域
- **contain**: 自动拉伸，等比拉伸，填满x/y

```css
background-size: 100px 200px;
background-size: cover;
background-size: contain;
```

### background 简写
```css
background: color image repeat position;
```
- **注意**: color/image/repeat/position 无顺序要求

### 背景附着
```css
background-attachment: scroll;    /* 滚动 */
background-attachment: fixed;     /* 固定 */
```

### 背景精灵
页面只显示图片的一部分，通过 `background-position` 控制显示区域。

### 多重背景
```css
background: url(img.png) no-repeat left top, 
           url(img2.png) no-repeat right bottom;
```

## 实践示例

### 完整的文本样式
```css
.text-example {
    color: #333;
    font-family: "Microsoft YaHei", Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    text-align: center;
    text-decoration: none;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
```

### 完整的背景样式
```css
.bg-example {
    background-color: #f5f5f5;
    background-image: url('./bg.jpg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
}
```

## 总结

CSS常用属性涵盖了颜色、字体、文本和背景四大类，掌握这些属性的使用方法和组合技巧，能够实现丰富的视觉效果。在实际开发中，建议：

1. 优先使用语义化的颜色值（如十六进制或RGB）
2. 合理使用字体简写属性提高代码效率
3. 注意文本属性的继承特性
4. 背景属性的组合使用能创造更好的视觉效果