export class ExistingEntityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ExistingEntityError";
    }
}