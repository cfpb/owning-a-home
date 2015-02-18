var gradedInput = require( './inputs/input-graded' );
var notesInput = require( './inputs/input-notes' );
var editorTemplate = require( '../../templates/prepare-worksheets/worksheet-editor.hbs' );
var _self = this;

var grades = {
    "goals": ["High", "Med", "Low"],
    "risks": ["Yes", "Maybe", "No"]
}

this.gradeSummaryLabels = {
    "goals": ["High Priority", "Medium Priority", "Low Priority"],
    "flags": ["Likely to happen", "Somewhat likely to happen", "Not likely to happen"],
    "risks": ["Ready to accept", "Somewhat ready to accept", "Not ready to accept"]
}

this.getWorksheetRowDefaults = function () {
    return {
       "text":"",
       "grade":null,
       "altText":"",
       "explanation":"",
       "deletable": true
    }
};

this.worksheetData = {
    "personal": function () {
        return {
          "title": "Personal Goal",
          "prompt": "Priority Level",
          "placeholder": "Write your own goal",
          "grades": grades.goals
        }
    },
    "alternatives": function () {
        return {
          "title": "Goal",
          "prompt": "How else can I achieve this goal?",
          "placeholder": "Write an alternative to this goal"
        }
    },
    "risks": function () {
        return {
          "title": "Issue",
          "prompt": "Are you ready to accept this risk?",
          "placeholder": "Identify your own risk",
          "grades": grades.risks
       }
    },
    "flags": function () {
        return {
          "title": "Issue",
          "prompt": "Is this likely?",
          "placeholder": "Identify your own flag",
          "grades": grades.risks
        }
    }
}

this.worksheetModules = {
    "personal": function () {
        return {
          "inputType": "graded",
          "worksheetTemplate": editorTemplate,
          "InputModule": gradedInput
        }
    },
    "alternatives": function () {
        return {
          "inputType": "notes",
          "worksheetTemplate": editorTemplate,
          "InputModule": notesInput
        }
    },
    "risks": function () {
        return {
          "inputType": "graded",
          "worksheetTemplate": editorTemplate,
          "InputModule": gradedInput
        }
    },
    "flags": function () {
        return {
          "inputType": "graded",
          "worksheetTemplate": editorTemplate,
          "InputModule": gradedInput
        }
    }
}

this.worksheetDefaults = {
    "personal": function () {
        return [  
          {  
              "text":"I want more space (e.g., for a growing family).",
              "grade": null,
              "altText":"I could move to a larger rental unit instead.",
              "explanation":"",
              "deletable": false
          },
          {  
              "text":"I want certain features (e.g., a yard).",
              "grade": null,
              "altText":"I could find these features in a rental unit in my community.",
              "explanation":"",
              "deletable": false
          },
          {  
              "text":"I want to live in a particular area (e.g., a certain school district).",
              "grade": null,
              "altText":"There are rental units available in my desired location.",
              "explanation":"",
              "deletable": false
          },
          {  
              "text":"I want the freedom to decorate or renovate.",
              "grade": null,
              "altText":"There are things I could do to make my rental feel more like my own.",
              "explanation":"",
              "deletable": false
          }
      ]
    },
    
    "flags": function () {
        return [
            {  
                "text":"There is chance I might move within the next few years",
                "grade":null,
                "altText":"Renters have more flexibility. It can be risky and expensive to buy if you end up needing to move again within a few years.",
                "explanation":"",
                "deletable": false
            },
            {  
                "text":"My current employment is short-term or unstable",
                "grade":null,
                "altText":"Owning a home is a long-term financial commitment. If you’re not confident that you’ll be able to continue earning at a similar level for the foreseeable future, it might make more sense to keep renting.",
                "explanation":"",
                "deletable": false
            },
            {  
                "text":"I find fixing things and doing yardwork to be a real hassle",
                "grade":null,
                "altText":"In a lot of ways, it’s simpler and more financially predictable to rent.",
                "explanation":"",
                "deletable": false
            }
        ]
    },
    
    "risks": function () {
        return [
            {  
                "text":"My home value could decline and I could lose my equity",
                "grade":null,
                "altText":"You could even find yourself owing more than your home is worth. In 2008-2012, house prices declined dramatically nationwide, with up to X% declines in some areas.",
                "explanation":"",
                "deletable": false
            },
            {  
                "text":"Major repairs can be urgent, expensive, and unexpected",
                "grade":null,
                "altText":"When the furnace springs a leak or a tree falls on the roof, these aren’t repairs that you can wait to make. New homeowners consistently say that they were surprised how much maintenance costs.",
                "explanation":"",
                "deletable": false
            },
            {  
                "text":"Minor repairs add up quickly, in terms of time and money",
                "grade":null,
                "altText":"Think of all the little things that you are used to calling your landlord to deal with: a cracked window, a broken dishwasher, or a clogged toilet. As a homeowner, you will either have to fix these yourself or call and pay for a professional.",
                "explanation":"",
                "deletable": false
            }
        ]
      }
};


this.getAllWorksheetDefaults = function () {
    var data = _self.worksheetDefaults;
    var obj = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        obj[key] = data[key]();
      }
    }
    return obj;
}
