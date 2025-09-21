# JDBC

## 概述

- **JDBC(Java Database Connectivity)**：Java和数据库连接的技术
- JDBC是Java和数据库操作的协议，在代码层面就是一个接口

## JDBC API

### 核心接口
- **Connection**：连接
- **Statement**：句柄
- **ResultSet**：结果集

## 基本操作流程

### 1. 导入数据库驱动
- 创建lib目录
- 将数据库驱动jar包放入lib目录

### 2. 注册驱动
```java
Class.forName("com.mysql.cj.jdbc.Driver")
```

### 3. 创建连接
```java
DriverManager.getConnection(url, username, password)
```

### 4. 创建句柄
```java
Statement statement = connection.createStatement();
statement.execute(sql)
```

### 5. 关闭资源
```java
statement.close();
```

## PreparedStatement

### Statement的问题
- 容易造成数据丢失
- 容易造成SQL注入攻击

#### SQL注入攻击
- 利用系统对输入数据的检查漏洞，注入SQL语句和命令，从而利用SQL引擎进行恶意行为

### PreparedStatement特点
- `PreparedStatement`用于执行预编译SQL语句
- 用`?`作为参数占位符
- 有效防止SQL注入攻击

### 自增主键处理
`PreparedStatement`提供了专门的机制来获取自增主键

#### 使用方法
```java
// 1. 使用常量声明返回自增主键（常量值为1，默认为2）
conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)

// 2. 执行更新
pstmt.executeUpdate();

// 3. 获取主键
ResultSet generatedKeys = pstmt.getGeneratedKeys();

// 4. 通过索引取值（只能通过索引）
generatedKeys.getInt(1);
```

### 批处理
- 执行多条SQL语句的技术，通过减少与数据库的交互次数来提升性能

#### 使用方法
```java
// 1. 加入批处理队列
pstmt.addBatch();

// 2. 执行批处理，返回各语句受影响的行数（-2表示成功但无计数）
int[] affectedRows = pstmt.executeBatch();
```

## ResultSet

### 常用方法
- `boolean next()`：光标向下移动一行，判断是否存在数据
- `xxx getXxx(int index)`：获取指定列数据，Xxx代表数据类型
- `xxx getXxx(String columnName)`：根据字段名称获取指定列数据，Xxx代表数据类型

## 数据类型处理

### 基本原则
- JDBC原生数据类型处理，后续Mybatis框架有其他处理方式

### 布尔类型
- Java的布尔类型和MySQL整型自动转换

### 日期时间类型
- 使用Date的SQL实现版本：`java.sql.Date`

#### 设置日期
- `setTimestamp`：设置时间戳，完整时间
- `setDate`：设置日期，不包含时间
- `setTime`：设置时间，不包含日期

#### 读取日期
- `getTimestamp`：获取时间戳，完整时间
- `getDate`：获取日期，不包含时间
- `getTime`：获取时间，不包含日期

## 事务处理

### 事务管理
- JDBC通过Connection对象处理事务，默认自动提交，需关闭

### 手动事务管理方式
```java
// 1. 关闭自动事务处理
setAutoCommit(false)

// 2. 事务结束后提交
commit()

// 3. 回滚[可选]
rollback()
```

## Model

### MVC三层架构
- 软件工程中一种经典的架构模式，通过将应用程序分为三个核心部分（Model、View、Controller），实现关注点分离

### Model层
- Model层指的是业务模型，包括数据和业务处理的全部操作

### Dao（数据访问层）
- 数据访问对象，一般称为持久层，针对数据库进行增删改查操作

### Service（业务层）
- 业务层，调用Dao层实现具体业务处理

### 实现规范
- Dao / Service 都是接口，实现在其软件包下的impl包进行实现

### JDBCUtils
- 工具类，用于简化JDBC操作
```java
/**
 * 数据库工具类
 */
public final class DBUtils {

    private final String URL = "jdbc:mysql://127.0.0.1:3306/school?serverTimezone=Asia/Shanghai"; // 数据库连接地址
    private final String USERNAME = "root"; // 用户名
    private final String PASSWORD = "root"; // 密码

    // 单例模式
    private static DBUtils dbUtils;

    private DBUtils() {
    }

    public static synchronized DBUtils newInstance() {
        if (dbUtils == null) {
            dbUtils = new DBUtils();
        }
        return dbUtils;
    }

    static {
        // 加载驱动
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");  // mysql8驱动
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    // 获得连接
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    // 关闭资源
    public void close(Connection conn, Statement stmt) {
        try {
            stmt.close();
            conn.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void close(Connection conn, Statement stmt, ResultSet rs) {
        try {
            rs.close();
            stmt.close();
            conn.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
```
## 使用函数式封装优化JDBC

