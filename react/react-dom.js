// export const render = (element, container) => {
//     const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);
//     const isProperty = key => key !== 'children';
//     // 处理属性
//     for (const key in element.props) {
//         if(isProperty(key)){
//             dom[key] = element.props[key];
//         }
//     }
//     // 处理children stack 同步的 不能被中断的
//     element.props.children.forEach(child => render(child, dom));
//
//     container.appendChild(dom);
// }


export const createDom = (fiber) => {
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
    const isProperty = key => key !== 'children';
    // 处理属性
    for (const key in fiber.props) {
        if (isProperty(key)) {
            dom[key] = fiber.props[key];
        }
    }
    return dom;
}

// 下一个工作单元
let nextUnitOfWork = null;

// 首先默认跟节点为下一个工作单元
export const render = (element, container) =>{
    nextUnitOfWork = {
        dom: container,
        props:{
            children: [element]
        }
    }
}

const performUnitOfWork = (fiber) => {

}

const workLoop = (deadline) => {
    // 停止标识
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

}

requestIdleCallback(workLoop);
