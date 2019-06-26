export default {

  inspect: function (formdata) {
    var object = {};
    formdata.forEach(function (value, key) {
      object[key] = value;
    });
    return object;
  }

}