### 优化目标
- 减少重复代码
- 提高代码可读性
- 简化异常处理
- 统一资源管理

### 函数式接口设计

#### 核心函数式接口
```java
/**
 * 可能抛出SQL异常的消费者接口
 */
public interface SqlConsumer<T> {
    void accept(T t) throws SQLException;
}

/**
 * 可能抛出SQL异常的函数接口
 */
@FunctionalInterface
public interface ThrowingFunction<T, R> {
    R apply(T t) throws SQLException;
}
```

### JDBCUtils工具类实现

#### 单例模式 + 配置文件管理
```java
/**
 * JDBC 工具类 - 懒汉式单例 + 资源自动管理
 */
public class JDBCUtils {
    // 懒汉式单例实例
    private static volatile JDBCUtils instance;
    
    private final String driver;
    private final String url;
    private final String username;
    private final String password;
    
    private Properties dbProperties;
    
    // 私有构造函数
    private JDBCUtils() {
        loadProperties();
        this.driver = dbProperties.getProperty("db.driver");
        this.url = dbProperties.getProperty("db.url");
        this.username = dbProperties.getProperty("db.username");
        this.password = dbProperties.getProperty("db.password");
        initializeDriver();
    }
    
    /**
     * 获取单例实例 - 双重检查锁
     */
    public static JDBCUtils getInstance() {
        if (instance == null) {
            synchronized (JDBCUtils.class) {
                if (instance == null) {
                    instance = new JDBCUtils();
                }
            }
        }
        return instance;
    }
}
```

#### 函数式查询方法
```java
/**
 * 执行查询（支持参数设置和结果映射）
 */
public <T> List<T> executeQuery(String sql,
                               SqlConsumer<PreparedStatement> parameterSetter,
                               ThrowingFunction<ResultSet, T> resultMapper) {
    try (Connection conn = getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        // 设置参数（如果提供了参数设置器）
        if (parameterSetter != null) {
            parameterSetter.accept(ps);
        }
        
        try (ResultSet rs = ps.executeQuery()) {
            List<T> resultList = new ArrayList<>();
            // 循环处理所有结果行
            while (rs.next()) {
                resultList.add(resultMapper.apply(rs));
            }
            return resultList;
        }
    } catch (SQLException e) {
        throw new RuntimeException("数据库查询失败: " + sql, e);
    }
}

/**
 * 执行更新（支持参数设置）
 */
public int executeUpdate(String sql, SqlConsumer<PreparedStatement> parameterSetter) {
    try (Connection conn = getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        // 设置参数（如果提供了参数设置器）
        if (parameterSetter != null) {
            parameterSetter.accept(ps);
        }
        
        return ps.executeUpdate();
    } catch (SQLException e) {
        throw new RuntimeException("数据库更新失败: " + sql, e);
    }
}
```

### DAO层使用示例

#### 基础CRUD操作
```java
public class BaseScoreDaoImpl implements BaseScoreDao {
    private final JDBCUtils jdbcUtils = JDBCUtils.getInstance();
    
    @Override
    public List<Score> findAll() {
        String sql = "SELECT * FROM sc";
        return jdbcUtils.executeQuery(sql, Score::new);
    }
    
    @Override
    public List<Score> findByStudentId(String sid) {
        String sql = "SELECT * FROM sc WHERE sid = ?";
        return jdbcUtils.executeQuery(
            sql,
            ps -> ps.setString(1, sid),  // 参数设置
            Score::new                   // 结果映射
        );
    }
    
    @Override
    public List<Score> findByScoreRange(Double minScore, Double maxScore) {
        String sql = "SELECT * FROM sc WHERE score >= ? AND score <= ?";
        return jdbcUtils.executeQuery(
            sql,
            ps -> {
                ps.setDouble(1, minScore);
                ps.setDouble(2, maxScore);
            },
            Score::new
        );
    }
}
```

### ServiceUtils业务层工具类

