export default {
    data: {},
    get: (key) => { return this.data[key]; },
    set: (key, value) => { return this.data[key] = value; }
};
