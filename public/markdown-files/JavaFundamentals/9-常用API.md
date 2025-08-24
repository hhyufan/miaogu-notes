# 常用API


#### 1. 查看API

##### 1.1 查看源码

- **Ctrl + 点击**：快速跳转到源码
- **Ctrl + N**：搜索类并查看源码

##### 1.2 查看API文档

- 官方文档：https://docs.oracle.com/javase/8/docs/api/
- IDEA内置文档：`Ctrl` + `Q`

#### 2. Object类

##### 2.1 概述

- 所有类的根类，所有的类都继承Object
- 位于java.lang包，无需导入

##### 2.2 内存地址相关

###### 2.2.1 `==` 运算符

用于判断 `数值`是否 `相等`或 `内存地址`是否 `相同`

```java
public class ObjectDemo {
    public static void main(String[] args) {
        String s1 = new String("hello");
        String s2 = new String("hello");
        String s3 = "hello";
        String s4 = "hello";
    
        System.out.println(s1 == s2);  // false (不同对象)
        System.out.println(s3 == s4);  // true (字符串常量池)
        System.out.println(10 == 10);  // true (基本类型比较值)
    }
}
```

###### 2.2.2 `equals()`方法

- 默认判断内存地址是否相同
- 重写此方法自定义相等判断

```java
class Person {
    private String name;
    private int age;
  
    // 重写equals方法
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && name.equals(person.name);
    }
}

public class EqualsDemo {
    public static void main(String[] args) {
        Person p1 = new Person("张三", 20);
        Person p2 = new Person("张三", 20);
    
        System.out.println(p1.equals(p2));  // true (重写后比较内容)
    }
}
```

###### 2.2.3 hashCode()方法

- 默认返回对象内存地址hash码
- 重写此方法自定义hash码返回

```java
class Person {
    private String name;
    private int age;
  
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && name.equals(person.name);
    }
  
    @Override
    public int hashCode() {
        return name.hashCode() + age;
    }
}
```

> **Tips**：如果重写equals()，需重写hashCode()，实现二者业务逻辑相同

##### 2.3 toString()方法

- 默认情况下打印内存地址的值
- 重写此方法实现对象的字符串版本

```java
class Student {
    private String name;
    private int score;
  
    @Override
    public String toString() {
        return "Student{name='" + name + "', score=" + score + "}";
    }
}

public class ToStringDemo {
    public static void main(String[] args) {
        Student s = new Student("李四", 85);
        System.out.println(s);  // 自动调用toString()
    }
}
```

##### 2.4 clone()方法

- 需要实现Cloneable接口
- 用于对象克隆

```java
class Book implements Cloneable {
    private String title;
    // 自定义浅克隆实现
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

##### 2.5 instanceof操作

- 判断对象是否为某个类的实例

```java
public class InstanceofDemo {
    public static void main(String[] args) {
        String str = "hello";
        System.out.println(str instanceof String);  // true
        System.out.println(str instanceof Object);  // true
    }
}
```

#### 3. JUnit单元测试

##### 3.1 概述

- 第三方开源项目，用来实现Java单元测试
- 常用版本：JUnit4，JUnit5

##### 3.2 基本使用

```java
import org.junit.Test;
import org.junit.Assert;

public class CalculatorTest {
  
    @Test
    public void testAdd() {
        Calculator calc = new Calculator();
        int result = calc.add(2, 3);
        Assert.assertEquals(5, result);
    }
  
    @Test
    public void testDivide() {
        Calculator calc = new Calculator();
        double result = calc.divide(10, 2);
        Assert.assertEquals(5.0, result, 0.01);
    }
}
```

#### 4. 包装类/封装类

##### 4.1 概述

- Java有八大基本类型，功能有限，只能进行基本运算
- Java面向对象编程，扩展基本类型的功能，基本类型扩展为对象类型，称为 `包装类`

##### 4.2 包装类型对应关系

###### 4.2.1 Number类型

| 基本类型 | 包装类型 |
| -------- | -------- |
| byte     | Byte     |
| short    | Short    |
| int      | Integer  |
| long     | Long     |
| float    | Float    |
| double   | Double   |

###### 4.2.2 其他类型

| 基本类型 | 包装类型  |
| -------- | --------- |
| char     | Character |
| boolean  | Boolean   |

##### 4.3 Number相关操作

###### 4.3.1 构造函数

- Java9开始，包装类的构造函数过时

```java
// 过时写法（不推荐）
Integer i1 = new Integer(10);

