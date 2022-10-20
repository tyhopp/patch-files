const red = `\x1b[31m`;
const green = `\x1b[32m`;
const reset = `\x1b[0m`;

const log = {
  info(message) {
    console.info(message);
  },
  success(message) {
    console.info(`${green}${message}${reset}`);
  },
  error(message) {
    console.info(`${red}${message}${reset}`);
  },
};

export { log };
