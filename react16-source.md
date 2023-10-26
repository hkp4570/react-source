# React16 源码实现

## 简化逻辑

1. createElement 方法  （JSX解析）
   - 实现过程中，当引入自己写的react包时，为什么会自动调用createElement方法呢？
2. render方法
3. concurrent mode（Fiber）

## createElement和render阶段

1. 当不引入react，使用Babel插件编译jsx，查看编译后的jsx。

   > babel.config.json的配置
   >
   > ```json
   > {
   >   "plugins": [
   >     [
   >       "@babel/plugin-transform-react-jsx"
   >     ]
   >   ]
   > }
   > // 该配置是？？？
   > {
   >   "plugins": [
   >     [
   >       "@babel/plugin-transform-react-jsx",
   >       {
   >         "throwIfNamespace": false, // defaults to true
   >         "runtime": "automatic", // defaults to classic
   >         "importSource": "custom-jsx-library" // defaults to react
   >       }
   >     ]
   >   ]
   > }
   > ```

2. 引入react（v16.8.6），查看打印后的jsx元素。

<img src="/Users/hkp/Desktop/截屏2023-10-25 17.46.52.png" alt="截屏2023-10-25 17.46.52" style="zoom:50%;" />

实现一个简易的ReactDOM.render方法

```javascript
const element = <h1 style={{color: 'red'}} title={'h1'}>element</h1>

const container = document.getElementById('root');
// ReactDOM.render(element, container);

// ReactDOM.render方法
const node = document.createElement(element.type);
node['title'] = element.props.title;
for (const key in element.props.style) {
    node['style'][key] = element.props.style[key];
}

const text = document.createTextNode('');
text['nodeValue'] = element.props.children;

node.appendChild(text);

container.appendChild(node);
```

3. 新建react文件夹，新增createElement和render方法。当在其他文件中引入自己写的react，使用render方法渲染元素。
