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
    "financial": function () {
        return {
          "title": "Financial Goal",
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
    "financial": function () {
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

    "financial": function () {
      return [
        {
          "text":"I want to build wealth in the form of equity",
          "grade":null,
          "altText":"??",
          "explanation":"Learn more: In the long term, owning a home can be a great way to build wealth.  However, it’s important to know that during the first several years of a mortgage, <a href=#>most of your payment goes to interest, not equity</a>.  Also, remember that if home prices go down instead of up – as they did in 2008-2012 – you could lose all of your equity, including your down payment.",
          "deletable": false
        },
        {
          "text":"I believe I can buy a nicer home for the same cost as my rent",
          "grade":null,
          "altText":"??",
          "explanation":"Learn more: This is often true.  However, it’s important to factor in the total costs of ownership – including insurance, taxes, maintenance, and discretionary improvements – as well as increases in other costs, such as commuting, that may result from buying.  And depending on the real estate market, sometimes renting can actually be cheaper.",
          "deletable": false
        },
        {
          "text":"I want to save money on my taxes with the mortgage deduction",
          "grade":null,
          "altText":"??",
          "explanation":"Learn more: You can only claim the mortgage interest tax deduction if you itemize your deductions.  For a typical $200,000 mortgage at 4.5%, you’d be able to deduct about $8900 for interest in the first year, and less in future years.  The standard deduction for a married couple is $12,600 in tax year 2015, so unless that couple has at least $4700 in other deductions, having a mortgage won’t lower their taxes.  For heads of household, the standard deduction is $9,250, and for singles it is $6,300.",
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
