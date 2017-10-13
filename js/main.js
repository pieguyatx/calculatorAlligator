$(document).ready(function(){
  // initialize common variables
  var state = {};
  state.operatorExists = false; // status of operator in history
  state.equalsExists = false; // status of equals sign in history
  state.history = { // strings defining the history
    "numFirst": undefined,
    "operator": undefined,
    "numSecond": undefined,
    "text": ""
  };
  state.result = "0"; // string defining the displayed result

  // To be used for visualize [vis()] function
  var stateVis = {
    "history": {"value": undefined, "orientation": "add"},
    "result": {"value": 0, "orientation": "add"}
  };

  // Read in button presses (types: clear, square/operator, number, dec, sign, equals)
  listenToKeyboard(state,stateVis); // listen for all keys
  // Listen for signal: CLEAR
  listenForClear(state,stateVis);
  // Listen for signal: number 0-9
  listenForNumber(state,stateVis);
  // Listen for signal: DECIMAL
  listenForDecimal(state,stateVis);
  // Listen for signal: operator +-*/
  listenForOperator(state,stateVis);
  // Listen for signal: SIGN
  listenForSign(state,stateVis);
  // Listen for signal: EQUALS
  listenForEquals(state,stateVis);
  // Listen for signal: SQUARED
  listenForSquared(state,stateVis);
});

// note: key codes reference: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// TO DO: Add visualizations.. (in progress 10/5/17)
// TO DO: will need to visually denote button presses somehow when keyboard is used
// TO DO: Remove debug comments/code

// KEYBOARD ====================================================================
function listenToKeyboard(state,stateVis){
  $(document).on('keyup', function(event){
    // ESC key
    var operator;
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===27){
      console.log("Key pressed (ESC): CLEAR"); // debug
      clear(state,stateVis,true);
    }
    // DIGITS
    else if (charCode>=48 && charCode<=57 && event.shiftKey===false){
      var digit = (charCode-48).toString();
      console.log("Keyboard pressed (digit): " + digit); // debug
      numberPressed(digit,state,stateVis);
      digit = NaN;
    } else if(charCode>=96 && charCode<=105){ // numpad
      var digit = (charCode-96).toString();
      console.log("Keyboard pressed (digit, numpad): " + digit); // debug
      numberPressed(digit,state,stateVis);
      digit = NaN;
    }
    // DECIMAL
    else if ((charCode===190 && event.shiftKey===false) || charCode===110){
      console.log("Key pressed (.): DECIMAL POINT"); // debug
      if(state.result!="error"){
        decimalPoint(state,stateVis);
      }
    }
    // SIGN
    else if (charCode===192 && event.shiftKey===true){
      console.log("Key pressed (~): SIGN"); // debug
      sign(state,stateVis);
    }
    // SQUARED (^)
    else if (charCode===54 && event.shiftKey===true){
      console.log("Key pressed (^): SQUARED"); // debug
      squared(state,stateVis);
    }
    // OPERATORS
    else if ((charCode===187 && event.shiftKey===true) || charCode===107){
      operator = "add";
    } else if ((charCode===189 && event.shiftKey===false) || charCode===109){
      operator = "subtract"
    } else if ((charCode===56 && event.shiftKey===true) || charCode===106){
      operator = "multiply"
    } else if ((charCode===191 && event.shiftKey===false) || charCode===111){
      operator = "divide"
    }
    if(operator){ // if operator exists, go on...
      console.log("Keyboard pressed (operator): " + operator); // debug
      operatorPressed(operator,state,stateVis);
      operator = NaN; // clear var so as not to trigger anything later
    }
  });
}

// CLEAR =======================================================================
function listenForClear(state,stateVis){
  // mouse click
  $("#clear").on('click', function(){
    console.log("Button pressed: CLEAR"); // debug
    clear(state,stateVis,true);
  });
}

function clear(state,stateVis,clearVis){
  state.operatorExists = false;
  state.equalsExists = false;
  state.history = {"numFirst": undefined, "operator": undefined, "numSecond": undefined, "text": ""};
  $("#history").html(state.history.text);   // clear history
  state.result = "0";
  $("#result").html(state.result); // clear result
  let statements = ["You reset? Feed me more numbers!","Yes, let's clear this table.","Tasty!","Mmmmm...","More savory sevens!", "More tasty twos!", "More finger-lickin' fours!","More tempting tens!","Scrumptious!","Very palatable values.","More succulent sixes!","'What a thrill it will be to throw back more threes.' -Me","Empty the buffet!","More flavorful fives!","Why was Six afraid of Seven? ...Because Seven ate Nine! Ha ha!","New number, new plate.","I'll take the Number 5 special, please.","Food goes INTEGER mouth!","Looking forward to some number salad!","Stop feeding me? Don't be IRRATIONAL.","I'll take the PRIME number steak, please.","More zesty zeros!","How about some negative number nougat?","How about a wilted salad of ones?","More excellent eights!","More num-nums made of nines!","I'm hungry for hundreds!","I'm thirsty for thousands!","More mouth-watering millions!","A dozen decimals, please.","Clear the table!","Make way for more food...","I'm opening wide for some ones, next."];
  displayHelp(randomStatement(statements));
  // If flag set to clear the visualizations === true, then clear the visualizations
  if(clearVis){
    vis(state, stateVis);
  }
}

