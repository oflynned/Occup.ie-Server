const url = "http://localhost:3000/api/v1/feature-flags";

const vm = new Vue({
    el: '#app',
    flags: [],
    data: {flags: []},
    created: function () {
        let _this = this;
        axios.get(url).then((flags) => _this.flags = flags.data)
    }
});
