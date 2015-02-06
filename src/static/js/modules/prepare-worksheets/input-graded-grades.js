// 'constants' for the grade settings
this.LOW = 2;
this.MEDIUM = 1;
this.HIGH = 0;
this.UNSET = null;

this.findGrade = function(index) {
  switch(index) {
    case this.LOW:
      return this.LOW;
    break;
    case this.MEDIUM:
      return this.MEDIUM;
    break;
    case this.HIGH:
      return this.HIGH;
    break;
    default:
      return this.UNSET;
  }
}
