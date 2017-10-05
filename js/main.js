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
  var oldState = state; // To be used for visualize [vis()] function

  // Read in button presses (types: clear, square/operator, number, dec, sign, equals)
  listenToKeyboard(state,oldState); // listen for all keys
  // Listen for signal: CLEAR
  listenForClear(state,oldState);
  // Listen for signal: number 0-9
  listenForNumber(state,oldState);
  // Listen for signal: DECIMAL
  listenForDecimal(state,oldState);
  // Listen for signal: operator +-*/
  listenForOperator(state,oldState);
  // Listen for signal: SIGN
  listenForSign(state,oldState);
  // Listen for signal: EQUALS
  listenForEquals(state,oldState);
  // Listen for signal: SQUARED
  listenForSquared(state,oldState);
});

// note: key codes reference: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// TO DO: Add visualizations.. (in progress 10/5/17)
// TO DO: will need to visually denote button presses somehow when keyboard is used
// TO DO: Remove debug comments/code

// KEYBOARD ====================================================================
function listenToKeyboard(state,oldState){
  $(document).on('keyup', function(event){
    // ESC key
    var operator;
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===27){
      console.log("Key pressed (ESC): CLEAR"); // debug
      clear(state,oldState,true);
    }
    // DIGITS
    else if (charCode>=48 && charCode<=57 && event.shiftKey===false){
      var digit = (charCode-48).toString();
      console.log("Keyboard pressed (digit): " + digit); // debug
      numberPressed(digit,state);
      digit = NaN;
    } else if(charCode>=96 && charCode<=105){ // numpad
      var digit = (charCode-96).toString();
      console.log("Keyboard pressed (digit, numpad): " + digit); // debug
      numberPressed(digit,state);
      digit = NaN;
    }
    // DECIMAL
    else if ((charCode===190 && event.shiftKey===false) || charCode===110){
      console.log("Key pressed (.): DECIMAL POINT"); // debug
      if(state.result!="error"){
        decimalPoint(state);
      }
    }
    // SIGN
    else if (charCode===192 && event.shiftKey===true){
      console.log("Key pressed (~): SIGN"); // debug
      sign(state);
    }
    // SQUARED (^)
    else if (charCode===54 && event.shiftKey===true){
      console.log("Key pressed (^): SQUARED"); // debug
      squared(state);
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
      operatorPressed(operator,state);
      operator = NaN; // clear var so as not to trigger anything later
    }
  });
}

// CLEAR =======================================================================
function listenForClear(state,oldState){
  // mouse click
  $("#clear").on('click', function(){
    console.log("Button pressed: CLEAR"); // debug
    clear(state,oldState,true);
  });
}

function clear(state,oldState,clearVis){
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
    vis(state, oldState);
  }
}

// NUMBER ======================================================================
function listenForNumber(state,oldState){
  // mouse click
  $(".digit").on('click', function(){
    var digit = this.value.toString();
    console.log("Button pressed (digit): " + digit); // debug
    numberPressed(digit,state,oldState);
    digit = NaN;
  });
}

function numberPressed(digit,state,oldState){
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
      clear(state,oldState);
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
  vis(state,oldState);
};

// DECIMAL =====================================================================
function listenForDecimal(state){
  // mouse click
  $("#decimal").on('click', function(){
    console.log("Button pressed: DECIMAL POINT"); // debug
    if(state.result!="error"){
      decimalPoint(state);
    }
  });
}

function decimalPoint(state){
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
    clear(state,oldState,true);
    // replace result with (0.)
    state.result = "0.";
    $("#result").html(state.result);
    // update help text
    displayHelp("Making a small number, eh?");
  }
}

// operators: +-*/==============================================================
function listenForOperator(state){
  var operator;
  // mouse click
  $(".operator").on('click', function(){
    operator = this.value;
    console.log("Button pressed (operator): " + operator); // debug
    operatorPressed(operator,state);
    operator = NaN; // clear var so as not to trigger anything later
  });
}

function operatorPressed(operator,state){
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
function listenForSign(state){
  // mouse click
  $("#sign").on('click', function(){
    console.log("Button pressed: SIGN"); // debug
    sign(state);
  });
}

function sign(state){
  var statements;
  // if (resultNum) is != (0) or (0.)
  if(state.result!="0" && state.result!="0."){
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
  else if(state.result===""){
    statements=["You need to give a number, before you can change its sign.","Please give me a number before changing its sign."];
  }
  // if (resultNum) is (0) or (0.) or empty, do nothing
  else{
    statements=["Zero food? Zero has no SIGN.","Negative zero is... zero!","You know, +0 and -0 are all tasty zeros to me."];
  }
  // display appropriate help message
  displayHelp(randomStatement(statements));
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
  $("#help").animate({opacity: "0"},0).animate({opacity: "1"},timeAnimate);
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
function vis(state, oldState){ // (new state, old state)
  // This function takes in the state of the calculator and compares it to the
  // old state (global obj). Depending on the changes, animations are performed.
  /* DEFAULT STATE:
    state.operatorExists===false && state.equalsExists===false
    state.history = {"numFirst": undefined, "operator": undefined, "numSecond": undefined, "text": ""};
    $("#history").html(state.history.text);   // clear history
    state.result = "0";  */
  var timeAnimate = 200; // default animation time

  // CLEAR
  // If current history is clear....
  if(state.operatorExists===false && state.equalsExists===false){
    // if result is 0, 0., 0.000, "error", etc
    if(state.result==0){
      // fade all, clear, make opaque again
      $("#visHistory").animate({opacity: "0"},timeAnimate,function(){
        $(this).html("<div class='collection'></div>");
      }).animate({opacity: "1"},0);
      $("#visResult").animate({opacity: "0"},timeAnimate,function(){
        // show a zero
        $(this).html("<div class='collection'><div class='circle zero'></div></div>").animate({opacity: "0"},0).animate({opacity: "1"},timeAnimate);
      });
    }
    // if result !=0, there's a number to deal with
    else{
      // DIGITS
      var resultNew = parseFloat(state.result);
      var resultOld = parseFloat(oldState.result);
      // if absolute value of result <100
      if(Math.abs(resultNew)<100){
        displayAsUnits(resultNew,resultOld,timeAnimate);
      }
      // if absolute value of result >100
      else {
        // TBD: Use a "water tank" analogy?
      }
    }
  }
  // OPERATIONS
  // If there is a history now...
  else{
    // If first number & operator exists, but no equals...
      // and there wasn't an equals before
        // move units in results to the history
        // check sizes of current number in history and in result;
          // set new size based on that
        // display new units in results
      // and there is nothing in the results now
        // and there is a DIFFERENT operator than before (replacement operator chosen)
          // rearrange units in history for appropriate math operation
      // and there is something in the results now
    // If there is an operator and equals in the history...
      //
    //
  }

  // After new state has been analyzed, save it as the old one for later
  oldState = state;
  console.log(oldState); // DEBUG

  // This function accepts numbers and displays then w/ animations of length defined in ms
  function displayAsUnits(resultNew, resultOld, timeAnimate){
    $("#visResult .collection").html("<div class='circle'></div>");
    // if positive
    if(resultNew>0){
      $(".circle").addClass("positive");
    }
    // if negative

    // if there's a decimal point....

  };
}
