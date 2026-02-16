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

import { PublishPageViewModel } from '@views/PublishPageViewModel'
import { PublishPostViewModel } from '@views/PublishPostViewModel'
import { UpdatePageViewModel } from '@views/UpdatePageViewModel'
import { UpdatePostViewModel } from '@views/UpdatePostViewModel'
import { MarkdownView } from 'obsidian'

// Checks if the type is `PublishPostViewModel`
export function isPublishPostViewModel(value: unknown): value is PublishPostViewModel {
    return typeof value === 'object' && value instanceof PublishPostViewModel
}

// Checks if the type is `PublishPageViewModel`
export function isPublishPageViewModel(value: unknown): value is PublishPageViewModel {
    return typeof value === 'object' && value instanceof PublishPageViewModel
}

// Checks if the type is `UpdatePostViewModel`
export function isUpdatePostViewModel(value: unknown): value is UpdatePostViewModel {
    return typeof value === 'object' && value instanceof UpdatePostViewModel
}

// Checks if the type is `UpdatePageViewModel`
export function isUpdatePageViewModel(value: unknown): value is UpdatePageViewModel {
    return typeof value === 'object' && value instanceof UpdatePageViewModel
}

// Checks if the type is `MarkdownView`
export function isMarkdownView(value: unknown): value is MarkdownView {
    return typeof value === 'object' && value instanceof MarkdownView
}