// NUMBER ======================================================================
function listenForNumber(state,stateVis){
  // mouse click
  $(".digit").on('click', function(){
    var digit = this.value.toString();
    console.log("Button pressed (digit): " + digit); // debug
    numberPressed(digit,state,stateVis);
    digit = NaN;
  });
}

function numberPressed(digit,state,stateVis){
  // If Result has no error:
  if(state.result!="error"){
    // If there is NOT an EQUALS in the history already...
    if(state.equalsExists===false){
      // If result number = (0) without decimal point or empty
      if(state.result=="0" || state.result==""){ // string or number is fine
        // put digit in results, replacing 0
        state.result = digit;
        $("#result").html(state.result);
      }
      // else if current number != (0),
      else if(state.result!="0" && state.result!="error"){
        // add digit to number on right-hand side
        state.result = state.result.concat(digit);
        $("#result").html(state.result);
        // if it's a 2nd number, division, and divisor>1 & length==2 exactly, output "divisor" msg
        if(state.history.numFirst!=undefined && state.history.operator==="divide" && parseInt(state.result)>1 && state.result.length===3){
          displayHelp("That DIVISOR looks delectable.");
        }
      }
    }
    // If there's already an (equals) in the history
    else if(state.equalsExists===true){
      clear(state,stateVis);
      state.result = digit;
      $("#result").html(state.result);
    }
  }
  // if result is "error"
  else{
    // put digit in results, replacing 0
    state.result = digit;
    $("#result").html(state.result);
    // clear history
    state.operatorExists = false;
    state.equalsExists = false;
    state.history = {"numFirst": undefined, "operator": undefined, "numSecond": undefined, "text": ""};
    $("#history").html(state.history.text);
    // update help text
    displayHelp("OK. That number looks tasty.");
  }
  // visualize results
  vis(state,stateVis);
};

// DECIMAL =====================================================================
function listenForDecimal(state,stateVis){
  // mouse click
  $("#decimal").on('click', function(){
    console.log("Button pressed: DECIMAL POINT"); // debug
    if(state.result!="error"){
      decimalPoint(state,stateVis);
    }
  });
}

function decimalPoint(state,stateVis){
  // if there is not an EQUALS already in the history, modify result number
  if(state.equalsExists===false){
    // If current result number is (0), (0.), or empty,
    if(state.result=="0" || state.result=="0." || state.result==""){
      // replace result with (0.)
      state.result = "0.";
      $("#result").html(state.result);
      // update help text
      displayHelp("Such a teensy number!");
    }
    // if there is a decimal in the result number already, output an error
    else if(state.result.indexOf(".")>0){
      state.result = "error";
      $("#result").html(state.result);
      displayHelp("Too many decimal points!");
    }
    // If current result number is != (0), (0.) or empty
    else{
      // add decimal to number on right-hand side
      state.result = state.result.concat(".");
      $("#result").html(state.result);
    }
  }
  // if there is an EQUALS already in the history, then start a new number...
  else if(state.equalsExists===true){
    clear(state,stateVis,true);
    // replace result with (0.)
    state.result = "0.";
    $("#result").html(state.result);
    // update help text
    displayHelp("Making a small number, eh?");
  }
  // visualize
  vis(state,stateVis);
}

// operators: +-*/==============================================================
function listenForOperator(state,stateVis){
  var operator;
  // mouse click
  $(".operator").on('click', function(){
    operator = this.value;
    console.log("Button pressed (operator): " + operator); // debug
    operatorPressed(operator,state,stateVis);
    operator = NaN; // clear var so as not to trigger anything later
  });
}

