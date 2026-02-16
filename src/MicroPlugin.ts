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

import { MicroPluginContainer, MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { MicropostView } from '@base/views/MicropostView'
import { isMarkdownView, isPublishPageViewModel, isPublishPostViewModel, isUpdatePageViewModel, isUpdatePostViewModel } from '@extensions/TypeGuards'
import { ServiceFactory, ServiceFactoryInterface } from '@factories/ServiceFactory'
import { ViewModelFactory, ViewModelFactoryInterface } from '@factories/ViewModelFactory'
import { TagSynchronizationServiceInterface } from '@services/TagSynchronizationService'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ErrorView } from '@views/ErrorView'
import { MicroPluginSettingsView } from '@views/MicroPluginSettingsView'
import { PublishPageView } from '@views/PublishPageView'
import { PublishPostView } from '@views/PublishPostView'
import { UpdatePageView } from '@views/UpdatePageView'
import { UpdatePostView } from '@views/UpdatePostView'
import { Notice, Platform, Plugin } from 'obsidian'

export default class MicroPlugin extends Plugin {

    // Properties

    private settings: StoredSettings
    private container: MicroPluginContainerInterface
    private viewModelFactory: ViewModelFactoryInterface
    private serviceFactory: ServiceFactoryInterface
    private synchronizationService: TagSynchronizationServiceInterface

    // Public

    public async onload() {
        await this.loadSettings()
        await this.loadDependencies()
        await this.loadServiceFactory()
        await this.loadViewModelFactory()
        await this.registerSynchronizationService()

        if (this.settings.synchronizeCategoriesOnOpen) {
            this.synchronizationService.fetchTags()
        }

        this.addCommand({
            id: 'microblog-publish-post-command',
            name: 'Publish Post to Micro.blog',
            editorCallback: (editor, markdownView) => {
                if (editor.getValue().trim().length == 0) {
                    new ErrorView(
                        this.viewModelFactory.makeEmptyPostErrorViewModel(),
                        this.app
                    ).open()
                } else if (isMarkdownView(markdownView)) {
                    const viewModel = this.viewModelFactory.makeSubmitPostViewModel(
                        markdownView
                    )

                    if (isPublishPostViewModel(viewModel)) {
                        new PublishPostView(viewModel, this.app)
                            .open()
                    }

                    if (isUpdatePostViewModel(viewModel)) {
                        new UpdatePostView(viewModel, this.app)
                            .open()
                    }
                }
            }
        })

        this.addCommand({
            id: 'microblog-publish-page-command',
            name: 'Publish Page to Micro.blog',
            editorCallback: (editor, markdownView) => {
                if (editor.getValue().trim().length == 0) {
                    new ErrorView(
                        this.viewModelFactory.makeEmptyPageErrorViewModel(),
                        this.app
                    ).open()
                } else if (isMarkdownView(markdownView)) {
                    const viewModel = this.viewModelFactory.makeSubmitPageViewModel(
                        markdownView
                    )

                    if (isPublishPageViewModel(viewModel)) {
                        new PublishPageView(viewModel, this.app)
                            .open()
                    }

                    if (isUpdatePageViewModel(viewModel)) {
                        new UpdatePageView(viewModel, this.app)
                            .open()
                    }
                }
            }
        })

        this.addCommand({
            id: 'microblog-categories-sync-command',
            name: 'Synchronize Categories',
            callback: () => {
                this.synchronizationService.fetchTags()
            }
        })

        if (Platform.isDesktopApp) {
            this.addCommand({
                id: 'microblog-publish-compose-micropost',
                name: 'Compose Micropost',
                callback: () => {
                    this.openMicropostView()
                }
            })

            this.addRibbonIcon(
                'message-circle',
                'Compose Micropost',
                () => {
                    this.openMicropostView()
                }
            )
        }

        this.addSettingTab(
            new MicroPluginSettingsView(
                this.viewModelFactory.makeMicroPluginSettingsViewModel(),
                this.app
            )
        )
    }

    public onunload() { }

    public async saveSettings() {
        await this.saveData(this.settings)
    }

    // TagSynchronizationServiceDelegate

    public tagSynchronizationDidSucceed(
        count: number,
        blogsCount: number
    ) {
        new Notice(
            'Categories synchronized. Found ' + count + ' categories in ' + blogsCount + ' blog(s).'
        )
    }

    public tagSynchronizationDidFail(
        _error: Error
    ) {
        new Notice(
            'Error synchronizing categories'
        )
    }

    // Private

    private async loadSettings() {
        this.settings = Object.assign(
            {},
            defaultSettings,
            await this.loadData()
        )
    }

    private async loadDependencies() {
        this.container = new MicroPluginContainer(
            this.settings,
            this
        )
    }

    private async loadServiceFactory() {
        this.serviceFactory = new ServiceFactory(
            this.container
        )
    }

    private async loadViewModelFactory() {
        this.viewModelFactory = new ViewModelFactory(
            this.container,
            this.serviceFactory
        )
    }

    private async registerSynchronizationService() {
        this.synchronizationService = this.serviceFactory
            .makeTagSynchronizationService(
                this
            )
    }

    private openMicropostView() {
        const viewModel = this.viewModelFactory.makeMicropostViewModel()

        new MicropostView(
            viewModel,
            this.app
        ).open()
    }
}
