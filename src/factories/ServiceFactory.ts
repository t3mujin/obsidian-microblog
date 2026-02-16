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

import { MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { FrontmatterService, FrontmatterServiceInterface } from '@services/FrontmatterService'
import { TagSynchronizationService, TagSynchronizationServiceDelegate, TagSynchronizationServiceInterface } from '@services/TagSynchronizationService'
import { ImageService, ImageServiceInterface } from '@services/ImageService'
import { TFile } from 'obsidian'

export interface ServiceFactoryInterface {

    // Builds the frontmatter service for the giving file.
    makeFrontmatterService(
        file: TFile | null
    ): FrontmatterServiceInterface

    // Builds the synchronization service, used by the client
    // to synchronize categories when the plugin is loaded
    // and when synchronization is triggered via command.
    makeTagSynchronizationService(
        delegate?: TagSynchronizationServiceDelegate
    ): TagSynchronizationServiceInterface

    // Builds an image service for processing and uploading images
    makeImageService(
        file: TFile | null
    ): ImageServiceInterface
}

/*
 * `ServiceFactory` builds all the Services in the plugin.
 * It simplifies building View Models since all the resolved dependencies
 * are already available via the factory.
 */
export class ServiceFactory implements ServiceFactoryInterface {

    // Properties

    private container: MicroPluginContainerInterface

    // Life cycle

    constructor(
        container: MicroPluginContainerInterface
    ) {
        this.container = container
    }

    // Public

    public makeFrontmatterService(
        file: TFile | null
    ): FrontmatterServiceInterface {
        return new FrontmatterService(
            this.container.plugin.app,
            file
        )
    }

    public makeTagSynchronizationService(
        delegate?: TagSynchronizationServiceDelegate
    ): TagSynchronizationServiceInterface {
        return new TagSynchronizationService(
            this.container.plugin,
            this.container.settings,
            this.container.networkClient,
            this.container.networkRequestFactory,
            delegate
        )
    }

    public makeImageService(
        file: TFile | null
    ): ImageServiceInterface {
        const frontmatterService = this.makeFrontmatterService(
            file
        )

        return new ImageService(
            this.container.plugin.app,
            frontmatterService,
            this.container.networkClient,
            this.container.networkRequestFactory
        )
    }
}
