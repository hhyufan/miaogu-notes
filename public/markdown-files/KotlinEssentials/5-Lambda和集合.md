 # Lambda和集合

## Lambda

### 函数式接口调用

我们在`Java`安卓开发中`OnClickListener`函数式接口：  

```java
public interface OnClickListener {
    void onClick(View v);
}
view.setOnClickListener(new OnClickListener() {
    @override
    public void onClick(View v) {
        ...
    }
})
```

以上在`kotlin`中会被转化为：

```kotlin
view.setOnClickListener(object : OnClickListener {
    override fun onClick(v: View) {
        ...
    }
})
```

在`kotlin`中，`任何函数`接收一个`Java`的`SAM(单一抽象方法)`都可以用`函数`替代

以上代码我们可以看做`kotlin`实现了以下方法：

```kotlin
fun setOnClickListener(listener: (View) -> Unit)
```

由于`语法糖`[^1 ]，在调用时：

```kotlin
view.setOnClickListener {
    ...
}
```

### 带接收者的Lambda

在`kotlin`中，我们可以直接定义一个`带有接收者`的函数类型：

```kotlin
val sum: Int.(Int) -> Int = {other -> plus(other)}
>>> 2.sum(1)
3
```

kotlin还有一种`语法`，叫做`类型安全构造器`，结合`带有接收者的Lambda`，我们可以构建`类型安全`的`HTML`代码：

```kotlin
class HTML {
    fun body() { ... }
}
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML() // 创建接收者对象
    html.init()       // 把接收者对象传递给Lambda
    return html
}
html {
    body()            // 调用接收者对象的body方法
}
```

### with和apply

`with` 和`apply`方法最主要的作用是`省略`多次书写的`对象`，默认用`this`指代，可省略：

`with`函数的第一个参数为`接收者类型`，通过第二个参数创建这个类型的`block`方法，可以返回`自由`的类型，实现如下：

```kotlin
inline fun<T, R> with(receiver: T, block: T.() -> R): R
```

`apply`函数直接被`声明`为`类型T`的`扩展方法`，block参数是一个返回`Unit`类型的函数，实现如下：

```kotlin
inline fun <T> T.apply(block: T.() -> Unit): T
```

应用实例如下：

```kotlin
data class Person(var name: String = "", var age: Int = 0)

fun main() {
    val person = Person().apply {
        name = "John"
        age = 30
    }

    with(person) {
        println("Name: $name, Age: $age")
    }
}
```

## 集合

### 高阶函数API

