let globalState = {};
let globalSubscribers = {};
let startIndex = 0;

function useState(initialValue) {
    const currentIndex = startIndex;
    startIndex++;
    if (!(currentIndex in globalState)) {
        globalState[currentIndex] = initialValue;
        globalSubscribers[currentIndex] = new Set();
    }

    const setState = (newState) => {
        if (typeof newState === 'function') {
            newState = newState(globalState[currentIndex]);
        }
        globalState[currentIndex] = newState;
        // 通知所有的订阅者，进行数据更新
        for (const subscribe of globalSubscribers[currentIndex]) {
            subscribe(newState);
        }
    }

    const subscribe = (subscriber) => {
        globalSubscribers[currentIndex].add(subscriber);

        return () => {
            globalSubscribers[currentIndex].delete(subscriber);
        }
    }

    return [globalState[currentIndex], setState, subscribe]
}

const [count, setCount, subscribeCount] = useState(0);
subscribeCount(newValue => {
    console.log('count change', newValue);
})
console.log('count', count);
setCount(1);

const [count1, setCount1, subscribeCount1] = useState(1);
subscribeCount1(newValue => {
    console.log('count change1', newValue);
})
console.log('count1', count1);
setCount1(count => count + 1);

