import { NanoleafTouchEvent } from "./NanoleafTouchEvent";

export type EventType = "touch" | "touch:init";
export type EventData = NanoleafTouchEvent | null;

export interface Event {
    type:EventType;
    data?:EventData;
}

/**
 * Represents a registered event callback
 * on the Nanoleaf class
 */
export interface EventCallback {
    eventType: EventType;
    callback: (e:Event) => void;
}