以下面的集合为例，讲解`集合函数API`的用途：

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)
```

| API名称   | 作用描述                                     | 代码示例                            |  执行结果    |
| --------- | -------------------------------------------- | ---------------------------------------- | ---- |
| `map`     | 对集合中的每个元素执行指定转换函数           | ` numbers.map { it * it }` | [1, 4, 9, 16, 25] |
| `filter`  | 根据给定的条件过滤集合中的元素               | `numbers.filter { it % 2 == 0 }` | [2, 4] |
| `count`   | 返回集合中满足指定条件的元素数量             | `numbers.count { it > 2 }` | 3 |
| `sumBy`   | 计算集合中所有元素的整数属性的总和           | `numbers.sumBy { it * it }` | 55 |
| `sum`     | 计算集合中所有元素的总和numbers.sum()        | `numbers.sum()`                                           | 15 |
| `fold`    | 将集合中的元素按顺序累积运算                 | `numbers.fold(1) { acc, num -> acc * num }` | 120 |
| `reduce`  | 将集合中的元素按顺序两两组合                 | `numbers.reduce { acc, num -> acc + num }` | 15 |
| `groupBy` | 根据给定的键选择器函数对集合中的元素进行分组 | `numbers.groupBy { if (it % 2 == 0) "偶数" else "奇数" }` | {"奇数"=[1, 3, 5], "偶数"=[2, 4]} |
| `flatMap` | 对集合中的每个元素应用指定的转换函数，并将结果合并到一个单一的列表中 | `numbers.flatMap { listOf(it, it * 2) }`                  | [1, 2, 2, 4, 3, 6, 4, 8, 5, 10] |
| `flatten` | 将包含嵌套集合的集合扁平化                                   | `listOf(listOf(1, 2), listOf(3, 4), listOf(5)).flatten()` | [1, 2, 3, 4, 5] |

`kotlin集合`还有更多`高阶函数API`，具体请查阅`kotlin文档`。

### 常用集合

- `List`：表示`有序`，`可重复`的列表，元素为`线性存储`，元素`可重复`

  ```kotlin
  >>> listOf(1, 2, 3, 4, 4, 5, 5)
  [1, 2, 3, 4, 4, 5, 5]
  ```

- `Set`：表示`不可重复`的`集合`，具体实现分为`HashSet`[^2 ]和`TreeSet`[^3 ]。

  ```kotlin
  >>> setOf(1, 2, 3, 4, 4, 5, 5)
  [1, 2, 3, 4, 5]
  ```

- `Map`：表示`键值对`元素的`集合`，又称为`映射`，`键`是`不能重复`的：

  ```kotlin
  >>> mapOf(1 to 1, 2 to 2, 3 to 3)
  {1=1, 2=2, 3=3}
  ```

### 可变集合与只读集合

`可变集合`是指`可以被改变`的集合，这种集合通常以`Mutable`为修饰前缀：

```kotlin
>>>val list = mutableListOf(1, 2, 3, 4, 5)
>>>list[0] = 0
>>>list
[0, 2, 3, 4, 5]
```

`只读集合`是指`一般情况无法修改`的集合：

```kotlin
>>>val list = listOf(1, 2, 3, 4, 5)
>>>list[0] = 0
>>>list
unresolved reference
```

`只读集合`只是只有`读取方法`的集合，所以某些情况只读集合`可以被改变`：

```kotlin
val writeList: MutableList<Int> = mutableListOf(1, 2, 3, 4)
val readList: List<Int> = writeList
>>> readList
[1, 2, 3, 4]
>>> writeList[0] = 0
>>> readList
[0, 2, 3, 4]
```

当我们与`Java`进行`互操作`的时候，也会产生这种`情况`：

`Java`定义`集合操作`：

```kotlin
public static List<Int> foo(List<Int> list) = {
    for (int i = 0; i < list.size(); ++i) {
        list[i] = list[i] * 2;
    }
    return list;
}
```

当我们在`kotlin`中使用方法的时候：

```kotlin
fun bar(list: List<Int>) = println(foo(list))
```

由于`Java`不区分`只读集合`和`可变集合`，传入`bar`方法中的`list`会被`foo`方法所改变

```kotlin
>>>val list = listOf(1, 2, 3, 4)
>>>bar(list)
[2, 4, 6, 8]
>>>list
[2, 4, 6, 8]
```

`实际开发`中，我们应该尽量`避免` `只读集合`被`改变`

## 序列

当处理`很多元素`的集合的时候，  我们可以使用`惰性集合[序列(Sequence)]`来减少`性能开销`

通过`asSequence`可以把`列表`转换为`序列`，并且可以通过`toList`将`序列`转换为`列表`：

```kotlin
list.asSequence().filter {it > 2}.map {it * 2}.toList()
```

`序列`的元素`求值`是`惰性的`，意思是`需要时`[^4 ]才会进行`求值运算`

### 序列操作方式

- 中间操作：产生`中间集合`的`操作`，如上述的`filter`和`map`
- 末端操作：`返回结果`的`操作`，如上述的`toList`

序列操作需要注意：

- **惰性求值**：由于序列操作是`惰性的`，在`只有` `中间操作`的`序列操作`中，中间操作不会被`执行`
- **链式操作**：序列在执行`链式操作`的时候，会将`所有`操作`应用`在1个元素后，再去执行另一个元素的`操作`
- **中断操作**：当某个元素的`中间操作`被`中断`的时候，后续的`中间操作`不会被执行。

### 无限序列

我们可以通过`kotlin`提供的`数据源`去创建无限数列，我们可以通过`take`来限制取出的数量

结合序列操作方式，可以写出以下示例：

```kotlin
fun main() {
    // 创建一个简单的数据源，表示一组数字
    val numbers = generateSequence(1) { it + 1 }

    // 对序列进行链式操作
    val result = numbers
        // 中间操作1：筛选出偶数
        .filter {
            println("F$it")
            it % 2 == 0
        }
        // 中间操作2：将每个偶数加倍
        .map {
            println("M$it")
            it * 2
        }
        // 中间操作3：仅保留前 2 个元素
        .take(2)
        // 终端操作：将结果打印出来
        .toList()

    println("Result: $result")
}
// 结果
F1
F2
M2
F3
F4
M4
Result: [4, 8]
```

此外`takeWhile`会根据while条件来控制序列的中断，这里不再赘述。

---

>**Kotlin的序列与Java的Stream流的异同**
>
>- 和`序列`一样，Java的`Stream`也存在`中间操作`，`末端操作`以及`惰性求值`等特性
>- `Stream流`是`一次性`的，因此只能在`Stream流`中遍历`一次`，然后必须`创建新的流`进行`再次遍历`
>- `Stream流`可以`并行`的处理数据，序列`目前`不行
---

## 内联函数

`内联函数`的出现是为了优化`Lambda`表达式产生的额外开销[^5 ]

### inline

我们可以使用`inline`修饰符定义一个`内联函数`，编译器会将函数体的代码直接`插入到调用处`，而不是创建一个`函数调用`，以减少`性能开销`

```kotlin
// 定义一个使用 inline 关键字的函数
inline fun inlineAdd(a: Int, b: Int): Int {
    return a + b
}
fun main() {
     // 内联函数调用
    val result = inlineAdd(3, 4)
    println("Result of inlineAdd function: $result")
}
```

---

> 以下情况我们应该尽量避免使用`内联函数`：
>
> - `JVM`会对`普通的函数`根据`实际情况` `智能判断`是否进行`内联优化`，我们不需要使用`inline`来使`字节码复杂化`
> - 尽量避免对`大量函数体`的函数进行`内联`，会导致`过多的字节码`数量
> - 一旦一个函数被定义为`内联函数`，不能获取`闭包类`[^6 ]的`私有成员`，除非你把他们定义为`internal`

### noinline

我们可以通过`noinline`来避免部分函数的`参数` `不被内联`：

```kotlin
inline fun executeFunction(inlineFunc: () -> Unit, noinline noInlineFunc: () -> Unit) {
    println("Executing inline function:")
    inlineFunc()

    println("Executing non-inline function:")
    noInlineFunc()
}

