import { NanoleafTouchEvent } from "./NanoleafTouchEvent";

export type EventType =
    "touch" | "touch:init" |
    "nanoleaf:state" |
    "nanoleaf:layout" | "nanoleaf:layout:layout" | "nanoleaf:layout:globalOrientation" |
    "nanoleaf:effects" |
    "nanoleaf:touch" | "nanoleaf:touch:single-tap" | "nanoleaf:touch:double-tap" | "nanoleaf:touch:swipe-up" | "nanoleaf:touch:swipe-down" | "nanoleaf:touch:swipe-left" | "nanoleaf:touch:swipe-right";
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