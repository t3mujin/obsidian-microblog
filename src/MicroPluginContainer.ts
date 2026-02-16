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
import { NetworkClient, NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactory, NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

export interface MicroPluginContainerInterface {

    // The stored plugin settings.
    settings: StoredSettings

    // The Micro.publish plugin.
    plugin: MicroPlugin

    // The network client used to perform network request.
    networkClient: NetworkClientInterface

    // The network request factory, used to build the
    // requests which will be executed by the network client.
    networkRequestFactory: NetworkRequestFactoryInterface
}

export class MicroPluginContainer implements MicroPluginContainerInterface {

    // Properties

    readonly settings: StoredSettings
    readonly plugin: MicroPlugin
    readonly networkClient: NetworkClientInterface
    readonly networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        settings: StoredSettings,
        plugin: MicroPlugin
    ) {
        this.settings = settings
        this.plugin = plugin
        this.networkRequestFactory = new NetworkRequestFactory()
        this.networkClient = new NetworkClient(() => {
            return this.settings.appToken
        })
    }
}
