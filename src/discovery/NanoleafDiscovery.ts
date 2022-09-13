import { Client as SSDPClient } from "node-ssdp";
import { DiscoveryResult } from "./NanoleafDiscoveryResult";

export class NanoleafDiscovery {

    private client:SSDPClient;

    public onDiscovered: (res:DiscoveryResult)=>void;

    constructor() {
        this.client = new SSDPClient();

        let _this = this;
        this.client.on('response', function (headers, statusCode, rinfo) {
            _this.onResponse(headers, statusCode, rinfo);
        });
    }

    public search() {
        this.client.search("ssdp:all");
    }

    public stop() {
        this.client.stop();
    }

    private onResponse(headers, statusCode, rinfo) {
        let ST = headers["ST"].toLowerCase();
        if(!(ST.startsWith("nanoleaf:") || ST == "Nanoleaf_aurora:light")) return;

        if(!headers["ST"] || !headers["LOCATION"] || !headers["USN"] || !headers["NL-DEVICEID"] || !headers["NL-DEVICENAME"]) return;

        let result:DiscoveryResult = {
            st:         headers["ST"],
            url:        headers["LOCATION"],
            uuid:       headers["USN"],

            deviceID:   headers["NL-DEVICEID"],
            deviceName: headers["NL-DEVICENAME"]
        };

        if(this.onDiscovered) this.onDiscovered(result);
    }

}