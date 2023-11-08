// 函数组件实现
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

// 下一个工作单元
let nextUnitOfWork = null;
// 内存中的树
let wipRoot = null;
// 更新前根节点fiber树 当前页面上显示的内容
let currentRoot = null;
// 需要删除的节点
let deletions = null;
// 是否是一个事件
const isEvent = (key) => key.startsWith('on');
// 是否是属性
const isProperty = key => key !== 'children' && !isEvent(key);
// 是否有新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// 是否有旧属性
const isGone = (prev, next) => (key) => !(key in next);


// 流程：render(初始化设置) -> requestIdleCallback -> workLoop -> nextUnitOfWork -> performUnitOfWork ->
export const createDom = (fiber) => {
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
    // const isProperty = key => key !== 'children';
    // // 处理属性
    // for (const key in fiber.props) {
    //     if (isProperty(key)) {
    //         dom[key] = fiber.props[key];
    //     }
    // }
    updateDom(dom, {}, fiber.props);
    return dom;
}

/**
 * 将虚拟 DOM 转换为真实 DOM 并添加到容器中
 * @param element 虚拟 DOM
 * @param container 真实 DOM
 */
export const render = (element, container) => {
    // 根节点
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        // 最后一个fiber树的引用
        alternate: currentRoot,
    }
    deletions = [];
    // 将根节点设置为下一个将要工作单元
    nextUnitOfWork = wipRoot;
}

/**
 * 协调
 * @param wipFiber  旧的树
 * @param elements  新的树
 */
const reconcileChildren = (wipFiber, elements) => {
    let index = 0;
    let prevSibling= null;
    // 上一次渲染的fiber  为DOM diff 做准备
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

    while (index < elements.length || oldFiber !== null){
        const element = elements[index];

        let newFiber = null;
        // 类型是否相同
        const sameType = oldFiber && element && oldFiber.type === element.type;

        // 类型相同
        if(sameType){
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE',
            }
        }

        // 新节点存在并且和旧节点类型不同 需要新增新节点
        if(element && !sameType){
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT',
            };
        }

        // 旧节点存在并且和新节点类型不同 需要删除旧节点
        if(oldFiber && !sameType){
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }

        // 处理兄弟节点
        // if(oldFiber){
        //     oldFiber = oldFiber.sibling;
        // }

        // fiber node
        // const newFiber = {
        //     type: element.type,
        //     props: element.props,
        //     parent: wipFiber,
        //     dom: null,
        // }
        if(index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index ++;
    }
}

/**
 * 更新普通组件
 * @param fiber
 */
const updateHostComponent = (fiber) => {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    const elements = fiber.props.children;
    reconcileChildren(fiber,elements);
}

/**
 * 更新函数组件
 * @param fiber
 */
const updateFunctionComponent = (fiber) => {
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}

// 执行工作单元
const performUnitOfWork = (fiber) => {
    const isFunctionComponent = fiber.type instanceof Function;

    if(isFunctionComponent){
        updateFunctionComponent(fiber);
    }else{
        updateHostComponent(fiber);
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        // console.log(nextFiber, 'nextFiber');
        nextFiber = nextFiber.parent;
    }
}

/**
 * 更新dom属性
 * @param dom
 * @param prevProps  老属性
 * @param nextProps  新属性
 */
const updateDom = (dom, prevProps, nextProps) => {
    // 移除老的事件监听
    Object.keys(prevProps)
        .filter(isEvent)
        .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    // 移除老的属性
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = '';
        });

    // 设置新的属性
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = nextProps[name];
        });

    // 添加新的事件处理
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

/**
 * 删除节点操作
 * @param fiber
 * @param domParent
 */
const commitDeletion = (fiber, domParent) => {
    if(fiber.dom){
        domParent.removeChild(fiber.dom);
    }else{
        // 当是函数组件的时候，当前fiber.dom为空，需要删除子节点child
        commitDeletion(fiber.child, domParent);
    }
}


/**
 * 处理提交的fiber树 构建完成之后需要同步到current fiber 然后再commit
 * @param fiber
 */
const commitWork = (fiber) => {
    if(!fiber) return;

    // 找到最近的有DOM的祖先节点
    // ! 如果是函数组件的话dom属性为null,一直向上找到有dom的节点做插入
    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom){
        domParentFiber = domParentFiber.parent;
    }

    const domParent = domParentFiber.dom;
    if(fiber.effectTag === 'PLACEMENT' && fiber.dom != null){
        // 新增节点
        domParent.appendChild(fiber.dom);
    } else if(fiber.effectTag === 'DELETION'){
        // 删除节点
        // domParent.removeChild(fiber.dom);
        commitDeletion(fiber, domParent);
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null){
        // 更新节点
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    }

    // 递归 子节点 兄弟节点
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

/**
 * 提交任务 将fiber tree 渲染为真实的 DOM
 */
const commitRoot = () => {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    // 到了提交阶段，currentRoot对应了页面中真实的DOM
    currentRoot = wipRoot;
    wipRoot = null;
}

const workLoop = (deadline) => {
    // 停止标识
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    // fiber 树构建完成
    if(!nextUnitOfWork && wipRoot){
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
