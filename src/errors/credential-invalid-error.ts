export class CredentialInvalidError extends Error {
    constructor() {
        super('Credential invalid.');
        this.name = "CredentialInvalidError";
    }
}