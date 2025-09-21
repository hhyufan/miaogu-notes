# HTML5

## 概述

HTML5是HTML标准的第五个主要版本，于2014年10月正式发布。它不仅简化了HTML文档的结构，还引入了许多新的语义化标签、多媒体支持和表单增强功能。HTML5的设计目标是创建更加语义化、可访问性更好的网页，同时提供更丰富的用户交互体验。

## HTML5的发展历程

### 发布时间和兼容性

- **正式发布**：2014年10月28日，W3C正式发布HTML5标准
- **浏览器支持**：主流浏览器（Chrome、Firefox、Safari、Edge）都已全面支持HTML5
- **移动端支持**：HTML5在移动设备上的支持非常好，是移动Web开发的首选

### HTML5的主要改进

1. **简化文档结构**：DOCTYPE声明更加简洁
2. **语义化标签**：引入更多具有语义意义的标签
3. **多媒体支持**：原生支持音频和视频
4. **表单增强**：新的输入类型和验证功能
5. **图形绘制**：Canvas和SVG支持
6. **本地存储**：Web Storage和离线应用支持

## 文档结构简化

### 传统HTML文档声明

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

### HTML5简化的文档声明

```html
<!DOCTYPE html>
```

### 完整的HTML5文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML5文档示例</title>
</head>
<body>
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <h2>文章标题</h2>
            <p>文章内容...</p>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 版权所有</p>
    </footer>
</body>
</html>
```

## 废弃的标签

HTML5摒弃了一些过时的标签，推荐使用更现代的替代方案：

### 被废弃的标签

| 废弃标签 | 替代方案 | 说明 |
|----------|----------|------|
| `<big>` | CSS `font-size` | 使用CSS控制字体大小 |
| `<frame>` | `<iframe>` | 使用iframe嵌入外部内容 |
| `<frameset>` | CSS布局 | 使用现代CSS布局技术 |
| `<center>` | CSS `text-align` | 使用CSS居中对齐 |
| `<font>` | CSS样式 | 使用CSS控制字体样式 |

```html
<big>大字体文本</big>
<center>居中文本</center>
<font color="red" size="4">红色文字</font>

<span>大字体文本</span>
<div>居中文本</div>
<span>红色文字</span>
```

## 语义化布局标签

### 传统布局方式

在HTML5之前，开发者主要使用`<div>`和`<span>`标签进行布局：

```html
<div id="header">
    <div id="logo">网站Logo</div>
    <div id="navigation">
        <ul>
            <li><a href="#">首页</a></li>
            <li><a href="#">产品</a></li>
        </ul>
    </div>
</div>

<div id="content">
    <div id="main">
        <div class="article">
            <h2>文章标题</h2>
            <p>文章内容...</p>
        </div>
    </div>
    
    <div id="sidebar">
        <div class="widget">
            <h3>侧边栏内容</h3>
            <p>相关信息...</p>
        </div>
    </div>
</div>

<div id="footer">
    <p>版权信息</p>
