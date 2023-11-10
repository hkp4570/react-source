# React16 源码实现

## 简化逻辑

1. createElement 方法  （JSX解析）
   - 实现过程中，当引入自己写的react包时，babel会自动使用createElement方法编译jsx
2. render方法
   - stack架构，递归，无法被打断
3. concurrent mode（Fiber）
   - requestIdleCallback
4. Fibers Node
   - workLoop 深度优先遍历
5. Render and Commit 阶段
6. reconcile 协调
7. Function Components
   - 普通的jsx和函数组件的区别（type值不一致，导致无法根据type创建DOM并且把字元素append进去，需要执行函数，props作为参数；函数组件内的props属性中children是没有的）
8. hooks
   - 自己先实现useState，目前存在的问题，当更改状态的时候，页面中会把函数组件重新插入一遍
