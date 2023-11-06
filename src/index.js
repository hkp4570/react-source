import React from '../react';

const element = <section>
    <div><h1 title={'h1'}><span>hello</span></h1><a href="">测试连接</a></div>
</section>
console.log(element, 'element');

const container = document.getElementById('root');
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

React.render(element, container);


