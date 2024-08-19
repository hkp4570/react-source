const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

port1.onmessage = (e) => {
  console.log('port1 received message', e.data);
}

port2.onmessage = (e) => {
  console.log('port2 received message', e.data);
}

setTimeout(() => {
  port2.postMessage('hello, 我是port2');
},1000)

setTimeout(() => {
  port1.postMessage('hello, 我是port1');
},3000)