// 推荐写法
Integer i2 = Integer.valueOf(10);
```

###### 4.3.2 装箱和拆箱

- **装箱**：基本类型转为包装类型
- **拆箱**：包装类型转为基本类型
- Java8开始，支持自动装箱和拆箱，使用直接赋值形式

```java
public class BoxingDemo {
    public static void main(String[] args) {
        // 自动装箱
        Integer i = 10;  // 基本类型 -> 包装类型
    
        // 自动拆箱
        int j = i;       // 包装类型 -> 基本类型
    
        // 手动装箱
        Integer k = Integer.valueOf(20);
    
        // 手动拆箱
        int l = k.intValue();
    }
}
```

###### 4.3.3 字符串相互转换

- int/Integer -> String

```java
public class StringConvertDemo {
    public static void main(String[] args) {
        int x = 123;
    
        // 方法1：连接空字符串
        String y = x + "";
    
        // 方法2：使用String.valueOf()
        String z = String.valueOf(x);
    
        System.out.println(y + " " + z);
    }
}
```

- String -> int/Integer

```java
public class StringToIntDemo {
    public static void main(String[] args) {
        String str = "456";
    
        // 转为Integer对象
        Integer i = Integer.valueOf(str);
    
        // 转为int基本类型
        int j = Integer.parseInt(str);
    
        System.out.println(i + " " + j);
    }
}
```

#### 5. BigDecimal/BigInteger

`double`/`long`在处理数据时，数据比较大会 `精度丢失`。对于 `精度要求高`的操作，`BigDecimal`处理 `浮点数`，`BigInteger`处理 `整数`

```java
public class PrecisionDemo {
    public static void main(String[] args) {
        // 精度丢失示例
        System.out.println(0.1 + 0.2);  // 0.30000000000000004
    
        // 使用BigDecimal解决
        BigDecimal bd1 = new BigDecimal("0.1");
        BigDecimal bd2 = new BigDecimal("0.2");
        System.out.println(bd1.add(bd2));  // 0.3
    }
}
```

##### 5.1 构造器

- 父类：Number

```java
public class BigDecimalDemo {
    public static void main(String[] args) {
        // 推荐：使用字符串构造
        BigDecimal bd1 = new BigDecimal("12323333.11111111111111111");
    
        // 不推荐：使用double构造（可能有精度问题）
        BigDecimal bd2 = new BigDecimal(1.2);
    
        System.out.println(bd1);
        System.out.println(bd2);
    }
}
```

> **Tips：**推荐使用字符串构造器

##### 5.3 四则运算

- **add**（加法）
- **subtract**（减法）
- **multiply**（乘法）
- **divide**（除法）

```java
public class BigDecimalCalculateDemo {
    public static void main(String[] args) {
        BigDecimal bd1 = new BigDecimal("10.5");
        BigDecimal bd2 = new BigDecimal("3.2");
    
        // 加法
        System.out.println(bd1.add(bd2));        // 13.7
    
        // 减法
        System.out.println(bd1.subtract(bd2));   // 7.3
    
        // 乘法
        System.out.println(bd1.multiply(bd2));   // 33.60
    
        // 除法（除不尽会报错）
        BigDecimal bd3 = new BigDecimal("10");
        BigDecimal bd4 = new BigDecimal("3");
    
        // 指定精度和取舍规则
        System.out.println(bd3.divide(bd4, 2, RoundingMode.HALF_UP));  // 3.33
    }
}
```

##### 5.4 类型转换

- String转换

```java
public class BigDecimalStringDemo {
    public static void main(String[] args) {
        // String -> BigDecimal
        BigDecimal bd = new BigDecimal("1.2");
    
        // BigDecimal -> String
        String bdStr = bd.toString();
    
        System.out.println(bdStr);
    }
}
```

- Double转换

```java
public class BigDecimalDoubleDemo {
    public static void main(String[] args) {
        // Double -> BigDecimal
        BigDecimal bd = new BigDecimal(1.2D);
    
        // BigDecimal -> Double
        double bdDouble = bd.doubleValue();
    
        System.out.println(bdDouble);
    }
}
```

#### 6. Math类

##### 6.1 概述

- Math意思是 `数学`，是 `算数`和 `几何`的 `工具类`
- Math是一个 `final`工具类，所有的内容都是 `静态的`

##### 6.2 常用的算数运算

- 取整

```java
public class MathDemo {
    public static void main(String[] args) {
        double num = 3.7;
    
        // 向上取整
        System.out.println(Math.ceil(num));   // 4.0
    
        // 向下取整
        System.out.println(Math.floor(num));  // 3.0
    
        // 四舍五入取整
        System.out.println(Math.round(num));  // 4
    }
}
```

- 其他运算

```java
public class MathOperationDemo {
    public static void main(String[] args) {
        // 幂运算
        System.out.println(Math.pow(2, 3));   // 8.0
    
        // 开方运算
        System.out.println(Math.sqrt(16));    // 4.0
    
        // 求绝对值
        System.out.println(Math.abs(-5));     // 5
    }
}
```

#### 7. Random类

##### 7.1 概述

- `Random`是 `随机数`的 `工具类`
- Java的 `随机数`是一种 `伪随机数`
- 内部根据 `参数种子`，通过 `算法`，得到 `结果`

##### 7.2 构造方法

```java
public class RandomConstructorDemo {
    public static void main(String[] args) {
        // 使用种子构造
        Random r1 = new Random(1000L);
    
        // 无参构造（内部使用系统时间+随机毫秒数作为种子）
        Random r2 = new Random();
    }
}
```

##### 7.3 系统时间戳

- 距离1970-1-1 0:0:0的毫秒数
- `System.currentTimeMillis()`

```java
public class TimestampDemo {
    public static void main(String[] args) {
        long timestamp = System.currentTimeMillis();
        System.out.println(timestamp);
    }
}
```

##### 7.4 随机值生成

```java
public class RandomValueDemo {
    public static void main(String[] args) {
        Random random = new Random();
    
        // 整数范围的随机数
        System.out.println(random.nextInt());
    
        // [0, n)的随机整数
        System.out.println(random.nextInt(10));  // 0-9
    
        // 长整数随机数
        System.out.println(random.nextLong());
    
        // 浮点数随机数
        System.out.println(random.nextFloat());
    
        // [0, 1)的随机双精度浮点数
        System.out.println(random.nextDouble());
    }
}
```

#### 8. UUID类

##### 8.1 概述

- 获得一个 `唯一`的 `识别码（id）`，是 `32位16进制`的数字的字符串

```java
import java.util.UUID;

