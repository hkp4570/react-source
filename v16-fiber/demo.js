// 为什么react中的任务调度不使用setTimeout

// 在浏览器中执行此代码时间间隔会很长
let count = 0;
let startTime = +new Date();
console.log('start time',0, 0);
function func(){
    setTimeout(() => {
        console.log('exec time', ++count, +new Date() - startTime);
        if(count === 50){
            return;
        }
        func();
    },0)
}

func();

