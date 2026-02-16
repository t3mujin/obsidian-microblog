/*
MIT License

Copyright (c) 2022 Otavio C.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Represents a request for uploading media to Micro.blog.
 */
export interface MediaRequest {
    mediaBuffer: ArrayBuffer
    filename: string
    contentType: string
    blogID?: string
}

/**
 * Creates a multipart form data request body from a MediaRequest.
 */
export function makeMediaRequestBody(request: MediaRequest): {
    body: ArrayBuffer
    boundary: string
} {
    const boundary = `----WebKitFormBoundary${Math.random().toString(16).substring(2)}`

    let formDataContent = ''
    formDataContent += `--${boundary}\r\n`
    formDataContent += `Content-Disposition: form-data; name="file"; filename="${request.filename}"\r\n`
    formDataContent += `Content-Type: ${request.contentType}\r\n\r\n`

    let postFileContent = ''

    if (request.blogID && request.blogID !== 'default') {
        postFileContent += `\r\n--${boundary}\r\n`
        postFileContent += `Content-Disposition: form-data; name="mp-destination"\r\n\r\n`
        postFileContent += `${request.blogID}\r\n`
    }

    if (!(request.blogID && request.blogID !== 'default')) {
        postFileContent += `\r\n`
    }

    postFileContent += `--${boundary}--\r\n`

    const encoder = new TextEncoder()
    const formDataHeaders = encoder.encode(formDataContent)
    const formDataFooter = encoder.encode(postFileContent)
    const combinedData = new Uint8Array(
        formDataHeaders.length + request.mediaBuffer.byteLength + formDataFooter.length
    )

    combinedData.set(formDataHeaders, 0)
    combinedData.set(new Uint8Array(request.mediaBuffer), formDataHeaders.length)
    combinedData.set(formDataFooter, formDataHeaders.length + request.mediaBuffer.byteLength)

    return {
        body: combinedData.buffer,
        boundary
    }
}
