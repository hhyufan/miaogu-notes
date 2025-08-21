// 文件处理工具函数

// 环境检测：判断是否为生产环境（Vercel部署）
const isProduction = () => {
  return process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1' ||
    window.location.hostname !== 'localhost';
};

// 从静态JSON文件加载文件统计数据（生产环境使用）
const loadStaticFileStats = async () => {
  try {
    const response = await fetch('/file-stats.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('无法加载静态文件统计数据:', error);
  }
  return [];
};

// 从文件系统获取文件摘要数据
const loadFileSummariesData = async () => {
  try {
    const response = await fetch('/file-summaries.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('无法加载文件摘要数据:', error);
  }
  return {};
};

// 从文件系统获取markdown文件列表和统计信息
const getFileSystemStats = async () => {
  const fileStats = [];

  // 从file-summaries.json获取文件列表
  try {
    const summariesResponse = await fetch('/file-summaries.json');
    if (!summariesResponse.ok) {
      throw new Error('无法获取文件摘要列表');
    }
    const summariesData = await summariesResponse.json();

    // 获取文件夹列表
    const folderResponse = await fetch('/folder-summaries.json');
    const folderData = folderResponse.ok ? await folderResponse.json() : {};

    // 对每个文件夹中的文件进行处理
    for (const [folderKey, folderInfo] of Object.entries(folderData)) {
      const folderPath = folderInfo.path || folderKey;
      try {
        // 从file-summaries.json中获取属于该文件夹的文件（只处理以数字加连字符开头的.md文件）
        for (const [fileName, fileInfo] of Object.entries(summariesData)) {
          if (fileInfo.folder === folderKey && fileName.endsWith('.md') && /^\d+-/.test(fileName)) {
            try {
              const fileResponse = await fetch(`/markdown-files/${folderPath}/${fileName}`);
              if (fileResponse.ok) {
                const content = await fileResponse.text();
                const lastModified = fileResponse.headers.get('last-modified');

                fileStats.push({
                  name: fileName,
                  folder: folderKey,
                  lastWriteTime: lastModified ? new Date(lastModified).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : new Date().toLocaleString('zh-CN'),
                  length: content.length,
                  path: `markdown-files/${folderPath}/${fileName}`
                });
              }
            } catch (error) {
              console.warn(`读取文件 ${folderPath}/${fileName} 时出错:`, error);
            }
          }
        }
      } catch (error) {
        console.warn(`读取文件夹 ${folderPath} 时出错:`, error);
      }
    }
  } catch (error) {
    console.error('获取文件统计信息失败:', error);
  }

  return fileStats;
};



// 获取真实的markdown文件列表
const getMarkdownFiles = async () => {
  // 根据环境选择数据源
  if (isProduction()) {
    console.log('🚀 生产环境：使用静态JSON数据');
    return await getMarkdownFilesFromStatic();
  } else {
    console.log('🔧 开发环境：使用实时文件系统统计');
    return await getMarkdownFilesFromFileSystem();
  }
};

// 从静态JSON数据获取文件列表（生产环境）
const getMarkdownFilesFromStatic = async () => {
  const [fileSummariesData, staticFileStats] = await Promise.all([
    loadFileSummariesData(),
    loadStaticFileStats()
  ]);

  // 合并静态文件统计和摘要信息
  const fileMap = new Map();

  // 添加静态文件统计中的文件
  staticFileStats.forEach(file => {
    fileMap.set(file.name, {
      name: file.name,
      modifyTime: file.lastWriteTime,
      charCount: file.length,
      folder: extractFolderFromPath(file.path),
      summary: '',
      keywords: []
    });
  });

  // 合并摘要信息
  fileMap.forEach((file, fileName) => {
    if (fileSummariesData[fileName]) {
      file.summary = fileSummariesData[fileName].summary;
      file.keywords = fileSummariesData[fileName].keywords;
      file.folder = fileSummariesData[fileName].folder || file.folder;
    }
  });

  return processFileList(fileMap);
};

// 从文件系统获取文件列表（开发环境）
const getMarkdownFilesFromFileSystem = async () => {
  const [fileSummariesData, fileSystemStats] = await Promise.all([
    loadFileSummariesData(),
    getFileSystemStats()
  ]);

  // 合并文件系统信息和摘要信息
  const fileMap = new Map();

  // 首先添加文件系统中的文件
  fileSystemStats.forEach(file => {
    fileMap.set(file.name, {
      name: file.name,
      modifyTime: file.lastWriteTime,
      charCount: file.length,
      folder: file.folder,
      summary: '',
      keywords: []
    });
  });

  // 然后添加摘要信息中的文件（如果文件系统中没有，且以数字加连字符开头的.md文件）
  Object.keys(fileSummariesData).forEach(fileName => {
    if (!fileMap.has(fileName) && fileName.endsWith('.md') && /^\d+-/.test(fileName)) {
      fileMap.set(fileName, {
        name: fileName,
        modifyTime: '未知',
        charCount: 0,
        summary: '',
        keywords: []
      });
    }
  });

  // 合并摘要信息
  fileMap.forEach((file, fileName) => {
    if (fileSummariesData[fileName]) {
      file.summary = fileSummariesData[fileName].summary;
      file.keywords = fileSummariesData[fileName].keywords;
    }
  });

  return processFileList(fileMap);
};

// 从文件路径提取文件夹名称
const extractFolderFromPath = (filePath) => {
  const pathParts = filePath.split('/');
  if (pathParts.length >= 2) {
    return pathParts[pathParts.length - 2]; // 倒数第二个部分是文件夹名
  }
  return 'JavaFundamentals'; // 默认文件夹
};

// 处理文件列表：添加编号并排序
const processFileList = (fileMap) => {

  // 转换为数组并添加文件编号，只显示以数字加连字符开头的文件
  return Array.from(fileMap.values())
    .filter(file => {
      // 只显示.md文件且以数字加连字符开头的文件
      return file.name.endsWith('.md') && /^\d+-/.test(file.name);
    })
    .map(file => {
      // 从文件名中提取数字编号
      const numberMatch = file.name.match(/^(\d+)-/);
      const fileNumber = numberMatch ? parseInt(numberMatch[1]) : 999;

      return {
        ...file,
        fileNumber: fileNumber
      };
    })
    .sort((a, b) => a.fileNumber - b.fileNumber);
};

// 加载文件夹概要信息
export const loadFolderSummaries = async () => {
  try {
    const response = await fetch('/folder-summaries.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('无法加载文件夹概要信息:', error);
  }
  return {};
};

// 加载文件概要信息
export const loadFileSummaries = async () => {
  try {
    const fileData = await getMarkdownFiles();
    const summaries = {};

    fileData.forEach(file => {
      summaries[file.name] = {
        summary: file.summary,
        keywords: file.keywords,
        charCount: file.charCount,
        modifyTime: file.modifyTime
      };
    });

    return summaries;
  } catch (error) {
    console.error('加载文件概要信息失败:', error);
    return {};
  }
};

// 加载文件统计数据
export const loadFileStats = async (fileSummaries) => {
  try {
    const fileData = await getMarkdownFiles();
    const fileStats = fileData.map(file => ({
      ...file,
      summary: fileSummaries[file.name]?.summary || file.summary,
      keywords: fileSummaries[file.name]?.keywords || file.keywords
    }));

    const totalChars = fileStats.reduce((total, file) => total + file.charCount, 0);

    return {
      fileStats,
      totalChars
    };
  } catch (error) {
    console.error('加载文件统计数据失败:', error);
    return {
      fileStats: [],
      totalChars: 0
    };
  }
};

// 加载单个Markdown文件内容
export const loadMarkdownFile = async (fileName, folderName = null) => {
  // 加载真实的Markdown文件内容
  return new Promise(async (resolve, reject) => {
    try {
      let filePath;
      if (folderName) {
        // 获取folder-summaries.json中的路径配置
        try {
          const folderResponse = await fetch('/folder-summaries.json');
          if (folderResponse.ok) {
            const folderData = await folderResponse.json();
            const folderPath = folderData[folderName]?.path || folderName;
            filePath = `/markdown-files/${folderPath}/${fileName}`;
          } else {
            filePath = `/markdown-files/${folderName}/${fileName}`;
          }
        } catch (error) {
          filePath = `/markdown-files/${folderName}/${fileName}`;
        }
      } else {
        filePath = `/markdown-files/${fileName}`;
      }

      // 尝试使用fetch加载文件
      const response = await fetch(filePath);
      if (response.ok) {
        const content = await response.text();
        resolve(content);
      } else {
        // 如果无法加载真实文件，返回模拟内容
        const fileData = await getMarkdownFiles();
        const file = fileData.find(f => f.name === fileName);
        if (file) {
          const content = generateMockMarkdownContent(file);
          resolve(content);
        } else {
          reject(new Error(`文件 ${fileName} 不存在`));
        }
      }
    } catch (error) {
      // 如果fetch失败，返回模拟内容
      const fileData = await getMarkdownFiles();
      const file = fileData.find(f => f.name === fileName);
      if (file) {
        const content = generateMockMarkdownContent(file);
        resolve(content);
      } else {
        reject(new Error(`文件 ${fileName} 不存在`));
      }
    }
  });
};

// 生成模拟的Markdown内容
const generateMockMarkdownContent = (file) => {
  const templates = {
    '01-Java基础语法.md': `# Java基础语法

## 概述
${file.summary}

## 变量和数据类型

### 基本数据类型
\`\`\`java
// 整型
int age = 25;
long population = 1000000L;

// 浮点型
float price = 19.99f;
double salary = 5000.50;

// 字符型
char grade = 'A';

// 布尔型
boolean isActive = true;
\`\`\`

### 引用数据类型
\`\`\`java
// 字符串
String name = "张三";

// 数组
int[] numbers = {1, 2, 3, 4, 5};
\`\`\`

## 运算符

### 算术运算符
- \`+\` 加法
- \`-\` 减法
- \`*\` 乘法
- \`/\` 除法
- \`%\` 取模

### 比较运算符
- \`==\` 等于
- \`!=\` 不等于
- \`>\` 大于
- \`<\` 小于
- \`>=\` 大于等于
- \`<=\` 小于等于

## 控制流语句

### 条件语句
\`\`\`java
if (age >= 18) {
    System.out.println("成年人");
} else {
    System.out.println("未成年人");
}
\`\`\`

### 循环语句
\`\`\`java
// for循环
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// while循环
int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}
\`\`\``,

    '02-面向对象编程.md': `# 面向对象编程

## 概述
${file.summary}

## 类和对象

### 定义类
\`\`\`java
public class Person {
    // 属性
    private String name;
    private int age;
    
    // 构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 方法
    public void introduce() {
        System.out.println("我是" + name + "，今年" + age + "岁");
    }
    
    // getter和setter方法
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
\`\`\`

### 创建对象
\`\`\`java
Person person = new Person("张三", 25);
person.introduce();
\`\`\`

## 继承

\`\`\`java
public class Student extends Person {
    private String school;
    
    public Student(String name, int age, String school) {
        super(name, age);
        this.school = school;
    }
    
    @Override
    public void introduce() {
        super.introduce();
        System.out.println("我在" + school + "上学");
    }
}
\`\`\`

## 封装

封装是面向对象编程的核心特性之一：
- 使用private修饰符隐藏内部实现
- 提供public的getter和setter方法
- 保护数据的完整性

## 多态

\`\`\`java
Person person = new Student("李四", 20, "清华大学");
person.introduce(); // 调用Student类的introduce方法
\`\`\``,

    default: `# ${file.name.replace('.md', '')}

## 概述
${file.summary}

## 主要内容

这是一个关于${file.name.replace('.md', '')}的详细介绍文档。

### 代码示例

\`\`\`java
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### 重要概念

1. **概念一**: 详细说明
2. **概念二**: 详细说明
3. **概念三**: 详细说明

### 注意事项

> 这里是一些重要的注意事项和最佳实践。

### 总结

通过学习本章内容，你应该能够掌握相关的核心概念和实践技能。

---

*文件修改时间: ${file.modifyTime}*  
*字符数: ${file.charCount}*`
  };

  return templates[file.name] || templates.default;
};

// 格式化文件大小
export const formatFileSize = (chars) => {
  if (chars < 1000) return `${chars} 字符`;
  if (chars < 1000000) return `${(chars / 1000).toFixed(1)}K 字符`;
  return `${(chars / 1000000).toFixed(1)}M 字符`;
};

// 格式化日期
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};