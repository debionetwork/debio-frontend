import ipfsWorker from '@/web-workers/ipfs-worker'

export function upload({ fileChunk, fileName, fileType }) {
    const chunkSize = 10 * 1024 * 1024 // 10 MB
    let offset = 0
    const blob = new Blob([ fileChunk ], { type: fileType })

    return new Promise((resolve, reject) => {
        try {
        const fileSize = blob.size
        do {
            let chunk = blob.slice(offset, chunkSize + offset);
            ipfsWorker.workerUpload.postMessage({
            seed: chunk.seed, file: blob
            })
            offset += chunkSize
        } while((chunkSize + offset) < fileSize)
        
        let uploadSize = 0
        const uploadedResultChunks = []
        ipfsWorker.workerUpload.onmessage = async event => {
            uploadedResultChunks.push(event.data)
            uploadSize += event.data.data.size
            
            if (uploadSize >= fileSize) {
            resolve({
                fileName: fileName,
                fileType: fileType,
                ipfsPath: uploadedResultChunks
            })
            }
        }

        } catch (err) {
        reject(new Error(err.message))
        }
    })
}