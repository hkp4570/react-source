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

import React from '../react';

const container = document.getElementById('root');

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
  React.render(element, container);
};

rerender('World');
