let tasks = []; // 任务队列
let isPerformingTask = false; // 表示当前是否有任务正在执行

const channel = new MessageChannel(); // 创建一个新的消息通道
const port = channel.port2; // 获取通道第二个端口

function task1(){
    console.log('performing task 1')
}

function task2(){
    console.log('performing task 2')
}

function task3(){
    console.log('performing task 3')
}


/**
 * 调度任务
 * @param task 任务
 * @param expirationTime 过期时间
 */
function scheduleTask(task, expirationTime){
    tasks.push({task, expirationTime}); // 将任务和过期时间添加到任务队列
    if(!isPerformingTask){
        isPerformingTask = true; // 标识任务正在执行
        port.postMessage(null); // 向通道第二个端口发送空消息
    }
}

function performTask(currentTime) {
    const frameTime = 1000/60;
    // ？？？ performance.now() - currentTime一直大于16.67的
    while (tasks.length > 0 && performance.now() - currentTime < frameTime){
        const {task, expiration} = tasks.shift();
        if(performance.now() >= expiration){
            // 任务没有过期
            task();
        }else {
            // 任务过期
            tasks.push({task, expiration});
        }
    }

    if(tasks.length){
        requestAnimationFrame(performTask);
    }else{
        isPerformingTask = false;
    }
}

// 当通道第一个端口接受到消息时，开始执行任务
channel.port1.onmessage = () => requestAnimationFrame(performTask);

scheduleTask(task1, performance.now() + 1000);
scheduleTask(task2, performance.now());
scheduleTask(task3, performance.now() + 3000);

console.log('同步任务执行');
