const worker = new Worker('./ipfsWorker', { type: 'module' })

export default worker

// const send = message => worker.postMessage({
  // message
// })

// export default {
  // worker,
  // send
// }