</div>
```

### HTML5语义化标签

HTML5引入了具有明确语义意义的布局标签：

#### 主要语义化标签

| 标签 | 语义 | 用途 |
|------|------|------|
| `<header>` | 页眉 | 页面或区块的头部内容 |
| `<footer>` | 页脚 | 页面或区块的底部内容 |
| `<nav>` | 导航 | 导航链接区域 |
| `<aside>` | 侧边栏 | 与主内容相关的辅助信息 |
| `<article>` | 文章 | 独立的内容单元 |
| `<section>` | 区块 | 文档中的一个区域或章节 |
| `<main>` | 主要内容 | 页面的主要内容区域 |

#### 语义化布局示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML5语义化布局</title>
</head>
<body>
    <header>
        <h1>我的博客</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#blog">博客</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <header>
                <h2>HTML5学习指南</h2>
                <p>发布时间：<time datetime="2024-01-15">2024年1月15日</time></p>
                <p>作者：张三</p>
            </header>
            
            <section>
                <h3>什么是HTML5</h3>
                <p>HTML5是HTML标准的最新版本...</p>
            </section>
            
            <section>
                <h3>HTML5的新特性</h3>
                <p>HTML5引入了许多新特性...</p>
            </section>
            
            <footer>
                <p>标签：<a href="#html5">HTML5</a>, <a href="#web">Web开发</a></p>
            </footer>
        </article>
        
        <article>
            <header>
                <h2>CSS3实用技巧</h2>
                <p>发布时间：<time datetime="2024-01-10">2024年1月10日</time></p>
            </header>
            
            <section>
                <h3>CSS3选择器</h3>
                <p>CSS3提供了更强大的选择器...</p>
            </section>
        </article>
    </main>
    
    <aside>
        <section>
            <h3>最新文章</h3>
            <ul>
                <li><a href="#">HTML5学习指南</a></li>
                <li><a href="#">CSS3实用技巧</a></li>
                <li><a href="#">JavaScript基础</a></li>
            </ul>
        </section>
        
        <section>
            <h3>标签云</h3>
            <p>
                <a href="#">HTML5</a>
                <a href="#">CSS3</a>
                <a href="#">JavaScript</a>
                <a href="#">React</a>
            </p>
        </section>
    </aside>
    
    <footer>
        <p>&copy; 2024 我的博客. 保留所有权利.</p>
        <nav>
            <ul>
                <li><a href="#privacy">隐私政策</a></li>
                <li><a href="#terms">使用条款</a></li>
                <li><a href="#sitemap">网站地图</a></li>
            </ul>
        </nav>
    </footer>
</body>
</html>
```

### 语义化标签的优势

1. **SEO友好**：搜索引擎更容易理解页面结构
2. **可访问性**：屏幕阅读器能更好地解析内容
3. **代码可读性**：开发者更容易理解代码结构
4. **维护性**：结构清晰，便于维护和修改

## 多媒体标签

### 音频标签（audio）

HTML5原生支持音频播放，无需插件。

#### 基本语法

```html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    <source src="audio.wav" type="audio/wav">
    您的浏览器不支持音频播放。
</audio>
```

#### 支持的音频格式

| 格式 | MIME类型 | 浏览器支持 | 特点 |
|------|----------|------------|------|
| **MP3** | `audio/mpeg` | 广泛支持 | 压缩率高，质量好 |
| **WAV** | `audio/wav` | 广泛支持 | 无损格式，文件较大 |
| **OGG** | `audio/ogg` | Firefox、Chrome | 开源格式，压缩效果好 |

#### 音频标签属性

```html
<audio controls 
       autoplay 
       loop 
       muted 
       preload="auto">
    <source src="background-music.mp3" type="audio/mpeg">
    <source src="background-music.ogg" type="audio/ogg">
    您的浏览器不支持音频播放。
</audio>
```

| 属性 | 描述 | 值 |
|------|------|----|
| `controls` | 显示播放控件 | 布尔属性 |
| `autoplay` | 自动播放 | 布尔属性 |
| `loop` | 循环播放 | 布尔属性 |
| `muted` | 静音 | 布尔属性 |
| `preload` | 预加载策略 | `auto`, `metadata`, `none` |

#### 音频播放示例

```html
<h3>背景音乐</h3>
<audio controls>
    <source src="music/background.mp3" type="audio/mpeg">
    <source src="music/background.ogg" type="audio/ogg">
    <p>您的浏览器不支持音频播放。请<a href="music/background.mp3">下载音频文件</a>。</p>
</audio>

<audio controls autoplay loop>
    <source src="ambient.mp3" type="audio/mpeg">
    您的浏览器不支持音频播放。
</audio>

<audio id="clickSound" preload="auto">
    <source src="sounds/click.mp3" type="audio/mpeg">
    <source src="sounds/click.wav" type="audio/wav">
</audio>
<button onclick="document.getElementById('clickSound').play()">播放音效</button>
```

### 视频标签（video）

HTML5原生支持视频播放，提供了丰富的控制选项。

#### 基本语法

