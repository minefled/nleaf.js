export interface NanoleafPanelLayout {
    numPanels: number;
    sideLength: number;

    positions: Array<
        {
            panelId: number;
            x: number,
            y: number,
            o: number,
            shapeType: 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20;
            sideLength: number;
        }
    >;

    globalOrientation: number;
}