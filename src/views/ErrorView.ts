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

import { ErrorViewModel } from '@views/ErrorViewModel'
import { App, Modal } from 'obsidian'

/*
 * `ErrorView` subclasses `Modal`.
 */
export class ErrorView extends Modal {

    // Properties

    private viewModel: ErrorViewModel

    // Life cycle

    constructor(
        viewModel: ErrorViewModel,
        app: App
    ) {
        super(app)

        this.viewModel = viewModel
    }

    // Public

    public onOpen() {
        super.onOpen()

        const { contentEl } = this

        contentEl.empty()
        contentEl.createEl('h2', { text: this.viewModel.title })
        contentEl.createEl('p', { text: this.viewModel.message })
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this

        contentEl.empty()
    }
}
