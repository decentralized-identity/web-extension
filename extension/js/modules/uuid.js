
export default {
  generate() {
    return crypto.getRandomValues(new Uint8Array(16)).join('');
  }
};