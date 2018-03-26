const sleep = timeout => new Promise(resolve => {
  setTimeout(() => resolve(new Date()), timeout)
})

const tasks = [
  3000,
  1000,
  2000
]

console.time('timer')

// Promise.all(tasks).then(() => {
//   console.timeEnd('timer')
// })

tasks.reduce((promise, task) => promise.then(() => sleep(task)), Promise.resolve()).then(() => {
  console.timeEnd('timer')
})
