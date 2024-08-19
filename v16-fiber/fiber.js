let tasks = []; // 任务队列
let isPerformingTask = false; // 表示当前是否有任务正在执行

const channel = new MessageChannel(); // 创建一个新的消息通道
const port = channel.port2; // 获取通道第二个端口

/**
 * 调度有延时的任务
 * @param task 任务
 * @param delay 延时时间（毫秒）
 */
function scheduleDelayedTask(task, delay) {
  const expirationTime = performance.now() + delay;
  tasks.push({ task, expirationTime }); // 将任务和过期时间添加到任务队列
  if (!isPerformingTask) {
    isPerformingTask = true; // 标识任务正在执行
    port.postMessage(null); // 向通道第二个端口发送空消息
  }
}

/**
 * 执行有延时的任务
 * @param currentTime 当前时间
 */
function performDelayedTask(currentTime) {
  const frameTime = 1000 / 60;
  while (tasks.length > 0 && performance.now() - currentTime < frameTime) {
    const { task, expirationTime } = tasks.shift();
    if (performance.now() >= expirationTime) {
      // 任务没有过期
      task();
    } else {
      // 任务过期
      tasks.push({ task, expirationTime });
    }
  }

  if (tasks.length) {
    requestAnimationFrame(() => performDelayedTask(performance.now()));
  } else {
    isPerformingTask = false;
  }
}

// 当通道第一个端口接受到消息时，开始执行有延时的任务
channel.port1.onmessage = () => {
  requestAnimationFrame(() => performDelayedTask(performance.now()));
};

function task1(){
  console.log('task1')
}
function task2(){
  console.log('task2')
}
function task3(){
  console.log('task3')
}

// 调度示例有延时的任务
scheduleDelayedTask(task1, 3000);
scheduleDelayedTask(task2, 2000);
scheduleDelayedTask(task3, 1000);

console.log('同步任务执行');
