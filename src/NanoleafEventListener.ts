import fetch                    from "node-fetch";
import { Writable }             from "stream";
import { createSocket, Socket } from "dgram";

import type { Nanoleaf } from "./Nanoleaf";

export class NanoleafEventListener {

    constructor(private device:Nanoleaf) {
        this.startListeners();
    }

    /**
     * Starts the HTTP Event Stream from the device to the client
     */
    private async startListeners() {
        let url = this.device.getURL("events?id=1,2,3,4");

        let response = await fetch( url );

        let stream = new Writable();
        stream._write = (chunk, enc, next) => {
            console.log(chunk.toString());
            this.handleChunk(chunk);
            next();
        };

        response.body.pipe(stream);
        response.body.on("end", () => {});
    }

    /**
     * Handles incoming chunks of data from the device
     */
    private handleChunk(chunk:Buffer) {
        let lines = chunk.toString().split("\n");

        let id:number = -1;
        let data:{[key:string]:any} = {};

        for(var l of lines) {
            var parts = l.split(": ");

            if(l.startsWith("id: ")) {
                id = parseInt(parts[1]);

            } else if (l.startsWith("data: ")) {
                var dataSection = parts.slice(1).join(": ");

                try {
                    data = JSON.parse(dataSection);
                } catch(err) {}

            }
        }
    }

    private handleStateEvent(data:{[key:string]:any}) {
        console.log(data.events);
    }

}