public class UUIDDemo {
    public static void main(String[] args) {
        // 生成随机UUID
        UUID uuid = UUID.randomUUID();
        System.out.println(uuid.toString());
    
        // 去掉连字符
        String uuidStr = uuid.toString().replace("-", "");
        System.out.println(uuidStr);
    }
}
```

#### 9. 正则表达式RegExp

##### 9.1 概述

- 用于对 `字符串`进行 `模式匹配`
- 用来判断 `字符串匹配`的 `规则`

##### 9.2 Java API

```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexDemo {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
        Matcher matcher = pattern.matcher("2023-12-25");
    
        System.out.println(matcher.matches());  // true
    }
}
```

##### 9.3 元字符

```java
public class MetaCharDemo {
    public static void main(String[] args) {
        // . 任意一个字符
        System.out.println("abc".matches("a.c"));     // true
    
        // \\d 任意一个数字
        System.out.println("123".matches("\\d{3}"));  // true
    
        // \\D 任意一个非数字
        System.out.println("abc".matches("\\D{3}"));  // true
    
        // \\s 任意一个空格
        System.out.println(" ".matches("\\s"));       // true
    
        // \\S 任意一个非空格
        System.out.println("a".matches("\\S"));       // true
    
        // \\w 任意一个单词字符（包含英文字母和数字）
        System.out.println("a1".matches("\\w{2}"));   // true
    
        // \\W 任意一个非单词字符
        System.out.println("@#".matches("\\W{2}"));   // true
    }
}
```

##### 9.4 锚点符

```java
public class AnchorDemo {
    public static void main(String[] args) {
        // ^ 开始
        // $ 结束
        System.out.println("hello".matches("^h.*"));   // true
        System.out.println("hello".matches(".*o$"));   // true
    }
}
```

##### 9.5 量词

```java
public class QuantifierDemo {
    public static void main(String[] args) {
        // * 任意个：0 - n
        System.out.println("".matches("a*"));         // true
        System.out.println("aaa".matches("a*"));      // true
    
        // + 最少一个：1 - n
        System.out.println("a".matches("a+"));        // true
        System.out.println("".matches("a+"));         // false
    
        // ? 最多一个：0 - 1
        System.out.println("a".matches("a?"));        // true
        System.out.println("".matches("a?"));         // true
    
        // {n} n个
        System.out.println("aaa".matches("a{3}"));    // true
    
        // {n,} >= n
        System.out.println("aaaa".matches("a{3,}"));  // true
    
        // {n, m} n - m
        System.out.println("aaa".matches("a{2,4}"));  // true
    }
}
```

##### 9.6 范围

```java
public class RangeDemo {
    public static void main(String[] args) {
        // [abc] 在abc范围之内的任意一个
        System.out.println("a".matches("[abc]"));     // true
    
        // [^abc] 不在abc范围的任意一个
        System.out.println("d".matches("[^abc]"));    // true
    
        // [a-z] a到z范围的任意一个
        System.out.println("m".matches("[a-z]"));     // true
    
        // [3-9] 3到9范围的任意一个
        System.out.println("5".matches("[3-9]"));     // true
    }
}
```

#### 10. String类

##### 10.1 概述

- String是Java中最常用的类之一，用于处理字符串
- 位于java.lang包，无需导入

##### 10.2 字符串不可变性

- String对象一旦创建，其内容不可改变
- 对字符串拼接等变更操作，重新开辟内存保存新内容，原有内容会变成垃圾

```java
public class StringImmutableDemo {
    public static void main(String[] args) {
        String str = "hello";
        str = str + " world";  // 创建新的String对象
        System.out.println(str);  // hello world
    }
}
```

##### 10.3 StringBuffer类

###### 10.3.1 概述

- 字符串缓冲区，可变的字符序列
- 自动扩容机制
- 线程安全的

###### 10.3.2 构造器

```java
public class StringBufferConstructorDemo {
    public static void main(String[] args) {
        // 默认存储大小为16字符
        StringBuffer sb1 = new StringBuffer();
      
        // 构建空的缓冲区，后放入此字符串
        StringBuffer sb2 = new StringBuffer("hello");
      
        System.out.println("sb1容量: " + sb1.capacity());  // 16
        System.out.println("sb2内容: " + sb2.toString());  // hello
    }
}
```

###### 10.3.3 String与StringBuffer相互转换

```java
public class StringBufferConvertDemo {
    public static void main(String[] args) {
        String str = "hello";
      
        // String → StringBuffer
        StringBuffer buffer = new StringBuffer();
        buffer.append(str);
      
        // StringBuffer → String
        String newStr = buffer.toString();
      
        System.out.println(newStr);  // hello
    }
}
```

###### 10.3.4 常用方法

```java
public class StringBufferMethodDemo {
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer("hello");
      