```html
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <source src="video.ogg" type="video/ogg">
    您的浏览器不支持视频播放。
</video>
```

#### 支持的视频格式

| 格式 | MIME类型 | 浏览器支持 | 特点 |
|------|----------|------------|------|
| **MP4** | `video/mp4` | 广泛支持 | H.264编码，兼容性最好 |
| **WebM** | `video/webm` | Chrome、Firefox | Google开发，压缩效果好 |
| **OGG** | `video/ogg` | Firefox、Chrome | 开源格式 |

#### 视频标签属性

```html
<video controls 
       autoplay 
       loop 
       muted 
       poster="thumbnail.jpg" 
       width="800" 
       height="450" 
       preload="metadata">
    <source src="demo.mp4" type="video/mp4">
    <source src="demo.webm" type="video/webm">
    您的浏览器不支持视频播放。
</video>
```

| 属性 | 描述 | 值 |
|------|------|----|
| `controls` | 显示播放控件 | 布尔属性 |
| `autoplay` | 自动播放 | 布尔属性 |
| `loop` | 循环播放 | 布尔属性 |
| `muted` | 静音 | 布尔属性 |
| `poster` | 视频封面图片 | 图片URL |
| `width` | 视频宽度 | 像素值 |
| `height` | 视频高度 | 像素值 |
| `preload` | 预加载策略 | `auto`, `metadata`, `none` |

#### 视频播放示例

```html
<h3>产品演示视频</h3>
<video controls width="640" height="360" poster="video-thumbnail.jpg">
    <source src="videos/product-demo.mp4" type="video/mp4">
    <source src="videos/product-demo.webm" type="video/webm">
    <p>您的浏览器不支持视频播放。请<a href="videos/product-demo.mp4">下载视频文件</a>。</p>
</video>

<video autoplay loop muted width="100%" height="400">
    <source src="background-video.mp4" type="video/mp4">
    <source src="background-video.webm" type="video/webm">
</video>

<div>
    <video controls
           poster="responsive-thumbnail.jpg">
        <source src="responsive-video.mp4" type="video/mp4">
        <source src="responsive-video.webm" type="video/webm">
        您的浏览器不支持视频播放。
    </video>
</div>
```
## 表单新增内容

### 新增表单标签

#### fieldset和legend标签

`<fieldset>`和`<legend>`标签用于对表单元素进行分组，提高表单的可读性和可访问性。

```html
<form>
    <fieldset>
        <legend>个人信息</legend>
        <label for="name">姓名：</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">邮箱：</label>
        <input type="email" id="email" name="email" required>
    </fieldset>
    
    <fieldset>
        <legend>联系方式</legend>
        <label for="phone">电话：</label>
        <input type="tel" id="phone" name="phone">
        
        <label for="address">地址：</label>
        <textarea id="address" name="address" rows="3"></textarea>
    </fieldset>
    
    <fieldset disabled>
        <legend>系统信息（只读）</legend>
        <label for="user_id">用户ID：</label>
        <input type="text" id="user_id" name="user_id" value="12345" readonly>
        
        <label for="reg_date">注册日期：</label>
        <input type="date" id="reg_date" name="reg_date" value="2024-01-01" readonly>
    </fieldset>
</form>
```

### 新增Input类型

HTML5为`<input>`标签新增了多种类型，提供更好的用户体验和数据验证。

#### 颜色选择器（color）

```html
<label for="bg_color">选择背景颜色：</label>
<input type="color" id="bg_color" name="bg_color" value="#ff0000">

<label for="text_color">选择文字颜色：</label>
<input type="color" id="text_color" name="text_color" value="#000000">
```

#### 邮箱输入（email）

```html
<label for="user_email">邮箱地址：</label>
<input type="email" 
       id="user_email" 
       name="email" 
       placeholder="请输入邮箱地址" 
       required>
```html
<label for="cc_emails">抄送邮箱（多个用逗号分隔）：</label>
<input type="email" 
       id="cc_emails" 
       name="cc_emails" 
       multiple 
       placeholder="email1@example.com, email2@example.com">
