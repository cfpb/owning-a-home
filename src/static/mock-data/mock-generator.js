var data = {},
    i;

var getRand = function(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min) * 10) / 10;
};

var getRandInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

i = getRandInt(8, 12);

while(i--) {
  data[getRand(3, 7)] = getRandInt(1, 16);
}

module.exports = { data: data };