        // length()：获取存放内容的长度
        System.out.println("长度: " + sb.length());  // 5
      
        // insert(int offset, String str)：将字符串str插入此字符序列offset位置
        sb.insert(5, " world");
        System.out.println("插入后: " + sb);  // hello world
      
        // setCharAt(int pos, char ch)：使用ch值修改在pos位置上的字符
        sb.setCharAt(0, 'H');
        System.out.println("修改后: " + sb);  // Hello world
      
        // reverse()：字符串的字符反转
        StringBuffer sb2 = new StringBuffer("abc");
        sb2.reverse();
        System.out.println("反转后: " + sb2);  // cba
      
        // delete(int start, int end)：删除从start - end 指定的索引位置的字符（不包括end）
        StringBuffer sb3 = new StringBuffer("hello world");
        sb3.delete(5, 11);
        System.out.println("删除后: " + sb3);  // hello
      
        // deleteCharAt(int pos)：删除pos索引位置的字符
        StringBuffer sb4 = new StringBuffer("hello");
        sb4.deleteCharAt(1);
        System.out.println("删除字符后: " + sb4);  // hllo
      
        // replace(int start, int end, String s)：使用字符串s替换从start开始到end结束位置的字符
        StringBuffer sb5 = new StringBuffer("hello world");
        sb5.replace(6, 11, "Java");
        System.out.println("替换后: " + sb5);  // hello Java
    }
}
```

##### 10.4 StringBuilder类

###### 10.4.1 概述

- StringBuilder的构造器用法和StringBuffer完全一致
- StringBuilder是线程不安全的，但处理速度比StringBuffer快
- 单线程使用StringBuilder，多线程使用StringBuffer

```java
public class StringBuilderDemo {
    public static void main(String[] args) {
        // StringBuilder用法与StringBuffer相同
        StringBuilder sb = new StringBuilder("hello");
      
        sb.append(" world");
        sb.insert(5, ",");
        sb.reverse();
      
        System.out.println(sb.toString());  // dlrow ,olleh
    }
}
```

###### 10.4.2 性能对比

```java
public class StringPerformanceDemo {
    public static void main(String[] args) {
        long start, end;
      
        // String拼接（性能最差）
        start = System.currentTimeMillis();
        String str = "";
        for (int i = 0; i < 10000; i++) {
            str += "a";
        }
        end = System.currentTimeMillis();
        System.out.println("String拼接耗时: " + (end - start) + "ms");
      
        // StringBuffer拼接（线程安全）
        start = System.currentTimeMillis();
        StringBuffer buffer = new StringBuffer();
        for (int i = 0; i < 10000; i++) {
            buffer.append("a");
        }
        end = System.currentTimeMillis();
        System.out.println("StringBuffer拼接耗时: " + (end - start) + "ms");
      
        // StringBuilder拼接（性能最好）
        start = System.currentTimeMillis();
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 10000; i++) {
            builder.append("a");
        }
        end = System.currentTimeMillis();
        System.out.println("StringBuilder拼接耗时: " + (end - start) + "ms");
    }
}
```

> **Tips：**
>
> - 少量字符串操作使用String
> - 大量字符串拼接在单线程环境使用StringBuilder
> - 大量字符串拼接在多线程环境使用StringBuffer



#### 11. 日期时间

##### 11.1 概述

- 日期时间是Java中处理时间相关操作的重要API
- 主要涉及时间标准和不同版本的API

###### 11.1.1 时间标准

- **格林威治时间（GMT）**：世界通用时间
  - 起始时间：1970/1/1 00:00:00
- **CST（东八区）**：中国区系统时间
  - 起始时间：1970/1/1 08:00:00

###### 11.1.2 API版本分类

- **JDK8之前**：Date、SimpleDateFormat、Calendar
  - Date：包含日期（年月日）、时间（小时分钟秒）的信息，把时间作为整体处理，无法处理具体字段
  - SimpleDateFormat：将Date格式数据和字符串相互转换
  - Calendar：处理具体字段
- **JDK8+**：LocalDate、LocalTime、LocalDateTime等新API

##### 11.2 Date类

###### 11.2.1 概述

- 位于java.util.Date包下
- 表示特定的瞬间，精确到毫秒

###### 11.2.2 构造方法

```java
import java.util.Date;

