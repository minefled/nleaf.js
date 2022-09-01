import fetch from "node-fetch";

import { constrain } from "./utils";

import { NanoleafTouchServer } from "./NanoleafTouchServer";

import type { NanoleafClientOptions }   from "./types/NanoleafClientOptions";
import type { NanoleafPanelInfo }       from "./types/NanoleafPanelInfo";
import type { NanoleafState }           from "./types/NanoleafState";
import type { NanoleafPanelLayout }     from "./types/NanoleafPanelLayout";
import type {
    Event, EventCallback, EventType
} from "./types/Event";

/**
 * Represents a Nanoleaf Device
 */
export class Nanoleaf {

    /** Options for the Client */
    public options:NanoleafClientOptions;

    /** Array of all registered event callbacks */
    public callbacks:Array< EventCallback > = [];

    private touch?:NanoleafTouchServer;

    constructor(options:NanoleafClientOptions) {
        this.options = Nanoleaf.fillOptions(options);

        if(options.touch?.enabled === true) {
            this.touch = new NanoleafTouchServer(this);
        }
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

    /* [==================================] */
    /* [===========]  Events  [===========] */
    /* [==================================] */

    /**
     * Registers a new event callback with a specified event type and a callback function
     * that will be called once an event with the same type occurs
     * 
     * @param type 
     * @param callback 
     */
    public on(type:EventType, callback:(e:Event) => void) {
        this.callbacks.push({
            eventType: type,
            callback
        });
    }

    public dispatchEvent(e:Event) {
        //// Call event callbacks ////
        for(var ec of this.callbacks) {
            if(ec.eventType == e.type) ec.callback(e);
        }
    }


    /* [==================================] */
    /* [===========]  API  [===========] */
    /* [==================================] */

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

    /**
     * Returns the layout of the Panels
     */
    public async layout():Promise<NanoleafPanelLayout | null> {
        let response = await this._get("panelLayout/layout");

        return {
            numPanels: response.numPanels || 0,
            sideLength: response.sideLength || 0,

            positions: response.positionData || [],

            globalOrientation: await this.globalOrientation()
        }
    }

    /**
     * Gets the Global Orientation of the layout
     */
    public async globalOrientation():Promise<number | null> {
        let response = await this._get("panelLayout/globalOrientation");
        return response.value || null;
    }

    /**
     * Turns the panels on
     */
    public async turnOn() {
        await this._put("state", { on: { value: true } });
    }

    /**
     * Turns the panels off
     */
    public async turnOff() {
        await this._put("state", { on: { value: false } });
    }

    /**
     * Causes the Panels to flash to help differentiate between multiple panels
     */
    public async identify() {
        await this._put("identify", {});
    }

    /**
     * Sets the brightness of the panels
     * 
     * @param brightness The new brightness value in a range of 0-100
     * @param duration The time the transition should take (in seconds)
     * 
     * @example
     *      device.setBrightness( 100 );    // Sets the brightness to 100%
     *      device.setBrightness( 20, 5 );  // Sets the brightness of the panels to 20% over 5 seconds
     */
    public async setBrightness( brightness:number, duration:number = 0 ) {
        brightness = constrain(Math.floor(brightness), 0, 100);

        await this._put("state", {
            brightness: {
                value: brightness,
                duration: Math.floor(duration)
            }
        });
    }

    /**
     * Increments the Brightness of the panels by the specified amount
     * 
     * @example
     *      device.incrementBrightness( 20 );  // Increases the brightness by 20%
     *      device.incrementBrightness( -5 );  // Decreases the brightness by 5%
     */
    public async incrementBrightness( increment:number ) {
        await this._put("state", {
            brightness: {
                increment: Math.floor(increment)
            }
        });
    }

    /**
     * Sets the hue of all panels
     * 
     * @param hue The new Hue in a range 0-360
     * 
     * @example 
     *      device.setHue( 0 ); // Sets the Hue of all panels to 0 (red-ish)
     *      device.setHue(220); // Sets the Hue to 220 (blue-ish)
     */
    public async setHue( hue:number ) {
        hue = constrain(Math.floor(hue), 0, 360);

        await this._put("state/hue", {
            hue: {
                value: hue
            }
        });
    }

    /**
     * Changes the hue of all panels by the specified amount
     * 
     * @example
     *      device.incrementHue( 20 );  // Adds 20 to the Hue of the panels
     *      device.incrementHue( -90 ); // Subtracts 90 from the Hue
     */
    public async incrementHue( increment:number ) {
        await this._put("state", {
            hue: {
                increment: Math.floor(increment)
            }
        });
    }

    /**
     * Sets the saturation of all panels to the given value
     * in a range of 0-100
     * 
     * @example
     *      device.setSaturation(50); // Sets the saturation to 50%
     */
    public async setSaturation( sat:number ) {
        sat = constrain(Math.floor(sat), 0, 100);

        await this._put("state/sat", {
            sat: {
                value: sat
            }
        });
    }

    /**
     * Increments the saturation of all panels by a specified amount
     * 
     * @example
     *      device.incrementSaturation( 10 );  // Increases the saturation by 10%
     *      device.incrementSaturation( -20 ); // Decreases the saturation by 20%
     */
    public async incrementSaturation( increment:number ) {
        await this._put("state", {
            sat: {
                increment
            }
        });
    }

    /**
     * Sets the color temperature of all panels to a value
     * in the range of 1200-6500
     * 
     * @example
     *      setColorTemperature(4500); // Sets the color temperature to 4500K
     */
    public async setColorTemperature( ct:number) {
        ct = constrain(Math.floor(ct), 1200, 6500);

        await this._put("state/ct", {
            ct: {
                value: ct
            }
        });
    }

    /**
     * Changes the Color Temperature of all panels by a specified amount
     */
    public async incrementColorTemperature( increment:number ) {
        this._put("state", {
            ct: {
                increment
            }
        });
    }
}