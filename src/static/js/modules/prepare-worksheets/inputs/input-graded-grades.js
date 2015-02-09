// 'constants' for the grade settings
this.LOW = 2;
this.MEDIUM = 1;
this.HIGH = 0;
this.UNSET = null;

this.findGrade = function(index) {
  switch(index) {
  case this.LOW:
    return this.LOW;
  case this.MEDIUM:
    return this.MEDIUM;
  case this.HIGH:
    return this.HIGH;
  default:
    return this.UNSET;
  }
};