public class DateDemo {
    public static void main(String[] args) {
        // 无参构造：指当前日期
        Date date1 = new Date();
        System.out.println("当前时间: " + date1);
        
        // 有参构造：距离计算机起始时间的毫秒数
        Date date2 = new Date(1000L * 60 * 60 * 24);  // 1天后
        System.out.println("指定时间: " + date2);
    }
}
```

###### 11.2.3 常用方法

```java
public class DateMethodDemo {
    public static void main(String[] args) {
        Date date = new Date();
        
        // getTime()：得到计算机起始时间到现在的毫秒数
        long timestamp = date.getTime();
        System.out.println("时间戳: " + timestamp);
        
        // 比较时间
        Date date1 = new Date();
        Date date2 = new Date(System.currentTimeMillis() + 1000);
        
        System.out.println("date1在date2之前: " + date1.before(date2));  // true
        System.out.println("date1在date2之后: " + date1.after(date2));   // false
    }
}
```

##### 11.3 SimpleDateFormat类

###### 11.3.1 概述

- 用于Date和String进行相互转化的工具类
- 可以自定义日期时间格式

###### 11.3.2 格式化模式

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class SimpleDateFormatDemo {
    public static void main(String[] args) {
        Date date = new Date();
        
        // 创建格式化对象
        SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        
        // 常用格式模式
        SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat format2 = new SimpleDateFormat("HH:mm:ss");
        SimpleDateFormat format3 = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒");
        
        System.out.println("格式1: " + format1.format(date));
        System.out.println("格式2: " + format2.format(date));
        System.out.println("格式3: " + format3.format(date));
    }
}
```

###### 11.3.3 Date与String相互转换

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateStringConvertDemo {
    public static void main(String[] args) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        
        // Date → String
        Date date = new Date();
        String dateStr = format.format(date);
        System.out.println("Date转String: " + dateStr);
        
        // String → Date（需要异常处理，报java.text.ParseException）
        try {
            String str = "2025/01/15 14:30:25";
            Date parsedDate = format.parse(str);
            System.out.println("String转Date: " + parsedDate);
        } catch (ParseException e) {
            System.out.println("日期解析错误: " + e.getMessage());
        }
    }
}
```

##### 11.4 Calendar类

###### 11.4.1 概述

- Calendar是一个抽象类，需要静态工厂方法getInstance()使用返回子类对象
- 用于处理具体的日期时间字段

###### 11.4.2 基本使用

```java
import java.util.Calendar;

public class CalendarDemo {
    public static void main(String[] args) {
        // Calendar是抽象类，通过getInstance()获取实例
        Calendar cal = Calendar.getInstance();
        
        System.out.println("当前时间: " + cal.getTime());
    }
}
```

###### 11.4.3 获取字段值

```java
import java.util.Calendar;

public class CalendarGetDemo {
    public static void main(String[] args) {
        Calendar cal = Calendar.getInstance();
        
        // cal.get(int field) 获取各种时间字段
        System.out.println("年份: " + cal.get(Calendar.YEAR));                    // 如 2025
        System.out.println("月份: " + (cal.get(Calendar.MONTH) + 1));             // 0=一月，11=十二月，所以+1
        System.out.println("当月日期: " + cal.get(Calendar.DATE));                // 1-31
        System.out.println("当月日期: " + cal.get(Calendar.DAY_OF_MONTH));        // 等同于DATE
        System.out.println("当年第几天: " + cal.get(Calendar.DAY_OF_YEAR));       // 1-366
        System.out.println("本周第几天: " + cal.get(Calendar.DAY_OF_WEEK));       // 1=周日，7=周六
        System.out.println("上下午: " + cal.get(Calendar.AM_PM));                 // 0=AM，1=PM
        System.out.println("24小时制小时: " + cal.get(Calendar.HOUR_OF_DAY));     // 0-23
        System.out.println("分钟: " + cal.get(Calendar.MINUTE));                  // 0-59
        System.out.println("秒: " + cal.get(Calendar.SECOND));                    // 0-59
        System.out.println("毫秒: " + cal.get(Calendar.MILLISECOND));             // 0-999
    }
}
```

###### 11.4.4 其他常用方法

```java
import java.util.Calendar;

