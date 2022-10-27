import cleanStack from "clean-stack";

export class PatchFilesError extends Error {
  constructor(message, options = {}) {
    const { cause } = options;

    super(message, options);

    this.stack = cleanStack(this.stack);

    if (cause) {
      this.cause = cause;
    }
  }
}
