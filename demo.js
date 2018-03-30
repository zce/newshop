//  ---------------------------------------
const net = require('net')

const client = net.createConnection(8000, 'localhost', () => {
  //'connect' listener
  console.log('connected to server!')
  client.write(`GET / HTTP/1.1
Host: newshop.me
Authorization: Basic bmV3c2hvcC1mcm9udGVuZDpkODY2NzgzN2ZjZTVhMDI3MGEzNWY0YThmYTE0YmU0NzlmYWRjNzc0
User-Agent: curl/7.54.0
Accept: */*

`)
})

client.on('data', data => {
  console.log(data.toString())
})




// // const sleep = timeout => new Promise(resolve => {
// //   setTimeout(() => resolve(new Date()), timeout)
// // })

// // const tasks = [
// //   3000,
// //   1000,
// //   2000
// // ]

// // console.time('timer')

// // // Promise.all(tasks).then(() => {
// // //   console.timeEnd('timer')
// // // })

// // tasks.reduce((promise, task) => promise.then(() => sleep(task)), Promise.resolve()).then(() => {
// //   console.timeEnd('timer')
// // })

// const { Cart } = require('./models')

// const cart = [
//   { id: 738, amount: 1 },
//   { id: 614, amount: 2 },
//   { id: 40, amount: 2 },
//   { id: 347, amount: 2 },
//   { id: 446, amount: 2 },
//   { id: 12, amount: 1 },
//   { id: 626, amount: 2 },
//   { id: 548, amount: 2 },
//   { id: 824, amount: 2 },
//   { id: 148, amount: 2 }
// ]

// // 并行结构
// Promise.all(cart.map(item => Cart.add(1, item.id, item.amount)))
//   .then(() => console.log('done'))

// // // 串行结构
// // cart.reduce((promise, item) => promise.then(() => Cart.add(1, item.id, item.amount)), Promise.resolve())
// //   .then(() => console.log('done'))

// // 在服务端解决并发问题后建议使用并行结构

