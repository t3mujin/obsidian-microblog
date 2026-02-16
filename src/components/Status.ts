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

import { Component } from 'obsidian'

/**
 * A reusable component for displaying status messages in the UI
 */
export class Status extends Component {

    // Properties

    private statusElement: HTMLElement

    // Life cycle

    constructor(
        containerEl: HTMLElement,
        initialMessage?: string
    ) {
        super()

        this.statusElement = containerEl.createDiv('status-message')
        this.statusElement.addClass('micro-status')

        this.statusElement.style.marginTop = '8px'
        this.statusElement.style.padding = '6px 10px'
        this.statusElement.style.backgroundColor = 'var(--background-secondary)'
        this.statusElement.style.borderRadius = '4px'
        this.statusElement.style.fontSize = '0.9em'

        if (initialMessage) {
            this.setMessage(initialMessage)
        } else {
            this.statusElement.hide()
        }
    }

    // Public

    public setMessage(message: string): void {
        this.statusElement.setText(message)
        this.statusElement.show()
    }

    public hide(): void {
        this.statusElement.hide()
    }

    public show(): void {
        this.statusElement.show()
    }

    public clear(): void {
        this.statusElement.setText('')
        this.hide()
    }
}
