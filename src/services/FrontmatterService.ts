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
import { App, FrontMatterCache, parseFrontMatterEntry, parseFrontMatterStringArray, TFile } from 'obsidian'

export interface FrontmatterServiceInterface {

    // Saves or delete an entry to the frontmatter.
    save(
        value: string | string[] | null,
        key: string
    ): void

    // Retrieves a string from the frontmatter.
    retrieveString(
        key: string
    ): string | null

    // Retrieves an array of strings from the frontmatter.
    retrieveStrings(
        key: string
    ): string[] | null

    // Serializes and saves JSON data to the frontmatter.
    saveJSON<T>(
        value: T,
        key: string
    ): void

    // Retrieves and parses JSON data from the frontmatter.
    retrieveJSON<T>(
        key: string,
        defaultValue: T
    ): T
}

/*
 * `FrontmatterService`, responsible for manipulating (reading, and writing)
 * to a file's frontmatter.
 */
export class FrontmatterService implements FrontmatterServiceInterface {

    // Properties

    private app: App
    private file: TFile | null

    // Life cycle

    constructor(
        app: App,
        file: TFile | null
    ) {
        this.app = app
        this.file = file
    }

    // Public

    public save(
        value: string | string[] | null,
        key: string
    ): void {
        if (!this.file) {
            return
        }

        try {
            this.app.fileManager.processFrontMatter(this.file, frontmatter => {
                if (value === null) {
                    delete frontmatter[key]
                } else {
                    frontmatter[key] = value
                }
            })
        } catch {
            // Do nothing
        }
    }

    public retrieveString(
        key: string
    ): string | null {
        const frontmatter = this.parseFrontmatterFromFile()
        const entry = parseFrontMatterEntry(frontmatter, key)

        return frontmatter && key in frontmatter
            ? entry === null || entry === ''
                ? ''
                : typeof entry === 'string' ? entry : null
            : null
    }

    public retrieveStrings(
        key: string
    ): string[] | null {
        const frontmatter = this.parseFrontmatterFromFile()
        return parseFrontMatterStringArray(frontmatter, key)
    }

    public saveJSON<T>(
        value: T,
        key: string
    ): void {
        try {
            const jsonString = JSON.stringify(value)
            this.save(jsonString, key)
        } catch {
            // Do nothing
        }
    }

    public retrieveJSON<T>(
        key: string,
        defaultValue: T
    ): T {
        const jsonString = this.retrieveString(key)
        if (!jsonString) {
            return defaultValue
        }

        try {
            return JSON.parse(jsonString) as T
        } catch {
            return defaultValue
        }
    }

    // Private

    private parseFrontmatterFromFile(): FrontMatterCache | undefined {
        return this.file
            ? this.app.metadataCache.getFileCache(this.file)?.frontmatter
            : undefined
    }
}
