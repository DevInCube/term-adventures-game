export class Lazy<T> {
    private _value: T | undefined;

    get value(): T {
        return this._value ??= this._initializer();
    }

    constructor(
        private _initializer: () => T
    ) {

    }
}