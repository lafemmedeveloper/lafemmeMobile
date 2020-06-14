// @flow

let store: {[string]: string} = {};

const AsyncStorageMock = {
  getItem: async (key: string) =>
    typeof store[key] === 'string' ? store[key] : null,
  setItem: async (key: string, value: any) => {
    store[key] = value.toString();
    return true;
  },
  clear: async () => {
    store = {};
    return true;
  },
  // eslint-disable-next-line no-unused-vars
  removeItem: async (key: string) => {
    store[key];
    return true;
  },
};

export default AsyncStorageMock;
