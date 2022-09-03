import { constrain } from "../utils";
import { EffectManager } from "./EffectManager";
import type {
    EffectAnimType,
    EffectCommand,
    EffectCommandType,
    PanelAnimationData,
    PanelAnimationFrame
} from "./EffectTypes";

/**
 * Builds Effect Commands being sent to the panels
 * 
 * @example
 *   let cmd = new EffectCommandBuilder("display", "static")
 *       .addPanelAnimation(69420)
 *           .addFrame(0, 0, 0, 0, 0)
 *           .addFrame(255, 255, 255, 0, 10)
 *           .build()
 *       .loop(true)
 *       .build();
 * 
 * @example
 *   let cmdBuilder = new EffectCommandBuilder("display", "static");
 *   for(var p of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
 *       let anim = cmdBuilder.addPanelAnimation(p);
 *
 *       for(var i=0; i<8; i++) { anim.addFrame(
 *           Math.random()*255, Math.random()*255, Math.random()*255, 0, 0
 *       ); }
 *
 *       anim.build();
 *   }
 *  
 *   let cmd = cmdBuilder.build();
 */
export class EffectCommandBuilder {

    public effect:EffectCommand;

    public panelAnimations:Array<PanelAnimationData> = [];

    constructor(command:EffectCommandType, animType: EffectAnimType) {
        this.effect = {
            command,
            version: "1.0",
            animType,
            loop: false,
            palette: []
        };
    }

    public loop(v:boolean) {
        this.effect.loop = v;
        return this;
    }

    public version(v:"1.0"|"2.0") {
        this.effect.version = v;
        return this;
    }

    ////// Brightness Range ////

    public minBrightnessRange(v:number) {
        if(!this.effect.brightnessRange) this.effect.brightnessRange = {};
        this.effect.brightnessRange.minValue = v;
    }

    public maxBrightnessRange(v:number) {
        if(!this.effect.brightnessRange) this.effect.brightnessRange = {};
        this.effect.brightnessRange.maxValue = v;
    }

    ////// Transition Time //////

    public transitionTime(v:number) {
        this.effect.transTime = v;
        return this;
    }

    public minTransitionTime(v:number) {
        if(typeof this.effect.transTime !== "object") this.effect.transTime = {};
        this.effect.transTime.minValue = v;
        return this;
    }

    public maxTransitionTime(v:number) {
        if(typeof this.effect.transTime !== "object") this.effect.transTime = {};
        this.effect.transTime.maxValue = v;
        return this;
    }

    ////// Delay Time //////

    public delayTime(v:number) {
        this.effect.delayTime = v;
        return this;
    }

    public minDelayTime(v:number) {
        if(typeof this.effect.delayTime !== "object") this.effect.delayTime = {};
        this.effect.delayTime.minValue = v;
        return this;
    }

    public maxDelayTime(v:number) {
        if(typeof this.effect.delayTime !== "object") this.effect.delayTime = {};
        this.effect.delayTime.maxValue = v;
        return this;
    }

    ////// Misc //////

    public flowFactor(v:number) {
        this.effect.flowFactor = constrain(v, 0, Infinity);
        return this;
    }

    public explodeFactor(v:number) {
        this.effect.explodeFactor = constrain(v, 0.0, 1.0);
        return this;
    }

    public direction(d:string) {
        this.effect.direction = d;
        return this;
    }

    public windowSize(s:number) {
        this.effect.windowSize = s;
        return this;
    }

    public duration(d:number) {
        this.effect.duration = d;
        return this;
    }

    ////// Animations //////

    public addPanelAnimation(panelID:number) {
        return new PanelAnimationBuilder(this, panelID);
    }

    public addPanelAnimations(panels:Array<PanelAnimationData>) {
        this.panelAnimations = [...this.panelAnimations, ...panels];
        return this;
    }

    public build() {
        let command = this.effect;

        if(this.panelAnimations.length > 0) {
            this.effect.animData = EffectManager.generateAnimData({
                numPanels: this.panelAnimations.length,
                panels: this.panelAnimations
            });
        }

        return command;
    }

}

export class PanelAnimationBuilder {

    public frames: Array<PanelAnimationFrame> = [];

    constructor(private effect:EffectCommandBuilder, private panelID) {
    }

    public addFrame(r:number, g:number, b:number, w:number, t:number) {
        this.frames.push({
            r, g, b, w, t
        });
        return this;
    }

    public build() {
        for(var pa of this.effect.panelAnimations) {
            if(pa.panelID == this.panelID) return;
        }

        this.effect.panelAnimations.push({
            panelID:  this.panelID,
            frames:   this.frames
        });

        return this.effect;
    }

}
