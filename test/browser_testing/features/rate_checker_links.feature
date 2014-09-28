Feature: test the Rate Checker inbound and outbound links
  As a first time visitor to the Rate Checker page
  I want to click on links
  So that I can make informed choices when shopping for a mortgage loan

Background:
  Given I navigate to the "Rate Checker" page

@smoke_testing @rc
Scenario Outline: Click outbound links
  When I click on the "<link_name>" link in the Rate Checker page
  Then I should see "<page_title>" displayed in the page title

Examples:
  | link_name                               | page_title                                  	 |
  | Good Faith Estimates                    | What is a Good Faith Estimate?              	 |
  | points                                  | What are discount points or points?         	 |
  | closing costs                           | What are closing costs?                     	 |
  | discount points                         | What are discount points or points?         	 |
  | rate lock                               | What's a lock-in or a rate lock?            	 |
  | More mortgage questions on Ask CFPB     | Mortgages                                   	 |
  | credit report                           | Annual Credit Report.com                    	 |
  | get them corrected                      | How do I dispute an error on my credit report? |

@smoke_testing @rc
Scenario Outline: Click outbound links inside tab page
  When I click on the "I won’t buy for several months" tab in the Rate Checker page
    And I click on the "<link_name>" link in the Rate Checker page
  Then I should see "<page_title>" displayed in the page title

Examples:
  | link_name                               | page_title                                  |
  | Learn more about credit scores          | What is my credit score?                    |
  | Learn about improving your credit score | How do I get and keep a good credit score?  |
  | Learn more about down payments          | What kind of down payment do I need?        |

@smoke_testing @rc
Scenario: Click internal links
  When I click on the "About our data source" link in the Rate Checker page
  Then I should see the page scroll to the "#about" section
