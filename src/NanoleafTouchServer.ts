import fetch                    from "node-fetch";
import { Writable }             from "stream";
import { createSocket, Socket } from "dgram";

import { bitsToNumber }         from "./utils";
import {
    mapTouchType,
    NanoleafTouchEvent
} from "./types/NanoleafTouchEvent";

import type { Nanoleaf }                from "./Nanoleaf";
import type { NanoleafTouchOptions }    from "./types/NanoleafClientOptions";

/**
 * Handles the Real-Time Touch Data Stream over a UDP Server
 */
export class NanoleafTouchServer {

    public options:NanoleafTouchOptions;

    /** The UDP Server Socket */
    private socket:Socket;

    constructor(private device:Nanoleaf) {
        this.options = device.options.touch;

        if(this.options.enabled) {
            this.setupUDP();
            this.startDataStream();
        }
    }

    /**
     * Sends a GET request to the panels that will start an event stream over http and
     * cause the Nanoleaf Device to connect to a local UDP server on localhost, which allows
     * raw touch events to be streamed in real-time.
     */
    private async startDataStream() {
        let url = this.device.getURL("events?id=4");

        let response = await fetch(url, {
            headers: {
                "TouchEventsPort": `${this.options.port || 35508}`
            }
        });

        let stream = new Writable();
        stream._write = (chunk, enc, next) => { next(); };

        response.body.pipe(stream);
        response.body.on("end", () => {});
    }

    /**
     * Creates the UDP Server necessary to stream the real-time raw touch data from the devices
     */
    private async setupUDP() {
        this.socket = createSocket("udp4");

        this.socket.on("listening", () => {
            /// UDP Server is running ///
            this.device.dispatchEvent({ type: "touch:init" })
        });

        this.socket.on("message", (msg, info) => {
            /// Device has sent a packet ///
            this.onMessageReceive(msg);
        });

        this.socket.bind(this.options.port || 35508, "0.0.0.0");
    }

    /**
     * Called when the device has sent a message to the udp server
     */
    private onMessageReceive(msg: Buffer) {
        let nPanels     = msg[0]*256 + msg[1];
        let events      = msg.slice(2);

        for (let i = 0; i < events.length; i += 5) {
            this.handleTouchPacket( events.slice(i, i+5) );
        }
    }

    /**
     * Handles incoming touch packets from the Nanoleaf Device contained in
     * the individual binary messages
     */
    private handleTouchPacket(packet: Buffer) {
        let timestamp       = Date.now();
        let panelID         = packet[0]*256 + packet[1];
        let lastPanelID     = packet[3]*256 + packet[4];  // If touchType is Swipe (4), this represents the panel id of the panel swiped from

        let touchDetails    = packet[2].toString(2).padStart(8, "0").split("").map(x => x=="1"?1:0);
        let touchType       = bitsToNumber(touchDetails.slice(1, 4));
        let touchStrength   = bitsToNumber(touchDetails.slice(4, 8));

        let event:NanoleafTouchEvent = {
            timestamp,
            panelID,

            touchType: mapTouchType(touchType),
            touchTypeRaw: touchType,
            touchStrength,

            swipePanelID: lastPanelID
        };

        this.device.dispatchEvent({
            type: "touch",
            data: event
        });
    }

}