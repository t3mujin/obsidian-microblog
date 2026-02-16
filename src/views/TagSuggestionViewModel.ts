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

/*
 * `TagSuggestionDelegate` Interface, returns to the delegate
 * the category selected by the user.
 */
export interface TagSuggestionDelegate {

    // Triggered when a category is selected.
    tagSuggestionDidSelectTag(tag: string): void
}

/*
 * This view model drives the content and interactions with the
 * `TagSuggestionView`.
 */
export class TagSuggestionViewModel {

    // Properties

    public tags: string[]
    public delegate?: TagSuggestionDelegate

    // Life cycle

    constructor(
        tags: string[]
    ) {
        this.tags = tags
    }

    // Public

    public get placeholderText(): string {
        return 'Select a category...'
    }

    public get instructionsText(): string {
        const action = this.tags.length == 0 ? 'fetch' : 'synchronize'
        return 'Use command palette to ' + action + ' categories'
    }

    public chooseCategory(
        tag: string
    ) {
        this.delegate?.tagSuggestionDidSelectTag(tag)
    }
}
