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

import { TagSuggestionViewModel } from '@views/TagSuggestionViewModel'
import { App, FuzzySuggestModal } from 'obsidian'

/*
 * `TagSuggestionsView` subclasses `FuzzySuggestModal`, and is presented from
 * the Publish view.
 *
 * The data used to populate this view and all the interaction with the
 * view is handled by the view's view model.
 */
export class TagSuggestionView extends FuzzySuggestModal<string> {

    // Properties

    private viewModel: TagSuggestionViewModel

    // Life cycle

    constructor(
        viewModel: TagSuggestionViewModel,
        app: App
    ) {
        super(app)

        this.viewModel = viewModel
    }

    // Public

    public onOpen() {
        super.onOpen()

        this.setPlaceholder(
            this.viewModel.placeholderText
        )

        this.setInstructions([
            { command: '', purpose: this.viewModel.instructionsText }
        ])
    }

    public getItems(): string[] {
        return this.viewModel.tags
    }

    public getItemText(
        value: string
    ): string {
        return value
    }

    public onChooseItem(
        item: string,
        _evt: MouseEvent | KeyboardEvent
    ) {
        this.viewModel.chooseCategory(item)
    }
}
