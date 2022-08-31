export type ColorMode = "effect" | "ct" | "hs";

export interface NanoleafState {
    on:             boolean;

    hue:            number;
    saturation:     number;
    brightness:     number;
    colorTemp:      number;
}