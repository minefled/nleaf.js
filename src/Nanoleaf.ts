import fetch from "node-fetch";

import type { NanoleafClientOptions } from "./types/NanoleafClientOptions";
import type { NanoleafPanelInfo } from "./types/NanoleafPanelInfo";
import type { NanoleafState } from "./types/NanoleafState";

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
     * *Format:* http:// **HOST** : **PORT** /api/ **VERSION** / **TOKEN** /path
     * @example
     *      getURL("state/on")        // -> http://192.168.1.69:16021/api/v1/state/on
     *      getURL("effects/select")  // -> http://192.168.1.69:16021/api/v1/effects/select
     */
    public getURL(path:string): string {
        return `http://${this.options.host}:${this.options.port}/api/${this.options.version}/${this.options.accessToken}/${path}`;
    }

    /**
     * Makes a GET request to the api on the specified path
     * @returns The JSON response
     * 
     * @example
     *      await this._get("state/on")    // -> { value: true }
     */
    private async _get(path:string):Promise<{[key:string]:any} | null>
    {
        let response = await fetch( this.getURL(path) );

        try {
            let data = await response.json();
            return data;
        } catch(err) {
            return null;
        }
    }

    /**
     * Makes a PUT request with a JSON body (and optionally additional headers) to the api on the specified path
     * @returns The JSON Response
     * 
     * @example
     *      await this._put("state/on", {on: { value: true }})
     */
    private async _put(path:string, body:{[key:string]:any}, headers:{[key:string]:string}={}): Promise<{[key:string]:any} | null>
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
            return null;
        }
    }

    /**
     * Gets general information about the Panels like name, version,
     * state, layout, etc.
     */
    public async panelInfo():Promise<NanoleafPanelInfo | null> {
        let response = await this._get("");
        if(!response) return;

        return {
            name: response.name,
            serialNo: response.serialNo,
            manufacturer: response.manufacturer,
            firmwareVersion: response.firmwareVersion,
            hardwareVersion: response.hardwareVersion,
            model: response.model,

            state: {
                on:         response.state?.on?.value || false,
    
                hue:        response.hue?.value || 0,
                saturation: response.sat?.value || 0,
                brightness: response.brightness?.value || 0,
                colorTemp:  response.ct?.value || 0
            },
            layout: {
                numPanels: response.panelLayout?.layout?.numPanels || 0,
                sideLength: response.panelLayout?.layout?.sideLength || 0,

                positions: response.panelLayout?.layout?.positionData || [],

                globalOrientation: response.panelLayout?.globalOrientation?.value || 0
            },

            rhythm: response.rhythm || null

        } as NanoleafPanelInfo;
    }
    
    /**
     * Gets the State of the Panels including values like on/off, hue, saturation, etc.
     */
    public async state():Promise<NanoleafState | null> {
        let response = await this._get("state");

        //// Check if response is valid ////
        if(!response["on"] || !response["hue"] || !response["sat"] || !response["ct"] || !response["colorMode"] || !response["brightness"]) {
            return null;
        }

        return {
            on:         response["on"]?.["value"] || false,

            hue:        response["hue"]?.["value"] || 0,
            saturation: response["sat"]?.["value"] || 0,
            brightness: response["brightness"]?.["value"] || 0,
            colorTemp:  response["ct"]?.["value"] || 0
        } as NanoleafState;
    }
}