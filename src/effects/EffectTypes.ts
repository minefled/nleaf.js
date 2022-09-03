export type EffectPalette = Array<{
    /** Hue (0-359) of the Color as an Integer */
    hue: number;

    /** Saturation (0-100) of the Color as an integer */
    saturation: number;

    /** Brightness (0-100) of the color as an integer */
    brightness: number;

    /**
     * Probability of the color appearing in a highlight effect
     */
    probability?: number;
}>;

export type EffectCommandType = "add" | "request" | "delete" | "display" | "displayTemp" | "rename" | "requestAll";
export type EffectAnimType = "random" | "flow" | "wheel" | "fade" | "highlight" | "custom" | "static";

export interface EffectCommand {
    //// REQUIRED ////
    command: EffectCommandType;
    version: "1.0" | "2.0";

    /** Type of the effect */
    animType: EffectAnimType;

    /** Whether or not the effect should loop */
    loop: boolean;

    //// OPTIONAL ////

    /** Sets duration of temporary Effect in seconds */
    duration?: number;

    /** Effect Name. Not required for display commands. */
    animName?: string;

    /** New Name for the Effect when renaming */
    newName?: string;

    /** Rendered effect data; Only needed for custom and static types */
    animData?: string;

    /** Required for add and display commands */
    colorType?: "HSB";

    /** User defined colors for creating all effects except custom types */
    palette?: EffectPalette;

    /** Brightness range for random type effects */
    brightnessRange?: {
        minValue?: number;
        maxValue?: number;
    }

    /**
     * Transition time between colors. This will be a single value for
     * flow and wheel effects, and a range for random, fade and highlight effects
     */
    transTime?: number | {
        minValue?: number;
        maxValue?: number;
    }

    /**
     * Delay time between colors. This will be a single value for
     * flow and wheel effects, and a range for random, fade and highlight effects
     */
    delayTime?: number | {
        minValue?: number;
        maxValue?: number;
    }

    /** Degree of flow for flow type effects. flowFactor can range from 0 to infinity */
    flowFactor?: number;

    /** Math factor for explode effects. Can range from 0.0 to 1.0; Recommended: 0.5 */
    explodeFactor?: number;

    /** Determines the number of colors shown in wheel effects */
    windowSize?: number;

    /** effect directionality */
    direction?: string;

}

export interface EffectAnimationData {
    numPanels: number;
    panels: Array<PanelAnimationData>;
}

export interface PanelAnimationData {
    panelID: number;

    frames: Array<PanelAnimationFrame>;
}

export interface PanelAnimationFrame {
    r: number;
    g: number;
    b: number;
    w: number;
    t: number;
}