# web管理端

## ◇ 开发规范

### 一、目录规范

#### 1、将同一功能模块放入同一文件夹内

#### 2、某一模块的接口、类型使用对应模块的.d.ts文件内，并位于该功能模块的根目录下

└ page  <br>
&emsp;└ login  <br>
&emsp;&emsp;├ index.vue <br>
&emsp;&emsp;├ default.vue <br>
&emsp;&emsp;├ code.vue  <br>
&emsp;&emsp;└ <font color="seagreen">login.d.ts</font>  <br>
&emsp;└ other  <br>
&emsp;└ ~~<font color="red" style>login.d.ts</font>~~  <br>
        ...  <br>
└ ~~<font color="red">login.d.ts</font>~~  <br>

#### 3、 公共组件写在 src/components 目录

通常来说，组件还会细分为ui组件和业务组件。
> ui组件会包含一些基础的组件，比如按钮、输入框、下拉框等。
> 业务组件则是根据业务需求封装的组件，比如用户列表、商品列表等。

ui组件专注于样式及内部逻辑实现，不能包含业务逻辑，如数据不应在内部远程获取，而应该外部传入使用。
业务组件专注于业务逻辑实现，不再关注样式及渲染逻辑，通常依赖于ui组件。

#### 4、 公共方法写在 src/utils 目录

#### 5、 接口在 src/api 目录

  使用pnpm refresh:api脚本自动生成。
  其中`src/api`及`src/entity`目录由脚本生成，不要在下面新建文件。

#### 6、 公共ts类型写在 src/types 目录

#### 7、 公共样式写在 src/style 目录

#### 8、 静态资源存放于 /public 目录

  图片按功能功能模块分类存放

### 二、vue

#### 1、为每个SFC显示命名，使用多单词、大驼峰方式命名

```javascript
// 选项式
export default {
    name: 'HomePage'  // ✔
    name: 'homePage'  // ✘
    name: 'home-page' // ✘
}
// 组合式 name根据文件名推断
//--HomePage.vue  ✔
//--homePage.vue  ✘
//--home-page.vue  ✘

```

#### 2、基础组件名

  ***对于无法使用对单词命名的SFC，统一使用Base作为前缀开头。***

  ```javascript
  components/
    ├ BaseIcon.vue  // ✔
    ├ baseIcon.vue  // ✘
    ├ Icon.vue  // ✘
    ├ icon.vue  // ✘
  ```

#### 3、api命名

接口方法使用 `camelCase` 驼峰命名，命名为`动词`+`名词`形式。
接口使用的参数名使用 `camelCase` 驼峰命名。
参数使用的type或interferer使用 `PascalCase` 大驼峰命名，并在`/src/types`下定义。

#### 4、为style标签加入scoped,避免样式污染

### 三、js

#### 1、优先处理错误逻辑，提前return,以优化代码结构（参考permission.ts路由守卫优化前后）

#### 2、减少使用 forEach/map/for ，使用forof等其它代替。提前跳出（continue）或者结束（return）循环，以优化代码结构

#### 3、函数内避免过多处理逻辑

  在一个函数中，如果处理逻辑很多，需要拆分多个方法来处理。*<span style="color:#e6a23c;font-size=12px">e.g.</span>*

  ```javascript
  // ✘
  function fn() {
    // 逻辑a
    // 逻辑b
    // 逻辑c
  }
  ```

  应写为：

  ```javascript
  // ✔
  function fn() {
    a()
    b()
    c()
  }
  function a() {
    // 逻辑a
  }
  function b() {
    // 逻辑b
  }
  function c() {
    // 逻辑c
  }
  ```

#### 4、使用模板字符串代替 “+” 拼接

#### 5、使用 Promise，async/await 代替回调函数

#### 6、推荐使用箭头函数，以避免this的不确定性

### 四、html

#### 1、使用自闭合标签

#### 2、使用语义化标签

#### 3、为图片设置alt属性

### 五、css

#### 1、减少样式嵌套层数

使用scss/less语法时，应减少嵌套层数。以优化页面渲染速度。

#### 2、不要使用*选择元素

#### 3、避免使用行内样式

#### 4、避免标签选择器及id选择器

#### 5、避免使用!important

#### 6、减少、避免使用固定宽度、固定高度

### 六、pinia规范

#### 1. 模块命名规范

使用Use开始，以Store结束,中间为模块名称。
*<span style="color:#e6a23c;font-size=12px">e.g.</span>*

```javascript
const UsePermissionStore = defineStore('permissionStore', {});
export default UsePermissionStore
```

#### 2. ts数据类型

pinia中使用的数据类型统一写入 *<font color='#409eff'>storeType.d.ts</font>* 文件中
目录： /src/store/storeType.d.ts
