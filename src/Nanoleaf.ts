import fetch from "node-fetch";

import type { NanoleafClientOptions } from "./types/NanoleafClientOptions";

export class Nanoleaf {

    /** Options for the Client */
    public options:NanoleafClientOptions;

    constructor(options:NanoleafClientOptions) {
        this.options = Nanoleaf.fillOptions(options);
    }

    /**
     * Fills the options in a NanoleafClientOptions object
     */
    public static fillOptions(options:NanoleafClientOptions): NanoleafClientOptions
    {
        return {
            host: options.host,
            port: options.port || 16021,

            version:        options.version || "v1",
            accessToken:    options.accessToken,

            touch: {
                enabled:    options.touch?.enabled || false,
                port:       options.touch?.port || 35508
            }
        };
    }

    /**
     * Returns a formatted api url for a path
     * 
     * *Format:* http:// **HOST** : **PORT** /api/ **VERSION** /path
     * @example
     *      getURL("state/on")        // -> http://192.168.1.69:16021/api/v1/state/on
     *      getURL("effects/select")  // -> http://192.168.1.69:16021/api/v1/effects/select
     */
    public getURL(path:string): string {
        return `http://${this.options.host}:${this.options.port}/api/${this.options.version}/${path}`;
    }

    /**
     * Makes a GET request to the api on the specified path
     * @returns If the response body can be parsed as JSON, returns the JSON Data, otherwise returns the raw response object
     * 
     * @example
     *      await this._get("state/on")    // -> { value: true }
     */
    private async _get(path:string):Promise<{[key:string]:any} | Response>
    {
        let response = await fetch( this.getURL(path) );

        try {
            let data = await response.json();
            return data;
        } catch(err) {
            return response;
        }
    }

    /**
     * Makes a PUT request with a JSON body (and optionally additional headers) to the api on the specified path
     * @returns If the body can be parsed as JSON, returns the JSON Data, otherwise returns the raw response object
     * 
     * @example
     *      await this._put("state/on", {on: { value: true }})
     */
    private async _put(path:string, body:{[key:string]:any}, headers:{[key:string]:string}={})
    {
        let response = await fetch( this.getURL(path), {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                ...headers
            },
            body: JSON.stringify(body)
        } );

        try {
            let data = await response.json();
            return data;
        } catch(err) {
            return response;
        }
    }
}