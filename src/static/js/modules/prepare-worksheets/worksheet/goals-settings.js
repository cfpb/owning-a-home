// Saved values for the goal inputs.
var _defaultValues = [
  {"text": "I want more space (for example, to accommodate a growing family)","grade": null},
  {"text": "I want certain features (for example, a yard)","grade": null},
  {"text": "I want to locate in a particular area (for example, a certain school district)","grade": null},
  {"text": "I want to decorate, renovate, or otherwise personalize my home","grade": null},
  {"text": "","grade": null},
  {"text": "", "grade": null}
];

var settings = {
  "inputModule": require("../input-graded"),
  "worksheetTemplate": require("../../../templates/prepare-worksheets/worksheet-goals.hbs"),
  "defaultValues": _defaultValues
};

this.settings = settings;