```

#### URL输入（url）

```html
<label for="website">个人网站：</label>
<input type="url" 
       id="website" 
       name="website" 
       placeholder="https://www.example.com">

<label for="blog">博客地址：</label>
<input type="url" 
       id="blog" 
       name="blog" 
       placeholder="请输入完整的URL地址">
```

#### 数字输入（number）

```html
<label for="age">年龄：</label>
<input type="number" 
       id="age" 
       name="age" 
       min="18" 
       max="100" 
       placeholder="请输入年龄">

<label for="quantity">数量：</label>
<input type="number" 
       id="quantity" 
       name="quantity" 
       min="1" 
       max="100" 
       value="1">
```

#### 日期和时间输入

```html
<label for="birthday">生日：</label>
<input type="date" 
       id="birthday" 
       name="birthday">

<label for="meeting_time">会议时间：</label>
<input type="time" 
       id="meeting_time" 
       name="meeting_time">

<label for="appointment">预约时间：</label>
<input type="datetime-local" 
       id="appointment" 
       name="appointment">
```

#### 滑块选择器（range）

```html
<label for="volume">音量：</label>
<input type="range" 
       id="volume" 
       name="volume" 
       min="0" 
       max="100" 
       value="50">
<output for="volume">50</output>

<label for="rating">评分：</label>
<input type="range" 
       id="rating" 
       name="rating" 
       min="1" 
       max="5" 
       value="3">
<output for="rating">3</output>
```

#### 电话输入（tel）

```html
<label for="mobile">手机号码：</label>
<input type="tel" 
       id="mobile" 
       name="mobile" 
       placeholder="请输入手机号码">
```

### 新增Input属性

#### placeholder属性

提供输入提示文字，当输入框为空时显示。

```html
<input type="text" name="username" placeholder="请输入用户名">
<input type="password" name="password" placeholder="请输入密码">
<input type="email" name="email" placeholder="example@domain.com">
<textarea name="message" placeholder="请输入您的留言..."></textarea>
```

#### required属性

标记必填字段，表单提交时会自动验证。

```html
<form>
    <label for="req_name">姓名（必填）：</label>
    <input type="text" id="req_name" name="name" required>
    
    <label for="req_email">邮箱（必填）：</label>
    <input type="email" id="req_email" name="email" required>
    
    <label for="req_message">留言（必填）：</label>
    <textarea id="req_message" name="message" required></textarea>
    
    <button type="submit">提交</button>
</form>
```

#### autofocus属性

页面加载时自动聚焦到指定输入框。

```html
<form>
    <label for="login_username">用户名：</label>
    <input type="text" id="login_username" name="username" autofocus>
    
    <label for="login_password">密码：</label>
    <input type="password" id="login_password" name="password">
    
    <button type="submit">登录</button>
</form>
```

#### autocomplete属性

控制浏览器的自动完成功能。

```html
<form>
    <label for="auto_name">姓名：</label>
    <input type="text" id="auto_name" name="name" autocomplete="name">
    
    <label for="auto_email">邮箱：</label>
    <input type="email" id="auto_email" name="email" autocomplete="email">
    
    <label for="secure_code">安全码：</label>
    <input type="text" id="secure_code" name="secure_code" autocomplete="off">
    
    <label for="new_password">新密码：</label>
    <input type="password" id="new_password" name="new_password" autocomplete="new-password">
</form>
```

#### list属性和datalist标签

提供输入建议列表，用户可以选择或自由输入。

```html
<form>
    <label for="city_input">选择或输入城市：</label>
    <input type="text" 
           id="city_input" 
           name="city" 
           list="cities" 
           placeholder="请选择或输入城市名称">
    
    <datalist id="cities">
        <option value="北京">北京市</option>
        <option value="上海">上海市</option>
        <option value="广州">广州市</option>
        <option value="深圳">深圳市</option>
        <option value="杭州">杭州市</option>
        <option value="南京">南京市</option>
    </datalist>
    
    <label for="browser_input">选择浏览器：</label>
    <input type="text" 
           id="browser_input" 
           name="browser" 
           list="browsers">
    
    <datalist id="browsers">
        <option value="Chrome">
        <option value="Firefox">
        <option value="Safari">
        <option value="Edge">
        <option value="Opera">
    </datalist>
