/**
 * Constrains a number to a specified range
 * 
 * @param num The number to constrain
 * @param min The lowest value in the range
 * @param max The highest value in the range
 * @returns The constrained number
 * 
 * @example
 *      constrain(20, 0, 100);  // -> 20
 *      constrain(-31, 0, 100); // -> 0
 *      constrain(121, 0, 50);  // -> 50
 */
export function constrain(num:number, min:number, max:number) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Converts an array of bits to an integer
 * 
 * @param bits The Individual Bits
 * 
 * @example
 *      bitsToNumber([1, 1, 0, 1]);     // -> 13
 *      bitsToNumber([1, 0, 0, 0, 0]);  // -> 16
 */
export function bitsToNumber( bits:Array<0|1> ): number {
    let str = "";

    for(var b of bits) {
        str += b.toString();
    }

    return parseInt(str, 2);
}