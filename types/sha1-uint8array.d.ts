/**
 * https://github.com/kawanet/sha1-uint8array
 */

export declare function createHash(algorithm?: string): Hash

export interface Hash {
    update(data: string, encoding?: string): this;
    update(data: Uint8Array): this;
    update(data: ArrayBufferView): this;

    digest(): Uint8Array;
    digest(encoding: string): string;
}