function operatorPressed(operator,state,stateVis){
  // If result is ERROR
  if(state.result==="error"){
    displayHelp("Press the ESC key or AC button to reset this meal.");
  }
  // If no error in the result...
  else {
    // console.log(state); // debug
    // If there is NO 1st operator in the history already (and no equals?)...
    if(state.operatorExists===false && state.equalsExists===false){
      // assume (1st num) = number on result (stored in string?)
      state.history.numFirst = state.result;
      // set history as (1st num) (operator)
      state.history.operator = operator;
      let symbol;
      symbol = getSymbol(operator);
      state.history.text = state.history.numFirst.concat(" " + symbol);
      $("#history").html(state.history.text);
      // clear result results (empty)
      state.result = "";
      $("#result").html(state.result);
      // store status of "operatorExists" to true
      state.operatorExists = true;
      // store status of "equalsExists" to false
      state.equalsExists = false;
    }
    // If there IS a 1st operator in the history already, no 2nd num, and NO equals sign...
    else if(state.operatorExists===true && state.history.numSecond===undefined && state.equalsExists===false){
      // ...and if the number in result is empty...
      if(state.result===""){
        // Replace the 1st operator in the history with the new operator
        state.history.operator = operator;
        let symbol;
        symbol = getSymbol(operator);
        state.history.text = state.history.numFirst.concat(" " + symbol);
        $("#history").html(state.history.text);
      }
      // ...and if the number on result exists/not empty...
      else if(state.result!=""){
        // Assume (1st num) = the one in the history already
        // Assume (2nd num) = number on result
        state.history.numSecond = state.result;
        // Calculate (1st num) (operator) (2nd num); store as (ans)
        equals(state); // calculate before updating operator
        // Replace history with (1st num) (operator) (2nd num) =
        state.history.operator = operator;
        // Assume (resultNum) = (1st num)
        state.history.numFirst = state.result;
        state.history.numSecond = undefined;
        // Replace history with (1st num) (new operator)
        let symbol = getSymbol(operator,true);
        state.history.text = state.history.numFirst.concat(" " + symbol);
        $("#history").html(state.history.text);
        // Empty the result
        state.result = "";
        $("#result").html("")
        // store status of "operatorExists" to true
        state.operatorExists = true;
        // store status of "equalsExists" to false
        state.equalsExists = false;
      }
    }
    // If there IS a 1st operator in the history already AND an equals sign...
    else if(state.operatorExists===true && state.equalsExists===true){
      // assuming result is NOT empty (otherwise there would be no equals)...
      // Assume (resultNum) = (1st num)
      state.history.numFirst = state.result;
      state.history.numSecond = undefined;
      // Replace history with (1st num) (new operator)
      state.history.operator = operator;
      let symbol = getSymbol(operator);
      state.history.text = state.history.numFirst.concat(" " + symbol);
      $("#history").html(state.history.text);
      // Empty the result
      state.result = "";
      $("#result").html("")
      // store status of "operatorExists" to true
      state.operatorExists = true;
      // store status of "equalsExists" to false
      state.equalsExists = false;
    }
  }
  // visualize
  vis(state,stateVis);
};

function getSymbol(operator,noDisplay){
  var message;
  if(operator==="add"){
    symbol="+";
    message = "ADD some good ingredients.";
  }
  else if(operator==="subtract"){
    symbol="&minus;";
    message = "Don't SUBTRACT too much flavor...";
  }
  else if(operator==="multiply"){
    symbol="&times;";
    message = "MULTIPLY the portion size!";
  }
  else if(operator==="divide"){
    symbol="&divide;";
    message = "That DIVIDEND looks delicious.";
  }
  if(!noDisplay){ // default is to display message
    displayHelp(message);
  }
  return symbol;
}

// SIGN ========================================================================
function listenForSign(state,stateVis){
  // mouse click
  $("#sign").on('click', function(){
    console.log("Button pressed: SIGN"); // debug
    sign(state,stateVis);
  });
}

function sign(state,stateVis){
  var statements;
  // if (resultNum) is != (0) or (0.)
  if(state.result!="0" && state.result!="0." && state.result!=""){
    // flip resultNum to opposite sign
    state.result = (-parseFloat(state.result)).toString();
    $("#result").html(state.result);
    // output appropriate message
    if(parseFloat(state.result)>0){
      statements=["I am POSITIVE I want to eat that.","I am positively hungry.","Your generosity makes me feel so POSITIVE.","I am positively ravenous."];
    }
    else{
      statements=["Neat number! No NEGATIVE attitude from me!","Skip lunch today? That's a NEGATIVE.","Delay dinner? NEGATIVE.","The opposite value still looks great!"];
    }
    // If the history has an EQUALS, erase the history (new problem starting)
    if(state.equalsExists===true){
      state.operatorExists = false;
      state.equalsExists = false;
      state.history = {"numFirst": undefined, "operator": undefined, "numSecond": undefined, "text": ""};
      $("#history").html(state.history.text);   // clear history
    }
  }
  else if(state.result==="" || state.result===NaN){
    statements=["You need to give a number, before you can change its sign.","Please give me a number before changing its sign."];
  }
  // if (resultNum) is (0) or (0.) or empty, do nothing
  else{
    statements=["Zero food? Zero has no SIGN.","Negative zero is... zero!","You know, +0 and -0 are all tasty zeros to me."];
  }
  // display appropriate help message
  displayHelp(randomStatement(statements));
  // visualize number in result if it's not zero
  if(state.result!="0" && state.result!="0." && state.result!=""){
    vis(state,stateVis);
  }
}

