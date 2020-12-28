import IPFSHttpClient from 'ipfs-http-client';


onmessage = function(e) {
  const ipfs = IPFSHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  console.log('IPFS Worker');
  ipfs.add(e.data).then(ss => {
    console.log(ss);
    postMessage(ss);
  });

};