public class CalendarMethodDemo {
    public static void main(String[] args) {
        Calendar cal = Calendar.getInstance();
        
        // getTimeInMillis()：获取系统时间戳
        long timestamp = cal.getTimeInMillis();
        System.out.println("时间戳: " + timestamp);
        
        // set()：设置字段值
        cal.set(Calendar.YEAR, 2025);
        cal.set(Calendar.MONTH, 11);  // 12月（0-11）
        cal.set(Calendar.DATE, 25);
        System.out.println("设置后时间: " + cal.getTime());
        
        // add()：增加或减少字段值
        cal.add(Calendar.DAY_OF_MONTH, 50);  // 增加50天
        System.out.println("增加50天后: " + cal.getTime());
        
        cal.add(Calendar.YEAR, -1);  // 减少1年
        System.out.println("减少1年后: " + cal.getTime());
    }
}
```

###### 11.4.5 Calendar与Date相互转换

```java
import java.util.Calendar;
import java.util.Date;

public class CalendarDateConvertDemo {
    public static void main(String[] args) {
        Calendar cal = Calendar.getInstance();
        Date date = new Date();
        
        // Date → Calendar
        cal.setTime(date);
        System.out.println("Date转Calendar: " + cal.getTime());
        
        // Calendar → Date
        Date calDate = cal.getTime();
        System.out.println("Calendar转Date: " + calDate);
    }
}
```

##### 11.5 综合应用示例

```java
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateTimeComprehensiveDemo {
    public static void main(String[] args) {
        // 获取当前时间的各种表示方式
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        
        System.out.println("=== 当前时间信息 ===");
        System.out.println("Date对象: " + now);
        System.out.println("格式化字符串: " + sdf.format(now));
        System.out.println("时间戳: " + now.getTime());
        
        System.out.println("\n=== 详细时间字段 ===");
        System.out.println("年: " + cal.get(Calendar.YEAR));
        System.out.println("月: " + (cal.get(Calendar.MONTH) + 1));
        System.out.println("日: " + cal.get(Calendar.DATE));
        System.out.println("时: " + cal.get(Calendar.HOUR_OF_DAY));
        System.out.println("分: " + cal.get(Calendar.MINUTE));
        System.out.println("秒: " + cal.get(Calendar.SECOND));
        
        // 计算一周后的时间
        Calendar future = Calendar.getInstance();
        future.add(Calendar.DAY_OF_MONTH, 7);
        System.out.println("\n一周后: " + sdf.format(future.getTime()));
    }
}
```

> **Tips：**
> - Date适合表示时间点，但功能有限
> - SimpleDateFormat用于格式化显示和字符串解析
> - Calendar适合进行时间计算和字段操作
> - JDK8+推荐使用LocalDateTime等新API，功能更强大且线程安全

##### 11.6 LocalDateTime（JDK8+）

###### 11.6.1 概述

JDK8之后引入的时间处理类，相比传统的Date和Calendar类，LocalDateTime具有以下优点：
- **摒弃了时区概念**：避免时区转换的复杂性
- **月份从1开始**：更符合人类习惯（传统Calendar月份从0开始）
- **星期改为枚举**：类型安全，避免魔法数字
- **等价于Date + Calendar**：集成了日期和时间处理功能

###### 11.6.2 创建LocalDateTime对象

```java
import java.time.LocalDateTime;

public class LocalDateTimeDemo {
    public static void main(String[] args) {
        // 获取当前日期时间
        LocalDateTime now = LocalDateTime.now();
        System.out.println("当前时间：" + now);
        
        // 创建指定日期时间
        LocalDateTime specificTime = LocalDateTime.of(2025, 1, 15, 14, 30, 0);
        System.out.println("指定时间：" + specificTime);
    }
}
```

###### 11.6.3 字符串转换

使用DateTimeFormatter进行格式化和解析：

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeFormatterDemo {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        
        // 创建格式化器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        
        // LocalDateTime → String
        String formatStr = formatter.format(now);
        System.out.println("格式化后：" + formatStr);
        
        // String → LocalDateTime
        String dateStr = "2025/01/15 14:30:00";
        LocalDateTime dateTime = LocalDateTime.parse(dateStr, formatter);
        System.out.println("解析后：" + dateTime);
        
        // 注意：定义时和解析的时间字段位数必须一致
        // 无法使用hh，因为不能确定字符串表示是24h还是12h
    }
}
```