// EQUALS ======================================================================
function listenForEquals(state){
  // keyboard: = keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===187 && event.shiftKey===false){
      console.log("Key pressed (=): EQUALS"); // debug
      equals(state);
    }
  });
  // mouse click
  $("#equals").on('click', function(){
    console.log("Button pressed: EQUALS"); // debug
    equals(state);
  });
}

function equals(state,noDisplay){
  var statements;
  // If (operatorExists) is false && (equalsExists) is false
  // OR if (equalsExists) in history already
  if(state.equalsExists===true || (state.operatorExists===false && state.equalsExists===false)){
    // do nothing; or just do some silly animation? "Are you calculating something?"
    statements = ["That equals itself, doesn't it?","What is the calculation?"];
  }
  // If (operatorExists) is true && (equalsExists) is false...
  else if(state.operatorExists===true && state.equalsExists===false){
    // If result is empty
    if(state.result===""){
      // do nothing; or have gator say "I need a number" or something
      statements = ["What number are you going to enter?","I need another number..."];
    }
    // If result is not empty (resultNum) exists/has value
    else if(state.result!=""){
      // Assume (1st num) = the one in the history already
      // Assume (2nd num) = number on result
      state.history.numSecond = state.result;
      // Calculate (1st num) (operator) (2nd num); store as (ans)
      var calc, symbol;
      if(state.history.operator==="add"){
         calc = parseFloat(state.history.numFirst) + parseFloat(state.history.numSecond);
         symbol="+";
         statements = ["This is SUM meal!","Great addition to the menu.","More, more, more!","Add this to my bill."];
      }
      else if(state.history.operator==="subtract"){
        calc = parseFloat(state.history.numFirst) - parseFloat(state.history.numSecond);
        calc = reduceErrors(calc); // deal with rounding error
        symbol="&minus;";
        statements = ["Is this food, or is this math? I can't tell the DIFFERENCE!","Less is more, sometimes.","Your subtraction is sweet perfection."];
      }
      else if(state.history.operator==="multiply"){
        calc = parseFloat(state.history.numFirst) * parseFloat(state.history.numSecond);
        calc = reduceErrors(calc); // deal with rounding error
        symbol="&times;";
        if(calc>1e15){
          statements = ["Over a QUADRILLION? I am honored!","Your quest for quadrillion has been fulfilled!","How about gettting me a good GOOGOL while you'are at it?","What a blessed banquet!"];
        }
        else if(calc>100000){
          statements = ["What a humongous PRODUCT!","I like these large portions.","Thanks for these enormous edibles.","What FACTORS led you to produce this big number?"];
        }
        else{
          statements = ["What a great food PRODUCT!","I like this multiplication of food choices.","Your numbers are mushrooming.","This PRODUCT is perplexingly good.","Mighty multiplication strikes again!"];
        }
      }
      else if(state.history.operator==="divide"){
        if(state.history.numSecond==0){
          calc = undefined;
        }
        else{
          calc = parseFloat(state.history.numFirst) / parseFloat(state.history.numSecond);
        }
        symbol="&divide;";
        if(calc===undefined){
          statements = ["Dividing by zero is undefined.","Sorry, I don't understand dividing by zero.","What does it mean to divide exactly by zero?","How do I divide a meal by zero people?","How do I divide a cake among zero people?"];
          state.result="error";
          $("#result").html(state.result);
        }
        else if(Math.abs(calc)<1e-10){
          statements = ["I'll digest this tiny QUOTIENT quickly.","Are you serving me air?","Bigger numbers, please.","The tiniest of tastes!"];
        }
        else if(Math.abs(calc)<0.01){
          statements = ["We shouldn't quibble about this tiny QUOTIENT.","Yes, even this fraction of food is a feast.","That mini morsel makes a mighty meal!"];
        }
        else{
          statements = ["What's the health QUOTIENT of this meal?","I believe in division of labor: you cook, I eat.","Let's divide a pi for dessert."];
        }
      }
      // Replace result with (ans)
      if(state.result!="error"){
        state.result = calc.toString();
        $("#result").html(state.result);
      }
      // if result is zero, make a comment specific to that
      if(state.result==="0"){
        statements = ["Nothing to eat?","Ever notice how the number zero looks like a warm, crusty pizza?","Zero reminds me of donuts...","Zero reminds me of gyros.","Zero reminds me of hero sandwiches.","Zero looks like a cookie, doesn't it?","Empty plate?","I'd love to take about out of that zero.","A bite of nothing?","Zero looks like an onion ring.","Zero looks likee fried calamari.","Zero looks like a slice of tomato.","Zero looks like a slice of cucumber.","Zero looks like a pepperoni.","I can eat a whole number next time."];
      }
      // if second number is negative (<0), put it in parentheses
      var numSecondString = state.history.numSecond.toString();
      if(parseFloat(state.history.numSecond)<0){
        numSecondString = "(" + numSecondString + ")";
      }
      // Replace history with (1st num) (operator) (2nd num) =
      state.history.text = state.history.numFirst.toString() + " " + symbol + " " + numSecondString + " =";
      $("#history").html(state.history.text);
      // store status of "operatorExists" to true
      state.operatorExists = true;
      // store status of "equalsExists" to true
      state.equalsExists = true;
    }
  }
  // make the appropriate statement to user
  if(!noDisplay){
    displayHelp(randomStatement(statements));
  }
}

