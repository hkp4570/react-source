export const render = (element, container) => {
    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);
    const isProperty = key => key !== 'children';
    // 处理属性
    for (const key in element.props) {
        if(isProperty(key)){
            dom[key] = element.props[key];
        }
    }
    // 处理children stack 同步的 不能被中断的
    element.props.children.forEach(child => render(child, dom));

    container.appendChild(dom);
}
