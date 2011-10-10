 /*
 * Privacy policy detector and grader
 * (1) Using weighting method to judge if a page is privacy policy
 * (2) Grading the privacy policy based on appearance of keywords
 * Code derived from The Chromium SandwichBar Sample which is under BSD lincense
 */
 
//Regular Expressions for match the keywords in pages
var regex_PP = /privacy.?polic/gi;
var regex_statement = /privacy.?statement/gi;
var regex_notice = /privacy.?notice/gi;
//Detector elements
var regex_policy = /polic(y|ies)/gi;
var regex_cookies = /cooki/gi;
var regex_pii = /personal.?info/gi;
var regex_ssl = /(\WSSL|encrypt|safeguard)/gi;
//Grader elements
var regex_children = /children/gi;
var regex_safeharbor = /safe.?harbor/gi;
var regex_truste = /truste/gi;
var regex_third = /third.?part/gi;
var regex_choice = /(choice|opt.?(out|in))/gi;
var regex_location = /location/gi;
var regex_ads = /(\sads|advertis)/gi; //Only matech ads with a space in front
var regex_collect = /collect/gi;
var regex_share = /(share|disclos)/gi;

//Numerial variables for counts of words/phrase
var length_PP = 0;
var length_statement = 0;
var length_notice = 0;
var length_cookies = 0;
var length_policy = 0;
var length_pii = 0;
var length_ssl = 0;
var length_children = 0;
var length_safeharbor =  0;
var length_truste =  0;
var length_third =  0;
var length_choice =  0;
var length_location =  0;
var length_ads = 0;
var length_collect = 0;
var length_share = 0;

//Booleans for grading
var boolean_cookies = 0;
var boolean_ssl = 0;
var boolean_children = 0;
var boolean_safeharbor =  0;
var boolean_truste =  0;
var boolean_third =  0;
var boolean_choice =  0;
var boolean_location =  0;
var boolean_ads = 0;
var boolean_collect = 0;
var boolean_share = 0;

//Match the regex's
matches_PP = document.body.innerText.match(regex_PP);
matches_statement = document.body.innerText.match(regex_statement);
matches_notice = document.body.innerText.match(regex_notice);
matches_cookies = document.body.innerText.match(regex_cookies);
matches_policy = document.body.innerText.match(regex_policy);
matches_pii = document.body.innerText.match(regex_pii);
matches_ssl = document.body.innerText.match(regex_ssl);
//Grader
matches_children = document.body.innerText.match(regex_children);
matches_safeharbor = document.body.innerText.match(regex_safeharbor);
matches_truste = document.body.innerText.match(regex_truste);
matches_third = document.body.innerText.match(regex_third);
matches_choice = document.body.innerText.match(regex_choice);
matches_location = document.body.innerText.match(regex_location);
matches_ads = document.body.innerText.match(regex_ads);
matches_collect = document.body.innerText.match(regex_collect);
matches_share = document.body.innerText.match(regex_share);

//Count matches
if (matches_PP) { length_PP = matches_PP.length; }
if (matches_statement) { length_statement = matches_statement.length; }
if (matches_notice) { length_notice = matches_notice.length; }
if (matches_cookies) { length_cookies = matches_cookies.length; boolean_cookies = 1; }
if (matches_policy) { length_policy = matches_policy.length; }
if (matches_pii) { length_pii = matches_pii.length; }
if (matches_ssl) { length_ssl = matches_ssl.length; boolean_ssl = 1; }
//Grader
if (matches_children) { length_children = matches_children.length; boolean_children = 1;}
if (matches_safeharbor) { length_safeharbor = matches_safeharbor.length; boolean_safeharbor = 2; }
if (matches_truste) { length_truste = matches_truste.length; boolean_truste = 1; }
if (matches_third) { length_third = matches_third.length; boolean_third = 1; }
if (matches_choice) { length_choice = matches_choice.length; boolean_choice = 1; }
if (matches_location) { length_location = matches_location.length; }
if (matches_ads) { length_ads = matches_ads.length; boolean_ads = 1; }
if (matches_collect) { length_collect = matches_collect.length; boolean_collect = 1; }
if (matches_share) { length_share = matches_share.length; boolean_share = 1; }
//Location needs frequency to justify
if (length_location >= 5) { boolean_location = 0.5; }

//Sum all appearances of 'privacy policy' related keywords
var first_detect = length_PP + length_statement + length_notice;
var final_detect = 0;

//Detector
//Weighing alogirthm to detect privacy policy page
//Following W3C typing convention
if ( first_detect < 2 ) 
  {
  final_detect = first_detect;
  } 
else if ( first_detect >= 2 && first_detect <= 10 ) 
  {
  final_detect = first_detect + length_cookies*2 + length_policy/2 + length_pii + length_ssl + length_collect/2 + length_choice/2;
  } 
else
  { 
  final_detect = first_detect + 10; 
  }

//Grader
//Sumup of the booleans

var grade = 0;
grade =  boolean_cookies + boolean_ssl + boolean_children + boolean_safeharbor + boolean_truste + boolean_third + boolean_choice + boolean_location + boolean_ads + boolean_collect + boolean_share;
if (grade >= 10) { grade = 10; }

//Passing both flags to background
if (final_detect>10) {

  //Pass the flag back only
  var payload = {
    count: final_detect,    // Pass detector score
	count2: grade			// Pass the grade
  };
  chrome.extension.sendRequest(payload, function(response) {});
}

//Passing flag to background
/*Original Version
if (final_detect) {

  //Pass the flag back only
  var payload = {
    count: grade    // Pass the number of matches back.
  };
  chrome.extension.sendRequest(payload, function(response) {});
}
*/