#### 通用数据处理方法
```java
/**
 * 业务层通用工具类 - 提供适用于所有Service的通用数据处理方法
 */
public class ServiceUtils {
    
    /**
     * 通用的一对多数据拼接方法
     */
    public static <M, R, T> List<T> joinOneToMany(List<M> mainList,
                                                  Function<M, List<R>> relatedDataProvider,
                                                  BiFunction<M, R, T> combiner) {
        List<T> result = new ArrayList<>();
        for (M main : mainList) {
            List<R> relatedList = relatedDataProvider.apply(main);
            for (R related : relatedList) {
                result.add(combiner.apply(main, related));
            }
        }
        return result;
    }
    
    /**
     * 通用的数据聚合计算方法
     */
    public static <M, R, A, T> List<T> aggregateAndFilter(List<M> mainList,
                                                          Function<M, List<R>> relatedDataProvider,
                                                          Function<List<R>, A> aggregator,
                                                          Predicate<A> filter,
                                                          BiFunction<M, A, T> resultMapper) {
        List<T> result = new ArrayList<>();
        for (M main : mainList) {
            List<R> relatedList = relatedDataProvider.apply(main);
            
            if (!relatedList.isEmpty()) {
                A aggregatedValue = aggregator.apply(relatedList);
                
                if (filter.test(aggregatedValue)) {
                    result.add(resultMapper.apply(main, aggregatedValue));
                }
            }
        }
        return result;
    }
    
    /**
     * 通用的数据过滤和转换方法
     */
    public static <S, T> List<T> filterAndMap(List<S> dataList,
                                             Predicate<S> filter,
                                             Function<S, T> mapper) {
        return dataList.stream()
            .filter(filter)
            .map(mapper)
            .collect(Collectors.toList());
    }
}
```

### Service层使用示例

#### 复杂业务逻辑简化
```java
public class ScoreServiceImpl implements ScoreService {
    private final ScoreDao scoreDao = new ScoreDaoImpl();
    private final StudentDao studentDao = new StudentDaoImpl();
    
    // 检索1990年后出生学生的各科成绩
    @Override
    public List<StudentScoreDTO> getScoresOfStudentsBornAfter1990() {
        // 1. 获取1990年后出生的学生
        Date startDate = java.sql.Date.valueOf("1990-01-01");
        List<Student> students = studentDao.findByBirthdayAfter(startDate);
        
        // 2. 使用ServiceUtils进行一对多数据拼接
        return ServiceUtils.joinOneToMany(
            students,
            student -> scoreDao.findByStudentId(student.getSid()),
            (student, score) -> StudentScoreDTO.builder()
                .stuname(student.getStuname())
                .cid(score.getCid())
                .score(score.getScore())
                .build()
        );
    }
    
    // 检索平均成绩在60分以上的学生
    @Override
    public List<StudentAvgScoreDTO> getStudentsWithAvgScoreAbove60() {
        List<Student> allStudents = studentDao.findAll();
        
        // 使用ServiceUtils进行聚合计算并过滤
        return ServiceUtils.aggregateAndFilter(
            allStudents,
            student -> scoreDao.findByStudentId(student.getSid()),
            scores -> scores.stream()
                .mapToDouble(Score::getScore)
                .average()
                .orElse(0.0),
            avgScore -> avgScore > 60.0,
            (student, avgScore) -> StudentAvgScoreDTO.builder()
                .stuname(student.getStuname())
                .avgScore(avgScore)
                .build()
        );
    }
}
```

### 函数式封装的优势

#### 1. 代码简洁性
- **传统方式**：每个查询方法都需要重复的连接管理、异常处理代码
- **函数式方式**：通过lambda表达式，专注于业务逻辑本身

#### 2. 资源管理
- **自动资源管理**：try-with-resources确保连接、语句、结果集自动关闭
- **统一异常处理**：将SQLException包装为RuntimeException，简化调用方代码

#### 3. 类型安全
- **泛型支持**：`ThrowingFunction<ResultSet, T>`确保结果映射的类型安全
- **编译时检查**：lambda表达式提供编译时类型检查

#### 4. 可复用性
- **通用工具方法**：ServiceUtils提供的通用方法可在所有Service中复用
- **函数式组合**：可以轻松组合多个函数来实现复杂的业务逻辑

#### 5. 测试友好
- **依赖注入**：函数作为参数传入，便于单元测试时mock
- **职责分离**：数据访问、参数设置、结果映射职责清晰分离