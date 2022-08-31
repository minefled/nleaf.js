import type { NanoleafPanelLayout } from "./NanoleafPanelLayout";
import type { NanoleafState }       from "./NanoleafState";

export interface NanoleafPanelInfo {
    name:               string;
    serialNo:           number;
    manufacturer:       string;
    firmwareVersion:    string;
    hardwareVersion:    string;
    model:              string;

    state:              NanoleafState;
    layout:             NanoleafPanelLayout;
    rhythm?: {
        rhythmConnected:    boolean;
        rhythmActive:       boolean;
        rhythmId:           number;

        hardwareVersion:    string;
        firmwareVersion:    string;
        auxAvailable:       boolean;

        rhythmMode: number;
        rhythmPos: {
            x: number;
            y: number;
            o: number;
        }
    }
}