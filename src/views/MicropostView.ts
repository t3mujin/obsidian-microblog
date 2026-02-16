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

import { MicropostViewModel, MicropostViewModelDelegate, SubmitButtonStyle } from '@base/views/MicropostViewModel'
import { PublishResponse } from '@networking/PublishResponse'
import { App, ButtonComponent, Modal, Setting, TextAreaComponent } from 'obsidian'

/*
 * `MicropostView` subclasses `Modal`.
 */
export class MicropostView extends Modal implements MicropostViewModelDelegate {

    // Properties

    private viewModel: MicropostViewModel
    private submitButton?: ButtonComponent
    private counterHTMLElement?: HTMLParagraphElement

    // Life cycle

    constructor(
        viewModel: MicropostViewModel,
        app: App
    ) {
        super(app)

        this.viewModel = viewModel
        this.viewModel.delegate = this
    }

    // Public

    public onOpen() {
        super.onOpen()

        const { contentEl } = this

        contentEl.empty()
        contentEl.createEl('h2', { text: 'Micropost' })

        new TextAreaComponent(contentEl)
            .setValue(this.viewModel.content)
            .onChange(value => {
                this.viewModel.content = value
            })
            .then(textArea => {
                textArea.inputEl.style.width = '100%'
                textArea.inputEl.rows = 10
            })

        this.counterHTMLElement = contentEl.createEl(
            'p',
            { text: this.viewModel.characterCounterText }
        )

        if (this.viewModel.hasMultipleBlogs) {
            new Setting(contentEl)
                .setName('Blog')
                .setDesc('Override the default blog settings for this post.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    })
                )
        }

        new Setting(contentEl)
            .setName('Visibility')
            .setDesc('Override the default post visibility setting for this specific post.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                })
            )

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Post')
                .setDisabled(true)
                .removeCta()
                .onClick(async _ => {
                    await this.viewModel.publish()
                })
                .then(button => {
                    this.submitButton = button
                })
            )
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this

        contentEl.empty()
    }

    // MicropostViewModelDelegate

    public publishDidSucceed(
        response: PublishResponse
    ) {
        this.makeConfirmationView(
            response
        )
    }

    public publishDidFail(
        error: Error
    ) {
        this.makeMessageView(
            'Error',
            error.message
        )
    }

    public publishUpdateCounter(
        string: string
    ) {
        if (!this.counterHTMLElement) {
            return
        }

        this.counterHTMLElement.innerText = string
    }

    public publishUpdateSubmitButton(
        style: SubmitButtonStyle
    ) {
        if (!this.submitButton) {
            return
        }

        switch (style) {
            case SubmitButtonStyle.Disabled:
                this.submitButton
                    .setDisabled(true)
                    .removeCta()
                break
            case SubmitButtonStyle.Publishing:
                this.submitButton
                    .setDisabled(true)
                    .removeCta()
                    .setButtonText('Publishing...')
                break
            case SubmitButtonStyle.Enabled:
                this.submitButton
                    .setDisabled(false)
                    .setCta()
                break
        }
    }

    // Private

    private makeConfirmationView(
        response: PublishResponse
    ) {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: 'Published' })
        contentEl.createEl('a', { text: 'Open post URL', href: response.url })
        contentEl.createEl('br')
        contentEl.createEl('a', { text: 'Open post Preview URL', href: response.preview })
    }

    private makeMessageView(
        title: string,
        message: string
    ) {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: title })
        contentEl.createEl('p', { text: message })
    }
}
