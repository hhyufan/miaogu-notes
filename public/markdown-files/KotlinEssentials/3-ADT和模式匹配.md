# ADT和模式匹配

## 代数数据类型（ADT）

`代数数据类型(Algebraic Data Type, ADT)`，就是将`像代数一样的数据类型` ，以及用他们`组合`成为新的数据类型的`集合`。

### 计数

每种`数据类型`在`实例化`之后，都会有自己的值，将多个`数据类型`的值相关联，称为`计数`。

### 积类型

`积类型`的表现形式类似于`代数乘法`，表示**`同时拥有`**多种类型的数据类型。

例如我们将`a类型(Boolean) `和 `b类型(Unit)`结合为`c类型(BooleanProductUnit类)` ：

```kotlin
class BooleanProductUnit(a: Boolean, b: Unit)
```

### 和类型

`和类型`对应着`代数加法`，是指`合类型`的`取值`是其中一个`子类型`的数据类型，即**`只能为其中一种`**。

如果`积累性`表示`AND`关系，那么`和类型`则为`OR`关系

`和类型`是`类型安全`的，因为他规定了`所有可能的值`的`情况`，形成`闭环`。

`枚举类`可能就是一个`和类型`：

```kotlin
enum class Day {
    MON,
    TUS,
    WED,
    THU,
    FRI,
    SAT,
    SUN
}
Day.MONDAY  // 每次只能取一种`类型`
```

以上`例子`可以用`密封类`来代替：

```kotlin
sealed class Day {
    class MON: Day()
    class TUS: Day()
    class WED: Day()
    class THU: Day()
    class FRI: Day()
    class SAT: Day()
    class SUN: Day()
}
```

使用`密封类`作为`和类型`的优势是`when`语句无需考虑非法情况，也就是说省略`else` 分支。

```kotlin
fun Schedule(day: Day): Unit = when (day) {
    is Day.MON -> JavaScript()
    is Day.TUE -> Web()
    is Day.WED -> Java()
    is Day.THU -> SQL()
    is Day.FRI -> Cpp()
    is Day.SAT -> Kotlin()
    is Day.SUN -> Algorithm()
}
```

由于`密封类`的子类只能定义在`父类`，或者`父类`同文件中，所以最大确保了`和类型`的`类型安全性`

### 构造代数数据类型

我们可以通过`和类型`以及`积类型`的综合运用，来实现对于`实际问题`的`ADT构建`：

下面是将`三种图形(圆形，长方形，三角形)`根据`参数信息`抽象为`ADT`，并定义`面积计算方法`的例子：

```kotlin
sealed class Shape {
    class Circle(val radius: Double): Shape() // 圆形（给定半径）
    class Rectangle(val width: Double, val height: Double): Shape() // 长方形（给定长和宽）
    class Triangle(val base: Double, val height: Double): Shape() // 三角形（给定底和高）
}
fun getArea(shape: Shape): Double = when (shape) {            // 图形面积计算的方法
    is Shape.Circle -> Math.PI * shape.radius * shape.radius
    is Shape.Rectangle -> shape.width * shape.height
    is Shape.Triangle -> shape.base * shape.height / 2.0
}
```

## 模式匹配

在 `Kotlin` 中，你可以使用 `Regex` 类来进行正则表达式的匹配。

以下是一个简单的示例代码，演示如何在` Kotlin` 中使用`正则表达式`进行匹配：

```kotlin
kotlinCopy Codefun main() {
    val input = "Hello, 123456!"
    val regex = Regex("[0-9]+")
    
    val result = regex.find(input)
    
    if (result != null) {
        println("找到匹配项: ${result.value}")
    } else {
        println("未找到匹配项")
    }
}
```

`模式匹配` 是在复杂的`数据结构`中匹配出`内部的某个属性`进行`访问操作`[^1 ]

所匹配的不光是`正则表达式`，还可以有`其他表达式`。

### 常量模式

通过传入`常量`来获取`结果`的模式匹配叫做`常量模式匹配`[^2 ]：

```kotlin
fun constantPattern(a: Int) = when (a) {
    1 -> "It is 1"
    2 -> "It is 2"
    else -> "It is other number"
}
>>> println(constantPattern(1))
It is 1
```

### 类型模式

将传入的值的`类型`将`给定的模式`相比较的匹配，是`类型模式匹配`。

