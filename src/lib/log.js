const green = `\x1b[32m`;
const reset = `\x1b[0m`;

const log = {
  info(message) {
    console.info(message);
  },
  success(message) {
    console.info(`${green}${message}${reset}`);
  },
};

export { log };
