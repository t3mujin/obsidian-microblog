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

import '@extensions/String'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { MarkdownView } from 'obsidian'

export interface MarkdownPageInterface {

    // Page title.
    // Returns either the title included
    // in the frontmatter, or the file name.
    title: string

    // Page Content.
    // Returns the markdown content, without the
    // front matter.
    content: string

    // URL of the published page.
    url: string | null
}

/*
 * Page from the Markdown file.
 */
export class MarkdownPage implements MarkdownPageInterface {

    // Properties

    private frontmatterService: FrontmatterServiceInterface
    private markdownView: MarkdownView

    // Life cycle

    constructor(
        frontmatterService: FrontmatterServiceInterface,
        markdownView: MarkdownView
    ) {
        this.frontmatterService = frontmatterService
        this.markdownView = markdownView
    }

    // Public

    public get title(): string {
        const filename = this.markdownView.file?.basename
        const frontmatterTitle = this.frontmatterService
            .retrieveString('title')

        return frontmatterTitle || filename || ''
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
            .removeObsidianLinks()
    }

    public get url(): string | null {
        const url = this.frontmatterService
            .retrieveString('url')

        return url
    }
}
