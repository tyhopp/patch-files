export class PatchFilesError extends Error {
  constructor(message, options = {}) {
    const { cause } = options;

    super(message, options);

    if (cause) {
      this.cause = cause;
    }
  }
}
