// 无法执行，卡死
function foo1(){
    console.log('foo1');
    foo1();
}
// foo1();

// 可执行 很卡
function foo2(){
    console.log('foo2');
    return Promise.resolve().then(foo2);
}
// foo2();

// 可正常执行
function foo3(){
    console.log(Math.random());
    setTimeout(foo3,0);
}
foo3();
