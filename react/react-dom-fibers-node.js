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


// 流程：render(初始化设置) -> requestIdleCallback -> workLoop -> nextUnitOfWork -> performUnitOfWork ->
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
export const render = (element, container) => {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

// 执行工作单元
const performUnitOfWork = (fiber) => {
    // console.log(fiber, 'fiber');
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    // 如果存在优先级，会导致页面的不一致性，所以需要构建一个在内存中的树 workInProgress Fiber
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom);
    }

    const elements = fiber.props.children;
    // 索引
    let index = 0;
    // 上一个兄弟节点
    let prevSibling = null;
    while (index < elements.length) {
        const element = elements[index];
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        }
        // 第一个子节点
        if (index === 0) {
            fiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index++;
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        console.log(nextFiber, 'nextFiber');
        nextFiber = nextFiber.parent;
    }
}

const workLoop = (deadline) => {
    // 停止标识
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