###### 11.6.4 获取字段信息

```java
import java.time.DayOfWeek;
import java.time.LocalDateTime;

public class GetFieldDemo {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        
        // 获取各个字段
        int year = now.getYear();
        int month = now.getMonthValue();  // 注意：月份从1开始
        int day = now.getDayOfMonth();
        int hour = now.getHour();
        int minute = now.getMinute();
        int second = now.getSecond();
        DayOfWeek week = now.getDayOfWeek();
        
        System.out.println("年份：" + year);
        System.out.println("月份：" + month);
        System.out.println("日期：" + day);
        System.out.println("小时：" + hour);
        System.out.println("分钟：" + minute);
        System.out.println("秒数：" + second);
        System.out.println("星期：" + week);
    }
}
```

###### 11.6.5 设置字段信息

with相关方法返回新的LocalDateTime对象，支持链式调用：

```java
import java.time.LocalDateTime;

public class SetFieldDemo {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("原始时间：" + now);
        
        // 单独设置字段
        LocalDateTime newYear = now.withYear(2026);
        LocalDateTime newMonth = now.withMonth(12);
        LocalDateTime newDay = now.withDayOfMonth(25);
        LocalDateTime newHour = now.withHour(18);
        LocalDateTime newMinute = now.withMinute(30);
        LocalDateTime newSecond = now.withSecond(0);
        
        System.out.println("修改年份：" + newYear);
        System.out.println("修改月份：" + newMonth);
        
        // 链式调用构造特定日期
        LocalDateTime christmas = now
            .withMonth(12)
            .withDayOfMonth(25)
            .withHour(0)
            .withMinute(0)
            .withSecond(0);
        
        System.out.println("圣诞节：" + christmas);
    }
}
```

###### 11.6.6 LocalDate和LocalTime

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class LocalDateTimeVariantsDemo {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        
        // LocalDate - 只有日期字段，没有时间字段
        LocalDate localDate = now.toLocalDate();
        System.out.println("日期部分：" + localDate);
        
        // LocalTime - 只有时间字段，没有日期字段
        LocalTime localTime = now.toLocalTime();
        System.out.println("时间部分：" + localTime);
        
        // 使用方式和LocalDateTime完全一致
        LocalDate specificDate = LocalDate.of(2025, 12, 25);
        LocalTime specificTime = LocalTime.of(18, 30, 0);
        
        System.out.println("指定日期：" + specificDate);
        System.out.println("指定时间：" + specificTime);
    }
}
```

> **使用建议**：
> - 优先使用LocalDateTime替代传统的Date和Calendar
> - 根据需求选择LocalDate（仅日期）、LocalTime（仅时间）或LocalDateTime（日期+时间）
> - 格式化时注意字段位数的一致性
> - 利用链式调用简化日期时间的构造

#### 12. Base64编解码

##### 12.1 概述

- Base64是一种用来对字符串进行编解码的技术
- **编码**：将不规范的字符串转换为规范字符串
- **解码**：将编码后的字符串还原回原始字符串
- Java8之前需要使用第三方开源库，Java8+将Base64写入Java API

##### 12.2 基本用法

```java
import java.util.Base64;

public class Base64Demo {
    public static void main(String[] args) {
        String originalStr = "Java编程学习";
        
        // 编码
        Base64.Encoder encoder = Base64.getEncoder();
        String encoded = encoder.encodeToString(originalStr.getBytes());
        
        // 解码
        Base64.Decoder decoder = Base64.getDecoder();
        byte[] decodedBytes = decoder.decode(encoded);
        String decoded = new String(decodedBytes);
        
        System.out.println("原始字符串: " + originalStr);
        System.out.println("编码后: " + encoded);
        System.out.println("解码后: " + decoded);
        System.out.println("是否相等: " + originalStr.equals(decoded));
    }
}
```

##### 12.3 URL编解码

```java
import java.util.Base64;

public class Base64UrlDemo {
    public static void main(String[] args) {
        String url = "https://www.example.com/search?q=java编程";
        
        // URL编码
        Base64.Encoder urlEncoder = Base64.getUrlEncoder();
        String encodedUrl = urlEncoder.encodeToString(url.getBytes());
        
        // URL解码
        Base64.Decoder urlDecoder = Base64.getUrlDecoder();
        byte[] decodedBytes = urlDecoder.decode(encodedUrl);
        String decodedUrl = new String(decodedBytes);
        
        System.out.println("原始URL: " + url);
        System.out.println("编码后: " + encodedUrl);
        System.out.println("解码后: " + decodedUrl);
    }
}
```

##### 12.4 MIME编解码

```java
import java.util.Base64;

