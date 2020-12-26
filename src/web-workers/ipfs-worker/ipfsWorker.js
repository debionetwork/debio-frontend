onmessage = function(e) {
  console.log('IPFS Worker')
  console.log("from vue app", e.data)
  postMessage({ from: 'IPFS Worker' })
}