</form>
```

#### pattern属性

使用正则表达式进行输入验证。

```html
<form>
    <label for="mobile_pattern">手机号码：</label>
    <input type="tel" 
           id="mobile_pattern" 
           name="mobile" 
           pattern="[0-9]{11}" 
           placeholder="请输入11位手机号码" 
           title="请输入11位数字的手机号码">
    
    <label for="zipcode">邮政编码：</label>
    <input type="text" 
           id="zipcode" 
           name="zipcode" 
           pattern="[0-9]{6}" 
           placeholder="请输入6位邮政编码" 
           title="请输入6位数字的邮政编码">
    
    <label for="username_pattern">用户名：</label>
    <input type="text" 
           id="username_pattern" 
           name="username" 
           pattern="[a-zA-Z0-9_]{3,20}" 
           placeholder="3-20位字母数字下划线" 
           title="用户名只能包含字母、数字和下划线，长度3-20位">
    
    <button type="submit">提交</button>
</form>
```

### 新增表单提交方式

#### form属性

允许表单元素位于`<form>`标签外部，通过`form`属性关联到指定表单。

```html
<form id="user_form" action="/submit" method="POST">
    <fieldset>
        <legend>基本信息</legend>
        <label for="form_name">姓名：</label>
        <input type="text" id="form_name" name="name" required>
        
        <label for="form_email">邮箱：</label>
        <input type="email" id="form_email" name="email" required>
    </fieldset>
</form>

<div class="additional-info">
    <h3>附加信息</h3>
    <label for="external_phone">电话：</label>
    <input type="tel" 
           id="external_phone" 
           name="phone" 
           form="user_form" 
           placeholder="请输入电话号码">
    
    <label for="external_website">个人网站：</label>
    <input type="url" 
           id="external_website" 
           name="website" 
           form="user_form" 
           placeholder="https://">
</div>

<div class="form-actions">
    <button type="submit" form="user_form">提交表单</button>
    <button type="reset" form="user_form">重置表单</button>
</div>
```

#### formaction和formmethod属性

为不同的提交按钮指定不同的提交地址和请求方法。

```html
<form id="article_form" action="/articles" method="POST">
    <fieldset>
        <legend>文章信息</legend>
        <label for="title">标题：</label>
        <input type="text" id="title" name="title" required>
        
        <label for="content">内容：</label>
        <textarea id="content" name="content" rows="10" required></textarea>
        
        <label for="category">分类：</label>
        <select id="category" name="category">
            <option value="tech">技术</option>
            <option value="life">生活</option>
            <option value="travel">旅行</option>
        </select>
    </fieldset>
    
    <div class="form-actions">
        <button type="submit" 
                formaction="/articles/draft" 
                formmethod="POST">
            保存草稿
        </button>
        
        <button type="submit" 
                formaction="/articles/publish" 
                formmethod="POST">
            发布文章
        </button>
        
        <button type="submit" 
                formaction="/articles/preview" 
                formmethod="POST" 
                formtarget="_blank">
            预览文章
        </button>
        
        <button type="submit" 
                formaction="/articles/delete" 
                formmethod="DELETE" 
                onclick="return confirm('确定要删除这篇文章吗？')">
            删除文章
        </button>
    </div>
</form>
```

## 新增功能：Canvas画图

HTML5引入了`<canvas>`元素，提供了强大的2D和3D图形绘制能力。

### Canvas基础

```html
<canvas id="myCanvas" width="400" height="300"></canvas>
    您的浏览器不支持Canvas。
</canvas>

<script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(50, 50, 100, 80);
    
    ctx.beginPath();
    ctx.arc(250, 100, 50, 0, 2 * Math.PI);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#0000ff';
    ctx.fillText('Hello Canvas!', 50, 200);
</script>
```