public class Base64MimeDemo {
    public static void main(String[] args) {
        String longText = "这是一个很长的文本内容，用于演示MIME编码，" +
                         "MIME编码会在每76个字符后添加换行符，" +
                         "使得编码后的内容更适合在邮件等场景中使用。";
        
        // MIME编码
        Base64.Encoder mimeEncoder = Base64.getMimeEncoder();
        String encoded = mimeEncoder.encodeToString(longText.getBytes());
        
        // MIME解码
        Base64.Decoder mimeDecoder = Base64.getMimeDecoder();
        byte[] decodedBytes = mimeDecoder.decode(encoded);
        String decoded = new String(decodedBytes);
        
        System.out.println("原始文本: " + longText);
        System.out.println("\nMIME编码后:");
        System.out.println(encoded);
        System.out.println("\n解码后: " + decoded);
    }
}
```

##### 12.5 应用场景

- **数据传输**：在网络传输中确保数据的完整性
- **数据存储**：将二进制数据转换为文本格式存储
- **URL参数**：在URL中传递包含特殊字符的参数
- **邮件附件**：MIME编码用于邮件系统
- **简单加密**：提供基础的数据混淆（注意：不是安全加密）

#### 13. Optional类

##### 13.1 概述

- Optional是Java 8引入的一个容器类，用于解决空指针异常（NullPointerException）
- 它是一个容器，可以容纳任意对象的值（引用类型），包括null

##### 13.2 创建Optional对象

###### 13.2.1 创建空容器

```java
import java.util.Optional;

public class OptionalCreateDemo {
    public static void main(String[] args) {
        // Optional.empty()：创建空容器
        Optional<String> empty = Optional.empty();
        System.out.println("空容器: " + empty);
    }
}
```

###### 13.2.2 创建包含值的容器

```java
import java.util.Optional;

public class OptionalOfDemo {
    public static void main(String[] args) {
        // Optional.of(Object obj)：不允许放空值null
        Optional<String> optional1 = Optional.of("Hello World");
        System.out.println("包含值的容器: " + optional1);
        
        // 以下代码会抛出NullPointerException
        // Optional<String> optional2 = Optional.of(null);
    }
}
```

###### 13.2.3 创建可能为空的容器

```java
import java.util.Optional;

public class OptionalOfNullableDemo {
    public static void main(String[] args) {
        // Optional.ofNullable(Object obj)：obj为null时，创建空容器
        Optional<String> optional1 = Optional.ofNullable("Hello");
        Optional<String> optional2 = Optional.ofNullable(null);
        
        System.out.println("包含值的容器: " + optional1);
        System.out.println("可能为空的容器: " + optional2);
    }
}
```

##### 13.3 判断Optional中是否存有数据

```java
import java.util.Optional;

public class OptionalCheckDemo {
    public static void main(String[] args) {
        Optional<String> optional1 = Optional.of("Hello");
        Optional<String> optional2 = Optional.empty();
        
        // isPresent()：判断是否有值
        System.out.println("optional1是否有值: " + optional1.isPresent());
        System.out.println("optional2是否有值: " + optional2.isPresent());
    }
}
```

##### 13.4 取出Optional中的数据

###### 13.4.1 get()方法

```java
import java.util.Optional;

public class OptionalGetDemo {
    public static void main(String[] args) {
        Optional<String> optional1 = Optional.of("Hello");
        Optional<String> optional2 = Optional.empty();
        
        // get()：如果数据存在则返回，不存在则抛出异常
        String value1 = optional1.get();
        System.out.println("获取的值: " + value1);
        
        // 以下代码会抛出NoSuchElementException
        try {
            String value2 = optional2.get();
            System.out.println("获取的值: " + value2);
        } catch (Exception e) {
            System.out.println("获取空值时抛出异常: " + e.getClass().getSimpleName());
        }
    }
}
```

###### 13.4.2 orElse()方法

```java
import java.util.Optional;

public class OptionalOrElseDemo {
    public static void main(String[] args) {
        Optional<String> optional1 = Optional.of("Hello");
        Optional<String> optional2 = Optional.empty();
        
        // orElse(默认值)：如果数据不存在，返回默认值
        String value1 = optional1.orElse("默认值");
        String value2 = optional2.orElse("默认值");
        
        System.out.println("optional1的值: " + value1);
        System.out.println("optional2的值: " + value2);
    }
}
```

> **使用建议：**
> - Optional主要用于避免空指针异常
> - 创建时根据是否允许null选择合适的方法
> - 取值时优先使用orElse()而不是get()方法
