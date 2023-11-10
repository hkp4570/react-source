// import React from '../react';
//
// const element = <section>
//     <div><h1 title={'h1'}><span>hello</span></h1><a href="">测试连接</a></div>
// </section>
// console.log(element, 'element');
//
// const container = document.getElementById('root');
// React.render(element, container);

// ReactDOM.render(element, container);
// ReactDOM.render方法
// const node = document.createElement(element.type);
// node['title'] = element.props.title;
// for (const key in element.props.style) {
//     node['style'][key] = element.props.style[key];
// }
//
// const text = document.createTextNode('');
// text['nodeValue'] = element.props.children;
//
// node.appendChild(text);
// container.appendChild(node);

// 协调器
// import React from '../react';
//
// const container = document.getElementById('root');
//
// const updateValue = (e) => {
//   rerender(e.target.value);
// };
//
// const rerender = (value) => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   );
//   React.render(element, container);
// };
//
// rerender('World');

// 函数组件
// import React from '../react';
//
// function App(props) {
//   return <h1>H1,{props.name}!</h1>;
// }
//
// const element = <App name="foo"></App>;
// //  看一下两个的区别
// // console.log(element, 'element');
// // const element1 = <h1>hi, react</h1>
// // console.log(element1, 'element1');
//
// React.render(element, document.getElementById('root'));

// useState hook的实现
import React from '../react';

function Counter() {
  const [state, setState] = React.useState(1);
  const [state2, setState2] = React.useState(2);
  function onClickHandle(params) {
    setState((state) => state + 1);
    setState((state) => state + 2);
  }
  return (
      <div>
        <h1>Count: {state}</h1>
        <button onClick={() => onClickHandle()}>+Add</button>
        <hr />
        <h1>Count2: {state2}</h1>
        <button onClick={() => setState2((state) => state + 1)}>+1</button>
        <button onClick={() => setState2((state) => state + 2)}>+2</button>
      </div>
  );
}
const element = <Counter />;

React.render(element, document.getElementById('root'));
