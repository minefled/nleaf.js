/**
 * Options used to initialize a Nanoleaf Device
 */
export interface NanoleafClientOptions {
    /**
     * IP Address of the Nanoleaf Device
     */
    host: string;

    /**
     * The port of the Nanoleaf API on the Device. If not provided
     * this will default to 16021
     */
    port?: number;

    /**
     * Version of the API
     */
    version?: "v1" | "v2";

    /**
     * The Access Token to your Device
     */
    accessToken: string;

    /**
     * Options for the Touch Data Stream
     */
    touch?: NanoleafTouchOptions
}

/**
 * Options for the Touch Data Stream
 */
export interface NanoleafTouchOptions {
    /** Determines, whether or not the Touch Data Stream should be enabled or not; Default: false */
    enabled: boolean;

    /** Port of the UDP Server receiving the Touch Data stream; Default: 35508 */
    port?: number;
}