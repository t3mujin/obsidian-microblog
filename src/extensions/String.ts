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

declare global {
    export interface String {
        removeFrontmatter(): string
        removeObsidianLinks(): string
        validValues(): string[]
        toContentType(): string
    }
}

String.prototype.removeFrontmatter = function(this: string) {
    const regex = /---\s*[\s\S]*?\s*---/
    return this.replace(regex, '')
}

String.prototype.validValues = function(this: string) {
    return this
        .split(',')
        .filter(value => value.length > 0)
        .map(tag => tag.trim())
}

interface Bounds {
    start: number
    end: number
}

String.prototype.removeObsidianLinks = function (this: string) {
    const linkRegex = /(?<!!)\[\[([^[\]]+)\]\]/g
    const codeBlockRegex = /```[\s\S]*?```/g
    const inlineCodeRegex = /`[^`]+`/g

    const extractBounds = (regex: RegExp): Bounds[] => {
        const bounds: Bounds[] = []
        let match

        while ((match = regex.exec(this)) !== null) {
            bounds.push({
                start: match.index,
                end: match.index + match[0].length
            })
        }

        return bounds
    }

    const codeBlocksBounds = extractBounds(codeBlockRegex)
    const inlineCodesBounds = extractBounds(inlineCodeRegex)

    const isCode = (index: number) =>
        codeBlocksBounds.some((block) => index >= block.start && index <= block.end) ||
        inlineCodesBounds.some((code) => index >= code.start && index <= code.end)

    const cleanMarkdown = (match: string, content: string, index: number) =>
        isCode(index) ? match : content.includes("|") ? content.split("|")[1] : content

    return this.replace(linkRegex, cleanMarkdown)
}

String.prototype.toContentType = function(this: string) {
    const fileExtension = this.toLowerCase()

    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        return 'image/jpeg'
    } else if (fileExtension === 'png') {
        return 'image/png'
    } else if (fileExtension === 'gif') {
        return 'image/gif'
    } else if (fileExtension === 'webp') {
        return 'image/webp'
    }

    return 'application/octet-stream'
}

export { }
