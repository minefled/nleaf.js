import { constrain } from "../utils";

import type { Nanoleaf } from "../Nanoleaf";
import type { EffectAnimationData, EffectCommand } from "./EffectTypes";

export class EffectManager {

    constructor(private device:Nanoleaf) {

    }

    /**
     * Generates the raw animation data being sent to the Nanoleafs from the easier to use
     * EffectAnimationData type 
     * 
     * @param data 
     * @returns 
     */
    public static generateAnimData(data:EffectAnimationData): string {
        return `${data.numPanels} ${data.panels.map(
            p => `${p.panelID} ${p.frames.length} ${p.frames.map(
                f => `${constrain(f.r, 0, 255)} ${constrain(f.g, 0, 255)} ${constrain(f.b, 0, 255)} ${constrain(f.w, 0, 255)} ${Math.floor(f.t)}`
            ).join(" ")}`
        ).join(" ")}`;
    }

    public async displayEffect(command:EffectCommand) {
        await this.device._put("effects", {
            write: command
        });
    }

}