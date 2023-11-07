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
