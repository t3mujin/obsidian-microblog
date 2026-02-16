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

import MicroPlugin from '@base/MicroPlugin'
import { CategoriesResponse } from '@networking/CategoriesResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

/*
 * `TagSynchronizationServiceDelegate` Interface, implemented by
 * the object which needs to observe synchronization events.
 */
export interface TagSynchronizationServiceDelegate {

    // Triggered when tag synchronization succeeds.
    tagSynchronizationDidSucceed(
        count: number,
        blogsCount: number
    ): void

    // Triggered when tag synchronization fails.
    tagSynchronizationDidFail(error: Error): void
}

export interface TagSynchronizationServiceInterface {

    // Fetches the categories if the user has an app token set.
    fetchTags(): void
}

/*
 * The service responsible for making the synchronization request.
 */
export class TagSynchronizationService implements TagSynchronizationServiceInterface {

    // Properties

    private delegate?: TagSynchronizationServiceDelegate
    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private plugin: MicroPlugin

    // Life cycle

    constructor(
        plugin: MicroPlugin,
        settings: StoredSettings,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        delegate?: TagSynchronizationServiceDelegate
    ) {
        this.plugin = plugin
        this.settings = settings
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
        this.delegate = delegate
    }

    // Public

    public async fetchTags() {
        if (this.settings.appToken.length == 0) return

        try {
            const blogIDs = Object.keys(this.settings.blogs)
                .filter(value => value != 'default')

            let categoriesCount = 0

            for (const blogID of blogIDs) {
                const response = await this.networkClient.run<CategoriesResponse>(
                    this.networkRequestFactory.makeCategoriesRequest(blogID)
                )

                categoriesCount += response.categories.length
                this.settings.synchronizedCategories[blogID] = response.categories
                this.plugin.saveSettings()
            }

            this.delegate?.tagSynchronizationDidSucceed(categoriesCount, blogIDs.length)
        } catch (error) {
            this.delegate?.tagSynchronizationDidFail(error)
        }
    }
}
