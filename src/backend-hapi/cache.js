export default {
    data: {},
    get: (key) => { this.data[key]; },
    set: (key, value) => { this.data[key] = value; }
};
