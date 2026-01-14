export class GoneError extends Error {
    constructor() {
        super('This link is no longer valid.');
        this.name = "GoneError";
    }
}