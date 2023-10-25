import React from 'react';
const element = <h1 style={{color: 'red'}} title={'h1'}>element</h1>
console.log(element, 'element');
// const element = {
//     type: 'h1',
//     props: {
//         style:{color:'red'},
//         title:'h1',
//         children: 'element'
//     }
// }

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


