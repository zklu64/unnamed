define([], function () {
    var reIndexOf = function (array, regex) {
      for (var i = 0; i < array.length; i++) {
          if (array[i].toString().match(regex)) {
              return i;
          }
      }
      return -1;
    };

    return reIndexOf;
});
