const fetchBlob = (images: string[]) => {
    let blobs: Blob[] = []
    images.map((image) => {
        fetch(image)
            .then((res) => res.blob()) // Gets the response and returns it as a blob
            .then((blob) => {
                blobs.push(blob)
            })
    })
    return blobs
}
export default fetchBlob