fun main() {
    executeFunction(
        { println("This is an inline function.") },
        { println("This is a non-inline function.") }
    )
}
```

当我们调用 `executeFunction` 时，传递的第一个参数是内联函数，而第二个函数参数使用了 `noinline` 关键字，表示这个函数`不会被内联`。

### 非局部返回

正常情况下，函数体内的`return`只会在该函数的`局部生效`，但我们使用`内联函数`，会在`内联处`产生`return`

```kotlin
fun main(args: Array<String>) {
    foo { return }
}
inline fun foo(returning: () -> Unit) {
    println("before local return")
    returning()
    println("afterlocal return")
    return
}
// 运行结果
before local return
```

内联函数foo的函数体以及参数`Lambda`会替换为`具体的调用`，所以实际代码中`returning`后的代码因为被`return`而`中断执行`

这就是`非局部返回`，在`循环控制`中格外有用：

```kotlin
fun hasZeros(list: List<Int>): Boolean {
    list.forEach {
        if (it == 0) return true // 在hasZeros直接返回forEach中foo的执行结果
    }
}
```

因为`forEach`的实现是一个`内联函数`，所以我们可以直接在`forEach`的`foo函数`内部`退出上一层`的程序。

---

>##### **使用标签实现Lambda非局部返回**
>
>我们可以在不声明`inline`修饰符的情况下，使用`@`标签达到相同效果：
>
>```kotlin
>fun main(args: Array<String>) {
>        foo { return@foo }
>}
>fun foo(returning: () -> Unit) {
>        println("before local return")
>        returning()
>        println("afterlocal return")
>        return
>}
>// 运行结果
>before local return
>```

### crossinline

有时候为了避免`局部性返回`产生破坏，我们可以使用`crossinline`修饰`参数`来`杜绝`此问题发生:

```kotlin
fun main(args: Array<String>) {
    foo { return }
}
inline fun foo(crossinline returning: () -> Unit) {
    println("before local return")
    returning()
    println("afterlocal return")
    return
}
// 运行结果
Error:(2, 11) kotlin: 'return' is not allowed here
```

### 具体化参数类型

由于`类型擦除`，我们不能`直接获取`具体的`参数类型`，但由于`内联函数`直接在`字节码`中生成相对应的`代码实现`

所以我们可以通过这种方式获取`参数具体类型`，使用`reified`修饰符来实现这一效果：

```kotlin
fun main(args: Array<String>) {
    getType<Int>()
}
inline fun <reified T> getType() {
    print (T::class)
}
// 运行结果
class kotlin.Int
```




[^1 ]: 当一个函数只存在唯一的`函数类型参数`，外部的`括号`可以省略

[^2 ]: `HashMap`使用`Hash散列`来`存储数据`，不保证元素的`有序性`
[^3 ]: `TreeMap` 底层结构是`二叉树`，保证元素`有序性`
[^4 ]: `表达式`不会在被`绑定到变量`之后`立即`求值，而是在该值`被取用`的时候才去`求值`
[^5 ]: `kotlin`中，每次声明一个`Lambda`表达式，就会在`字节码`中产生一个`匿名类`。`匿名类`中包含`invoke`方法，每次调用还会产生`新对象`
[^6 ]: `闭包类（Closure class）`是 用于表示捕获`外部变量的 Lambda 表达式`的一种`特殊类型`。闭包类在内部持有`捕获变量`，并提供了`函数`来执行` Lambda 表达式`。
