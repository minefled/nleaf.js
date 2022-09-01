export type TouchType = "hover" | "down" | "hold" | "up" | "swipe" | "unknown";

/**
 * Represents a Touch Event for a specific panel of the layout
 */
export interface NanoleafTouchEvent {
    timestamp: number;

    /**
     * Id of the panel the Event is happening on
     */
    panelID: number;

    /**
     * The type of the touch as a string
     */
    touchType: TouchType;

    /**
     * The type of the touch as the raw number
     */
    touchTypeRaw: 0 | 1 | 2 | 3 | 4 | number;

    /**
     * Strength of the Touch on the panel
     */
    touchStrength: number;

    /**
     * Stores the ID of the previous panel if the touchType is **swipe** (touchTypeRaw == 4)
     */
    swipePanelID?: number;
}

export const touchTypeMap = ["hover", "down", "hold", "up", "swipe"];

/**
 * Maps the raw touch type IDs (uint8) to string IDs in
 * order to make development easier
 */
export function mapTouchType( id:number ): TouchType {
    return (touchTypeMap[id] || "unknown") as TouchType;
}