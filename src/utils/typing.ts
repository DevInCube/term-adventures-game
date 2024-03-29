export const isNotNullable = <T>(x: T | null | undefined): x is T =>
    x !== null && typeof x !== "undefined";