上面`ADT`的例子，就是`类型模式匹配`

```kotlin
sealed class Shape {
    class Circle(val radius: Double): Shape() // 圆形（给定半径）
    class Rectangle(val width: Double, val height: Double): Shape() // 长方形（给定长和宽）
    class Triangle(val base: Double, val height: Double): Shape() // 三角形（给定底和高）
}
fun getArea(shape: Shape): Double = when (shape) {            // 图形面积计算的方法
    is Shape.Circle -> Math.PI * shape.radius * shape.radius
    is Shape.Rectangle -> shape.width * shape.height
    is Shape.Triangle -> shape.base * shape.height / 2.0
}
>>> val shape = Shape.Rectangle(10.0, 0.5)
>>> println(getArea(shape))
5.0
```

### 逻辑表达式模式

使用`when`进行匹配的时候，还可以进行`逻辑表达式`的匹配。

```kotlin
// 例1
fun logicPattern(a: Int) = when {
    a in 2..11 -> (a.toString() + " is smaller than 10 and bigger than 1")
    else -> "Maybe" + a + "is bigger than 10, or smaller than 1"
}                                                                                                                                               

>>> logicPattern(2)
2 is smaller than 10 and bigger than 1

// 例2
fun logicPattern(a: String) = when {
    a.contains("Yison") -> "Something is about Yison"
    else -> " It's none of Yison's business"
}

>>> logicPattern("Yison is a good boy")
Something is about Yison
```

### 处理嵌套表达式

我们可以使用`模式匹配`来进行更复杂的嵌套表达式的`匹配`，相比`if-else`更加简洁：

```kotlin
sealed class Expr {
    data class Num(val value: Int)：Expr()
    data class Operator(val opName: String, val left: Expr, val right: Expr): Expr()
}
```

上面是一个简单的`数据结构`，用来表达简单的`整数表达式`

我们可以使用`模式匹配`写出对表达式进行`简化`的方法：



```kotlin
// 匹配表达式中为`常量`或`+0`时候的省略操作
fun simplifyExpr(expr: Expr): Expr = when (expr) {
    is Expr.Num -> expr
    is Expr.Operate -> when (expr) {
        Expr.Operate("+", Expr.Num(0), Expr.right) -> expr.right
        Expr.Operate("+", expr.left, Expr.Num(0)) -> expr.left
        else -> expr
    }
}
```

这就是`模式匹配`中访问`复杂数据结构`某一个值的过程。

如果我们想要获取`更深层次嵌套`中的某个`属性`，我们可以使用`递归`的思想来实现：

```kotlin
fun simplifyExpr(expr: Expr): Expr = when (expr) {
    is Expr.Num -> expr
    is Expr.Operate -> when (expr) {
        Expr.Operate("+", Expr.Num(0), Expr.right) -> simplifyExpr(right)
       
        Expr.Operate("+", expr.left, Expr.Num(0)) -> expr.left
        else -> expr
    }
}
```

显而易见，这种`递归`只供我们匹配出下面这种情况，而不是所有`嵌套情况`：

```kotlin
val expr = Expr.Operate("+", Expr.Num(0), Expr.Operate("+", Expr.Num(1), Expr.Num(0)))
```

我们可以使用`更复杂的逻辑表达式`来代替`递归实现`，然而面对`更深层次的嵌套关系`，该方案`不一定适合`

### 类型测试

可以使用`类型测试 + 类型转换`的方式来实现`模式匹配`。

由于`kotlin`支持`smart casts`，我们只需要进行`类型测试`：

```kotlin
fun simplifyExpr(expr: Expr): Expr = when (expr) {
    is Expr.Num -> expr
    is Expr.Operate -> when {
        （expr.left is Expr.Num && expr.left.value == 0) && (expr.right is Expr.Operate) 
             -> when (expr.right) {
                 Expr.Operate("+", Expr.Num(0), expr.right) -> simplifyExpr(expr.right)
                 Expr.Operate("+", expr.right.left, Expr.Num(0)) -> expr.right.left
                 else expr.right
             }
        else -> expr
    }
}
```

其实这就是之前说过的`复杂逻辑表达式`实现`模式匹配`。体现了`类型测试`的`模式匹配`思想。

在`kotlin`中，使用这种方式基本不能增强`模式匹配`。

### 面向对象的分解

