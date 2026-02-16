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
 * Response from Micro.blog media upload endpoint.
 * This can have several formats depending on the endpoint behavior
 */
export interface MediaResponse {

    // URL field that might be present in the response
    url?: string

    // Photo field that might be present (as string or array)
    photo?: string | string[]

    // Location field that might be present
    location?: string
}

/**
 * Extract the media URL from a media response
 * Handles the various formats Micro.blog might return.
 */
export function extractMediaURL(
    response: MediaResponse,
    locationHeader?: string
): string {
    if (response.url) {
        return response.url
    }

    if (response.photo) {
        if (typeof response.photo === 'string') {
            return response.photo
        }
        if (Array.isArray(response.photo) && response.photo.length > 0) {
            return response.photo[0]
        }
    }

    if (response.location) {
        return response.location
    }

    if (locationHeader) {
        return locationHeader
    }

    throw new Error('Unable to extract media URL from response data')
}
