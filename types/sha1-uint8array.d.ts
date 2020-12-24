/**
 * sha1-uint8array.d.ts
 */

export declare function createHash(algorithm?: string): Hash;

declare class Hash {
    update(data: string, encoding?: string): this;
    update(data: Uint8Array): this;

    digest(): Uint8Array;
    digest(encoding: string): string;
}
