/**
 * returns the first index match of an array with a regular expression
 * @param  {Array of values} array
 * @param  {regex} regex the regular expression
 * @return {Number} index of first match, -1 if no matches
 */
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