// SQUARED =====================================================================
function listenForSquared(state){
  // mouse click
  $("#squared").on('click', function(){
    console.log("Button pressed: SQUARED"); // debug
    squared(state);
  });
}

function squared(state){
  // If result = error, do nothing, give message
  if(state.result==="error"){
    displayHelp("Press the ESC key or AC button to reset this meal.");
  }
  else{
    // If result empty,
    if(state.result===""){
      // do not calculate; give message e.g. "Can't square a multiplication sign!"
      displayHelp("What number are you squaring?");
    }
    // If result !empty,
    else if(state.result!=""){
      // If there is ONLY an operator and no EQUALS in the history
      if(state.operatorExists===true && state.equalsExists===false){
        // do the first operation before squaring
        equals(state,true);
        // show the full calculation in the history
        let symbol = getSymbol(state.history.operator,true);
        let secondNumber = state.history.numSecond;
        if(parseFloat(secondNumber)<0){
          secondNumber = "(" + secondNumber + ")";
        }
        state.history.text = "(" + state.history.numFirst + " " + symbol + " " + secondNumber + ")&sup2; =" ;
        $("#history").html(state.history.text);
        // now square the new result of the first operation
        var calc = Math.pow(parseFloat(state.result),2);
        state.result = reduceErrors(calc).toString();
        $("#result").html(state.result);
        // update internal history for future calculations
        state.history.numFirst = state.result;
        state.history.operator = "squared";
        state.history.numSecond = undefined;
        state.operatorExists = true;
        state.equalsExists = true;
      }
      // but if there is BOTH an operator and EQUALS in the history or just empty
      else if(state.history.text==="" || (state.operatorExists===true && state.equalsExists===true)){
        // update history
        if(parseFloat(state.result)<0){
          state.history.text = "(" + state.result + ")&sup2; =" ;
        }
        else{
          state.history.text = state.result + "&sup2; =" ;
        }
        $("#history").html(state.history.text);
        // square the result; update everything appropriately
        var calc = Math.pow(parseFloat(state.result),2);
        state.result = reduceErrors(calc).toString();
        $("#result").html(state.result);
        state.history.numFirst = state.result;
        state.history.operator = "squared";
        state.history.numSecond = undefined;
        state.operatorExists = true;
        state.equalsExists = true;
      }
      // give a message
      let statements = ["Eat a SQUARE meal every day, I always say.","Here's TO THE POWER OF TWO people eating!","I've got this eating challenge SQUARED away."];
      displayHelp(randomStatement(statements));
    }
  }
}

// Handle rounding errors that arise w/ Javascript multiplication===============
function reduceErrors(number){
  // If semi-small number, decimal present, and lots of zeros, cut the number short
  if(number<1e20){
    var numStr = number.toString();
    var indexDecimal = numStr.indexOf(".");
    if(indexDecimal>0){
      // look for several zeros after the decimal pt
      if(number>100){
        var indexZeros = numStr.indexOf("00000000",indexDecimal);
      }
      else{
        var indexZeros = numStr.indexOf("0000000000",indexDecimal);
      }
      if(indexZeros>0){
        // if scientific notation present, keep it
        var indexE = numStr.indexOf("e",indexDecimal);
        if(indexE>0){
          numStr = numStr.slice(0,indexZeros) + numStr.slice(indexE,numStr.length);
        }
        else{
          numStr = numStr.slice(0,indexZeros);
        }
        number = parseFloat(numStr);
      }
    }
  }
  return number;
}

// RANDOM STATEMENT ============================================================
function randomStatement(statements){  // statements must be an array of strings
  var i = Math.floor(Math.random()*statements.length);
  return statements[i];
}