`面向对象分解`是通过`类型测试`，在`父类`定义`一系列测试方法`，然后`子类`实现他们来进行`对应操作`

以下通过`面向对象分解`实现解决`嵌套表达式模式匹配`的代码：

```kotlin
sealed class Expr {
    abstract fun isZero() : Boolean
    abstract fun isAddZero() : Boolean
    abstract fun left() : Expr
    abstract fun right() : Expr
    
    data class Num(val value: Int) : Expr() {
        override fun isZero(): Boolean = this.value == 0
        override fun isAddZero(): Boolean = false
        override fun left(): Expr = throw Throwable("no element")
        override fun right(): Expr = throw Throwable("no element")
        
    }
    data class Operate(val opName: String, val left: Expr, val right: Expr) : Expr() {
        override fun isZero(): Boolean = false
        override fun isAddZero(): Boolean = this.opName == "+" && (this.left.isZero() || this.right.isZero())
        override fun left(): Expr = this.left
        override fun right(): Expr = this.right
    }
}

fun simplifyExpr(expr : Expr) : Expr = when {
    expr.isAddZero() && expr.right().isAddZero() && expr.right().left().isZero() -> expr.right().right()
    else -> expr
}

fun main() {
    val expr = simplifyExpr(Expr.Operate("+", Expr.Num(0),
        Expr.Operate("+", Expr.Num(0), Expr.Num(1))))
    println(simplifyExpr(expr))
}
```

通过`面向对象`分解，我们终于可以灵活的进行`嵌套表达式`的`模式匹配`了。

---

>采用`面向对象分解`的方式，我们确实将代码简化了，但是在业务代码中，我们的`需求`远比这个例子要`复杂`。
>
>这意味着我们要在`Expr类`中实现更多的代码，而且`方法的实现`也会越来越`复杂`。
>
>我们添加一个`子类`的测试方法，我们必须在其他`子类`里面再实现一遍。
>
>除非我们的业务需求`简单`，可以使用`面向对象分解`。否则应该使用`访问者设计模式`

---

### 访问者设计模式

`访问者设计模式`，是指通过定义额外的`Visitor`类来`访问`我们需要进行操作的`类`。

继而不用在`操作类`中实现`太多方法`，以下是`访问者设计模式`的简化`整数表达式`版本：

```kotlin
sealed class Expr {
    abstract fun isZero(v: Visitor): Boolean
    abstract fun isAddZero(v: Visitor): Boolean
    abstract fun simplifyExpr(v: Visitor): Expr
    
    class Num(val value: Int): Expr() {
        override fun isZero(v: Visitor): Boolean = v.matchZero(this)
        override fun isAddZero(v: Visitor): Boolean = v.matchAddZero(this)
        override fun simplifyExpr(v: Visitor): Expr = v.doSimplifyExpr(this)
    }
    class Operate(val opName: String, val left: Expr, val right: Expr) : Expr() {
        override fun isZero(v: Visitor): Boolean = v.matchZero(this)
        override fun isAddZero(v: Visitor): Boolean = v.matchAddZero(this)
        override fun simplifyExpr(v: Visitor): Expr = this
    }
}

class Visitor {
    fun matchAddZero(expr: Expr.Num): Boolean = false
    fun matchAddZero(expr: Expr.Operate): Boolean = when(expr) {
        Expr.Operate("+", Expr.Num(0), expr.right) -> true
        Expr.Operate("+", expr.left, Expr.Num(0)) -> true
        else -> false
    }
    fun matchZero(expr: Expr.Num): Boolean = expr.value == 0
    fun matchZero(expr: Operate): Boolean = false
    fun doSimplifyExpr(expr: Expr.Operate, v: Visitor): Expr = when {
        (expr.right is Expr.Num && v.matchAddZero(expr) && v.matchAddZero(expr.right)) 
            && (expr.right is Expr.Operate && expr.right.left is Expr.Num) 
                && v.matchZero(expr.right.left) -> expr.right.left
        else -> expr
    }
}
```

如果我们的`数据结构`在后期不会有太大改变，且`业务逻辑`比较复杂，可以使用`访问者设计模式`进行`模式匹配`

[^1 ]: `kotlin`并不是完全支持`模式匹配`。但可以实现`模式匹配`中的`功能`和`思想`。
[^2 ]: 我们所熟知的简单条件语句（诸如`if-else`、`when`）都可以是`常量模式匹配`。