// Display Help Text ===========================================================
function displayHelp(statement){
  var timeAnimate = 300; // time in ms
  $("#helpText").html(statement);
  $("#help").stop(true).animate({opacity: "0"},0).animate({opacity: "1"},timeAnimate);
  $("header svg path").css({fill: getRandomColor(), transition: "0.2s"});

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// VISUALIZE NUMBERS & OPERATIONS ==============================================
// =============================================================================
function vis(state, stateVis){ // (new state, old state)
  console.log("Running vis() function now...");  // DEBUG
  // This function takes in the state of the calculator and compares it to the
  // old state (global obj). Depending on the changes, animations are performed.
  /* DEFAULT STATE:
    state.operatorExists===false && state.equalsExists===false
    state.history = {"numFirst": undefined, "operator": undefined, "numSecond": undefined, "text": ""};
    $("#history").html(state.history.text);   // clear history
    state.result = "0";  */
  var timeAnimate = 200; // default animation time
  var resultNew = parseFloat(state.result);
  var resultVis = stateVis.result.value;
  var historyVis = stateVis.history.value;
  // CLEAR
  // If current history in the numbers is clear....
  if(state.operatorExists===false && state.equalsExists===false){
    console.log("Running vis() function now; history is clear."); // DEBUG
    // if result is 0, 0., 0.000, "error", etc AND it's new
    if(state.result==="0" || state.result==="error"){
      // if there's not already a zero displayed...
      if(stateVis.result.value!=0 || (stateVis.history.value!=0 && !isNaN(state.history.value)) ){
        // fade all, clear, make opaque again
        $("#visHistory").animate({opacity: "0"},timeAnimate,function(){
          $(this).html("<div class='collection'></div>").animate({opacity: "1"},0);
        });
        stateVis.history.value = undefined;
        stateVis.history.orientation = undefined;
        $("#visResult .collection").addClass("getEatenUpLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(){
          $("#visResult").html("<div class='collection'><div class='circle zero'></div></div>");
        });
        // update vis state
        stateVis.result.value = 0;
        stateVis.result.orientation = "add";
      }
    }
    // DIGITS
    // if result !=0, there's a number to deal with
    else{
      // if current visualized result is 0, clear the display, then display result
      if(resultVis===0 || resultVis===undefined){
        // clear visualized history
        $("#visHistory .collection").animate({opacity: "0"},timeAnimate,function(){
          $(this).remove();
          $("#visHistory").html("<div class='collection'></div>");
        });
        // clear and update visualized result
        $("#visResult .collection").animate({opacity: "0"},timeAnimate,function(){
          $(this).remove();
          $("#visResult").html("<div class='collection'></div>");
          visResult(resultNew,resultVis,timeAnimate);
        });
      }
      else{
        // if current displayed result !=0, just display result
        visResult(resultNew,resultVis,timeAnimate);
      }
      // update visualization state
      stateVis.result.value = resultNew;
    }
  }
  // OPERATIONS
  // If there is a history now... if operator OR equals exists
  else{
    console.log("Running vis() function now; there is a history."); // DEBUG
    // If first number & operator exists, but no equals...
    if(state.operatorExists===true && state.equalsExists===false){
      // and there isn't any number visualized in the history
      if(stateVis.history.value===undefined || stateVis.history.value===""){
        // move units in results to the history
        var temp = $("#visResult .collection").html();
        $("#visResult .collection").stop(true).addClass("sendLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
          $("#visResult").html("<div class='collection'></div>");
          $("#visHistory .collection").html(temp).stop(true).addClass("receiveRight").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
            $("#visHistory .collection").removeClass("receiveRight");
          });
        });
      }
      // and there is nothing visualized in the results now
      else if(stateVis.result.value===undefined || isNaN(stateVis.result.value)){
        console.log("Current visualized result is undefined; will update."); // DEBUG
        // add digits
        visResult(resultNew,0,timeAnimate,historyVis);
      }
      // and there is something in the results now
      else if(stateVis.result.value || stateVis.result.value===0){
        console.log("Current visualized result is defined; will update."); // DEBUG
        // add digits, recognizing that some units are already visualized
        visResult(resultNew,resultVis,timeAnimate,historyVis);
      }
      // display new units in results
      //update visHistory
      stateVis.history.value = parseFloat(state.history.numFirst);
      stateVis.history.orientation = stateVis.result.orientation;
      stateVis.result.value = resultNew;
    }
    // If there is an operator and equals in the history...
      // animate according to operator types
      // add
      // subtract
      // multiply
      // divide
      // square
    //
    // update visualization state
    stateVis.result.value = resultNew;
  }

  // After new state has been analyzed, update the visualization state
  console.log("StateVis (end): ", stateVis); // DEBUG
  console.log("State (end): ", state); // DEBUG

  // This function accepts numbers and displays then w/ animations of length defined in ms
  // It assumes resultVis is the number of units already displayed in the results
  // while resultNew is the new number to show in the results
  function visResult(resultNew, resultVis, timeAnimate, historyVis){
    if(resultNew===undefined){
      resultNew = 0;
    }
    if(resultVis===undefined){
      resultVis = 0;
    }
    // if absolute value of result <=100 && >=0.1 || ===0
    if(Math.abs(resultNew)<=100 && Math.abs(resultNew)>=0.1 || resultNew===0){
      // check if decimals present in result...
      if(resultNew.toString().indexOf(".")>0 || resultVis.toString().indexOf(".")>0){
        console.log("Running visualizeFraction() function from visResult()");
        visualizeFraction(resultNew,resultVis);
      }
      // if no decimals present (just whole numbers)
      else{
        visResultBasic(resultNew,resultVis,timeAnimate);
      }
    }
    // if absolute value of result >100 || <0.1 && !=0 (small or big numbers)
    else {
      //$("#visResult .collection").html("Number too big/small to show"); // DEBUG
      // if new number is bigger, need to change unit of visualization...
      if(Math.abs(resultNew)>100 || Math.abs(resultVis)<0.1){
        // if units are in the same unit type as what's already visualized...
        // but offset by 1 (so 100 has unit 10^2, but should be in 0.1-100 category)
        var unitVis = determineUnit(resultVis);
        var unitNew = determineUnit(resultNew);
        if(unitVis===unitNew){
          // console.log("Same unit type already visualized!"); // DEBUG
          // visualize the result like normal
          visResultComplex(resultNew,resultVis,timeAnimate);
        }
        // if they are NOT in the same unit type (smaller unit type instead)
        else{
          // console.log("New units and old visualized units are different!"); // DEBUG
          // clear results visualization (shrink), then visualize new result
          $("#visResult .collection").animate({opacity: "0"},timeAnimate,function(){
            $("#visResult").html("<div class='collection'></div>");
            visResultComplex(resultNew,resultVis,timeAnimate);
          });
        }
      }
      // if nonzero numbers are not already visualized in the results...
      else if(resultVis<0.1){
        // this should only happen with numbers <1... just visualize
      }
    }
  };

  // Deal w/ fractions
  function visualizeFraction(resultNew,resultVis){
    console.log("Running the visualizeFraction() function now: ", resultNew, resultVis); // DEBUG
    var unit = 1;
    if(Math.abs(resultNew)<1 || Math.abs(resultNew)>100){
      unit = determineUnit(resultNew); // get unit for later
    }
    // set the leftover fractional part of new result aside
    var wholeNum = Math.floor(Math.abs(resultNew));
    var fraction = Math.abs(resultNew)-wholeNum;
    // if fraction is 0, or if fraction is equal to what it was (trailing zeroes), then do nothing
    if(fraction===0 || Math.abs(resultNew)===Math.abs(resultVis)){
      console.log("Assuming number is the same value as before, or no fraction exists.");
      // check for sign change
      if(detectSignChange(resultNew,resultVis)){
        styleUnits(resultNew,unit);
      }
    }
    // if fraction exists, and the new Result is different from what's displayed
    else{
      console.log("Fraction exists that is different from before.");
      // Find string to represent fraction
      var fxString = Math.round((1-fraction)*100).toString();
      var x = "inset(" + fxString + "% 0px 0px 0px)";
      // if fraction is not displayed in results yet...
      if($("#visResult .fraction").length==0){
        $("#visResult .collection").append("<div class='square fraction bloopIn'></div>");
        $("#visResult .fraction").css("clip-path", x);
        styleUnits(resultNew,unit);
        // and change all the shapes to fractional shapes
        $(".collection>div").removeClass("circle").addClass("square");
      }
      // if the fraction already is there...
      else{
        $("#visResult .fraction").css("clip-path", x);
      }
    }
  }

  // Basic function for adding units onto the screen, for 0.1<=|numbers|<=100
  function visResultBasic(resultNew,resultVis,timeAnimate){
    var signChange = detectSignChange(resultNew,resultVis);
    // if the sign is the same, add the appropriate number of units
    if(!signChange){
      for(var i=0; i<(Math.abs(resultNew)-Math.abs(resultVis)); i++){
        $("#visResult .collection").append("<div class='circle bloopIn'>1</div>");
      }
    }
    styleUnits(resultNew);
  }

  // Add units onto screen, for numbers <0.1 or >100
  function visResultComplex(resultNew,resultVis,timeAnimate,unitForced){
    // console.log("Running the visResultComplex() function now...");
    var signChange = detectSignChange(resultNew,resultVis);
    // find what unit to put the new result in, if there were no history
    var unit = determineUnit(resultNew);
    // override the scientific notation unit if specified
    if(unitForced){
      unit = unitForced;
    }
    // if the sign is the same, add the appropriate number of units
    if(!signChange){
      // determine the right unit
      // reduce the number down to a manageable scale to visualize
      // for numbers that are the same (just a decimal pt added), don't revisualize anything
      if(resultNew===resultVis){
          // do nothing...
      }  // otherwise...
      else{
        // for certain cases, units will already be there; just add more units as needed:
        //    for small numbers<1, numbers>100 w/ decimals
        if(Math.abs(resultNew)<1 || resultNew.toString().indexOf(".")>0){
          resultVis = parseFloat((resultVis/unit).toFixed(12)); // converts to number >0,<=100
        }
        else{
          resultVis = 0 // assume the results have to be re-visualized completely for large numbers
        }
        resultNew = parseFloat((resultNew/unit).toFixed(12)); // converts to number >0,<=100
        // console.log(resultNew,resultVis);
        // display the "whole/round number" units
        for(var i=0; i<(Math.floor(Math.abs(resultNew))-Math.floor(Math.abs(resultVis))); i++){
          $("#visResult .collection").append("<div class='circle bloopIn'>"+unit+"</div>");
        }
      }
      // Then visualize the "fractional" part last
      console.log("Running visualizeFraction() function from visResultComplex()");
      visualizeFraction(resultNew,resultVis);
    }
    // console.log("visResultComplex(): ", resultNew,resultVis,unit); // DEBUG
    styleUnits(resultNew,unit);
  }

  // determine the right unit
  function determineUnit(resultNew){
    var unit = 1; //default
    // Determine scalemin,max (e.g. 10^2-10^3 units of 10^1, 10^5-10^6 units 10^4...)
    //  (e.g. 134 goes to 13 10s; If range is 10e2-10e3, do units of 10e1)
    var sci = resultNew.toExponential().toString(); // scientific notation string
    var indexE = sci.indexOf("e");
    var exp = (sci.charAt(indexE+1)==="+") ? sci.slice(indexE+2,sci.length+1) : -sci.slice(indexE+2,sci.length+1);
    var unit = Math.pow(10,exp-1);
    // console.log("Sci, indexE, unit: ",sci, indexE, unit); // DEBUG
    return unit;
  }

  // Given the old visualized result and the new result, output if sign has changed
  function detectSignChange(resultNew,resultVis){
    signChange = false;
    // if the SIGN of the number has changed, pulse the units
    if((resultVis<0 && resultNew>0) || (resultVis>0 && resultNew<0)){
      signChange = true;
      let temp = $("#visResult .collection").html();
      // clear it, then add it again
      $("#visResult .collection").html(temp);
      $("#visResult .collection>div").addClass("shake");
    }
    return signChange;
  }

  // Change the color to signify the appropriate sign; give appropriate look
  function styleUnits(resultNew,unit){
    var borderType = "none"; // default border
    var borderColor = "red"; // default color
    var unitLabel = "1"; // default
    if(unit===undefined){unitLabel = "1";} // default if undefined
    else if(unit>1){
      borderType = "outset";
      if(unit===10){unitLabel = "10";}
      else if(unit===100){unitLabel = "100";}
      else if(unit===1000){unitLabel = "1k";}
      else if(unit===10000){unitLabel = "10k";}
      else if(unit===100000){unitLabel = "100k";}
      else if(unit===1000000){unitLabel = "1M";}
      else if(unit===10000000){unitLabel = "10M";}
      else if(unit===100000000){unitLabel = "100M";}
      else if(unit===1000000000){unitLabel = "1B";}
      else if(unit===10000000000){unitLabel = "10B";}
      else if(unit===100000000000){unitLabel = "100B";}
      else if(unit===1000000000000){unitLabel = "1Tr";}
      else{unitLabel = unit.toExponential().toString();}
    }
    else if(unit<1){
      borderType = "inset";
      if(unit===0.1){unitLabel = "0.1";}
      else if(unit===0.01){unitLabel = "0.01";}
      else{unitLabel = unit.toExponential().toString();}
    }
    else{unit = unit.toExponential();} // not needed - just in case
    // if positive
    if(resultNew>0){
      $("#visResult .collection>div").removeClass("negative zero").addClass("positive");
      $("#visResult .collection>div:not(.fraction)").html(unitLabel);
    }
    // if negative
    else if(resultNew<0){
      $("#visResult .collection>div").removeClass("positive zero").addClass("negative");
      $("#visResult .collection>div:not(.fraction)").html("-"+unitLabel);
    }
    // if zero
    else if(resultNew===0){
      $("#visResult .collection>div").removeClass("positive negative").addClass("zero");
    }
    // set border thickness for small & large numbers
    if(unit!=1){
      borderColor = (resultNew>0) ? "#e50000" : "#1C2833";
      var borderThickness = parseInt(0.5*Math.abs(Math.log(unit)/Math.log(10)));
      if(borderThickness>9){ // set max thickness
        borderThickness = 9;
      }
      borderThickness = borderThickness.toString() + "px";
      var borderString = borderType + " " + borderThickness + " " + borderColor;
      // console.log(borderString); // DEBUG
      $("#visResult .collection>div").css("border",borderString);
    }

  }

}
