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
    "result": {"value": 0, "orientation": "add"},
    "equalPressed": 0 // boolean denoting if a equals was the last button pressed
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
    // Stop any related animations
    $(".collection").finish();
    $(".collection>div").finish();
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
    // Stop any related animations, during fast multiple clicks
    $(".collection").finish();
    $(".collection>div").finish();
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
  console.log("After decimal added... State.result: ", state.result); // DEBUG
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
        var repeatOperator = true;
      }
      // ...and if the number on result exists/not empty...
      else if(state.result!=""){
        // Assume (1st num) = the one in the history already
        // Assume (2nd num) = number on result
        state.history.numSecond = state.result;
        // Calculate (1st num) (operator) (2nd num); store as (ans)
        equals(state,stateVis,1); // calculate before updating operator
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
  // if there is an error in history (dividing by zero, etc), clear everything and put an error in result
  if(state.history.numFirst==="error"){
    clear(state,stateVis,true);
  }
  // visualize if this is the 1st time an operator is pressed only
  if(!repeatOperator){
    vis(state,stateVis);
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
function listenForEquals(state,stateVis){
  // keyboard: = keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===187 && event.shiftKey===false){
      console.log("Key pressed (=): EQUALS"); // debug
      equals(state,stateVis);
    }
  });
  // mouse click
  $("#equals").on('click', function(){
    console.log("Button pressed: EQUALS"); // debug
    equals(state,stateVis);
  });
}

function equals(state,stateVis,noDisplay){
  // initialize
  var statements;
  // If (operatorExists) is false && (equalsExists) is false
  // OR if (equalsExists) in history already
  if(state.equalsExists===true || (state.operatorExists===false && state.equalsExists===false)){
    // do nothing; or just do some silly animation? "Are you calculating something?"
    statements = ["That equals itself, doesn't it?","What is the calculation?","Equals, equals, equals...","Yep, same number.","Still the same!","Hey, 2 = 2, too!","Did you know that 1 = 1?","Let's speed up these calculations.","I believe in equality!"];
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
         calc = reduceErrors(calc); // deal with rounding error
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
    vis(state,stateVis);
  }
}

// SQUARED =====================================================================
function listenForSquared(state,stateVis){
  // mouse click
  $("#squared").on('click', function(){
    console.log("Button pressed: SQUARED"); // debug
    squared(state,stateVis);
  });
}

function squared(state,stateVis){
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
        equals(state,stateVis,true);
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
      // visualize the result
      vis(state,stateVis);
    }
  }
}

// Handle rounding errors that arise w/ Javascript multiplication===============
function reduceErrors(number){
  // If semi-small number, decimal present, and lots of zeros, cut the number short
  if(Math.abs(number)<1e20){
    var numStr = number.toString();
    var indexDecimal = numStr.indexOf(".");
    if(indexDecimal>0){
      // look for several zeros after the decimal pt
      if(Math.abs(number)>100){
        var indexZeros = numStr.indexOf("00000000",indexDecimal);
      }
      else{
        var indexZeros = numStr.indexOf("0000000000",indexDecimal);
      }
      if(indexZeros>0){
        console.log("Found lots of 0's; cutting it out..."); // DEBUG
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
      else{ // If no zero-strings found
        // look for several nines after decimal pt
        if(Math.abs(number)<1000000){
          var indexNines = numStr.indexOf("9999999999999",indexDecimal);
          if(indexNines>0){
            console.log("Found lots of 9's; cutting it out..."); // DEBUG
            numStr = numStr.slice(0,indexNines); // cut off nines
            // what's the last character before the nines?
            // if last character is a decimal, round the number up
            if(numStr.charAt(numStr.length-1)==="."){
              number = Math.round(number);
            }
            else{ // if last character is a digit
              let digit = parseInt(numStr.charAt(numStr.length-1));
              // if last character is a digit<9, add 1 to the trailing digit
              if(digit<9){
                numStr = numStr.slice(0,indexNines-1) + (digit+1).toString();
                number = parseFloat(numStr);
              }
            }
          }
        }
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
// One giant function with lots of internal subfunctions/methods
function vis(state, stateVis){ // (new state, old state)
  // Complete any animations in history/results
  $(".collection").finish().finish();
  $(".collection>div").finish().finish();
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
  // If current history in the numbers is clear, or there's an error....
  if((state.operatorExists===false && state.equalsExists===false) || state.result==="error"){
    console.log("Running vis() function now; history is clear."); // DEBUG
    // if result is 0, 0., 0.000, "error", etc AND it's new
    if(state.result==="0" || state.result==="error"){
      // if there's not already a zero displayed...
      if(stateVis.result.value!=0 || (stateVis.history.value!=0 && !isNaN(state.history.value)) || (stateVis.result.value===0 && !isNaN(stateVis.history.value) ) ){
        // fade all, clear, make opaque again
        $("#visHistory .collection").animate({opacity: "0"},timeAnimate,function(){
          $("#visHistory").html("<div class='collection'></div>");
        });
        stateVis.history.value = undefined;
        stateVis.history.orientation = undefined;
        $("#visResult .collection div").stop(true);
        $("#visResult .collection").addClass("getEatenUpLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(){
          $("#visResult").html("<div class='collection'><div class='circle zero'></div></div>");
          console.log("Cleared!");
        });
        // update vis state
        stateVis.result.value = 0;
        stateVis.result.orientation = "add";
        stateVis.equalPressed = 0;
      }
    }
    // DIGITS
    // if result !=0, there's a number to deal with
    else{
      // if there was no equals sign pressed in the last calculation, it's a new number
      if(stateVis.equalPressed===0){
        console.log("Assuming equals sign NOT pressed. resultVis:", resultVis); // DEBUG
        // if current visualized result is 0, clear the display, then display result
        if(resultVis===0 || resultVis===undefined){
          // clear visualized history
          $("#visHistory .collection").animate({opacity: "0"},timeAnimate,function(){
            $(this).remove();
            $("#visHistory").html("<div class='collection'></div>");
            // update visualization state
            stateVis.history.value = undefined;
            stateVis.history.orientation = undefined;
          });
          // clear and update visualized result
          $("#visResult .collection").animate({opacity: "0"},timeAnimate,function(){
            $(this).remove();
            $("#visResult").html("<div class='collection'></div>");
            visResult(resultNew,resultVis,timeAnimate);
            // update visualization state
            stateVis.result.value = resultNew;
          });
        }
        else{
          // if current displayed result !=0, just display result
          visResult(resultNew,resultVis,timeAnimate);
          // update visualization state
          stateVis.result.value = resultNew;
        }
      }
      // if there was an equals sign pressed in the previous calculation, reset everything
      else if(stateVis.equalPressed===1){
        console.log("Assuming equals sign pressed. resultNew:", resultNew); // DEBUG
        // if it's a sign change after the equals, then show it
        if(detectSignChange(resultNew,resultVis)){
          visResult(resultNew,resultVis,timeAnimate);
          // update visualization state
          stateVis.result.value = resultNew;
          stateVis.equalPressed = 0;
        }
        // otherwise if it's a new number:
        else{
          // eat numbers in result
          $("#visResult .collection").addClass("getEatenUpLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(){
            $("#visResult").html("<div class='collection'></div>");
            // update visualization stateVis
            stateVis.result.value = 0;
            // display new numbers assuming results have been cleared
            visResult(resultNew,0,timeAnimate);
            // update visualization state
            stateVis.result.value = resultNew;
            stateVis.equalPressed = 0;
          });
        }
        // reset history
        $("#visHistory").animate({opacity: "0"},timeAnimate,function(){
          $(this).html("<div class='collection'></div>").animate({opacity: "1"},0);
          // update visualization state
          stateVis.history.value = undefined;
          stateVis.history.orientation = undefined;
        });
      }
    }
  }
  // OPERATIONS
  // If there is a history now... if operator OR equals exists
  else{
    console.log("Running vis() function now; there is a history."); // DEBUG
    console.log("visualized history value, operatorExists, equalsExists ",stateVis.history.value, state.operatorExists, state.equalsExists); // DEBUG
    // If first number & operator exists, but no equals...
    if(state.operatorExists===true && state.equalsExists===false){
      // and there isn't any number visualized in the history
      console.log("visualized history value ",stateVis.history.value); // DEBUG
      if(stateVis.history.value===undefined || stateVis.history.value===""){
        // move units in results to the history
        var temp = $("#visResult .collection").html();
        $("#visResult .collection").stop(true).addClass("sendLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
          $("#visResult").html("<div class='collection'></div>");
          $("#visHistory .collection").html(temp).stop(true).addClass("receiveRight").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
            $("#visHistory .collection").removeClass("receiveRight");
            // if necessary, redraw the new history into basic units
            // if units displayed are different from what they should be, OR if it's just a fraction displayed...
            let unitVisHistory = 1;
            let historyVisTarget = parseFloat(state.history.numFirst);
            if( Math.abs(historyVisTarget)<0.1 || Math.abs(historyVisTarget)>100){
              unitVisHistory = determineUnit(parseFloat(state.history.numFirst));
            }
            if( ($("#visHistory .collection div:first-child").html()!=unitVisHistory) ||
              ($("#visHistory .collection div").length===1&&$("#visHistory .collection .fraction").length===1) ){
              console.log("Redisplaying the history...", stateVis.history.value); // DEBUG
              // clear result & redisplay it
              revisualizeHistory(historyVisTarget,unitVisHistory,timeAnimate);
            }
          });
        });
      }
      // otherwise if there is a number visualized in the history already...
      else if(!isNaN(historyVis)){
        console.log("History visualization has something: ",historyVis, parseFloat(state.history.numFirst)); // DEBUG
        // and the visualized history is the right number (1st time pressing operator)
        if(historyVis===parseFloat(state.history.numFirst)){
          // console.log("visualized history is :",historyVis); // DEBUG
          var unitHistory = 1, unitNew = 1;
          // ...and the units of the results and history are the same...
          if(Math.abs(historyVis)>100||Math.abs(historyVis)<.1){
            unitHistory = determineUnit(historyVis);
          }
          if(Math.abs(resultNew)>100||Math.abs(resultNew)<.1){
            unitNew = determineUnit(resultNew);
            // In special case of just "0.", keep the same unit as in the history
            if(resultNew==0){
              unitNew = unitHistory;
            }
          }
          console.log("Units for history, new: ", unitHistory,unitNew); // DEBUG
          if(unitHistory===unitNew){
            // and there is nothing visualized in the results now
            if(stateVis.result.value===undefined || isNaN(stateVis.result.value)){
              console.log("Current visualized result is undefined; will update."); // DEBUG
              // add digits
              visResult(resultNew,0,timeAnimate);
              // if history has fractions, though, then make it look like fractions
              if(state.history.numFirst.toString().indexOf(".")>0 || state.history.numFirst.toString().indexOf(".")>0){
                $("#visResult .collection>div").removeClass("circle").addClass("square");
              }
            }
            // and there is something in the results now
            else if(stateVis.result.value || stateVis.result.value===0){
              console.log("Current visualized result is defined; will update."); // DEBUG
              if(isNaN(resultNew)){ resultNew = 0; } // Fixing errors if newResult is NaN
              // add digits, recognizing that some units are already visualized
              visResult(resultNew,resultVis,timeAnimate);
              // if history has fractions, though, then make it look like fractions
              if(state.history.numFirst.toString().indexOf(".")>0 || state.history.numFirst.toString().indexOf(".")>0){
                $("#visResult .collection>div").removeClass("circle").addClass("square");
              }
            }
          }
          // ...but if the units of the results and history are NOT same...
          else{
            // and there is nothing visualized in the results now
            if(stateVis.result.value===undefined || isNaN(stateVis.result.value)){
              console.log("Current visualized result is undefined; will update. History & result units different"); // DEBUG
              // add digits
              visHistoryAndResult(resultNew,0,timeAnimate,historyVis,unitHistory,unitNew);
            }
            // and there is something in the results now
            else if(stateVis.result.value || stateVis.result.value===0){
              console.log("Current visualized result is defined; will update. History & result units different"); // DEBUG
              // add digits, recognizing that some units are already visualized
              visHistoryAndResult(resultNew,resultVis,timeAnimate,historyVis,unitHistory,unitNew);
            }
          }
        }
        // otherwise the history is NOT the right number (i.e. digit-operator-digit-operator)
        else{
          console.log("Seems like an operator was pressed before pressing equals..."); // DEBUG
          // Clear both history and result visualizations
          let unitVisHistory = 1;
          let historyVisTarget = parseFloat(state.history.numFirst);
          if( Math.abs(historyVisTarget)<0.1 || Math.abs(historyVisTarget)>100){
            unitVisHistory = determineUnit(parseFloat(state.history.numFirst));
          }
          revisualizeHistory(historyVisTarget,unitVisHistory,timeAnimate);
          stateVis.history.value = historyVisTarget;
          stateVis.history.orientation = "add";
          $("#visResult .collection").animate({opacity: "0"},timeAnimate,function(){
            $("#visResult").html("<div class='collection'></div>");
          });
          // update vis state
          stateVis.result.value = 0;
          stateVis.result.orientation = "add";
          // Display the new history (or the result of the last operation) without any special animations
        }
      }
      // display new units in results
      //update visHistory
      stateVis.history.value = parseFloat(state.history.numFirst);
      stateVis.history.orientation = stateVis.result.orientation;
      stateVis.result.value = resultNew;
      stateVis.equalPressed = 0;
    }
    // If there is an operator and equals in the history...
    else if(state.operatorExists===true && state.equalsExists===true){
      // only run these if the visualizations don't match what they should be; avoids extra processing
      console.log(parseFloat(state.result),stateVis.result.value); // DEBUG
      if( stateVis.history.value!=undefined ){
        // special animations according to operator types
        if(state.history.operator==="add"){
          visAdd(state,stateVis);
          stateVis.result.orientation = "add";
        }
        else if(state.history.operator==="subtract"){
          visSubtract(state,stateVis);
          stateVis.result.orientation = "add";
        }
        else if(state.history.operator==="multiply"){
          visMultiply(state,stateVis);
          stateVis.result.orientation = "multiply";
        }
        else if(state.history.operator==="divide"){
          visDivide(state,stateVis);
          stateVis.result.orientation = "divide";
        }
      }
      else if( state.history.operator==="squared" && (parseFloat(state.result)!=stateVis.result.value) ){
        visSquare(state,stateVis);
        stateVis.result.orientation = "squared";
      }
      // update visualization state
      stateVis.equalPressed = 1;
    }
    // update visualization state
    stateVis.result.value = resultNew;
  }

  // After new state has been analyzed, update the visualization state
  console.log("StateVis (end): ", stateVis); // DEBUG
  console.log("State (end): ", state); // DEBUG

  // Visualize the squaring of a number
  function visSquare(state,stateVis){
    console.log(determineUnit(resultNew));
    $(".collection div").remove(); // DEBUG placeholder code TBD!
    let unit = (Math.abs(resultNew)>0.1&&Math.abs(resultNew)<100) ? 1 : determineUnit(resultNew);
    revisualizeResult(resultNew,unit,timeAnimate);
    stateVis.history.value = undefined;
  }

  // Visualize the division of two numbers
  function visDivide(state,stateVis){
    $(".collection div").remove(); // DEBUG placeholder code TBD!
    let unit = (Math.abs(resultNew)>0.1&&Math.abs(resultNew)<100) ? 1 : determineUnit(resultNew);
    revisualizeResult(resultNew,unit,timeAnimate);
    stateVis.history.value = undefined;
  }

  // Visualize the multiplication of two numbers
  function visMultiply(state,stateVis){
    var numFirst = parseFloat(state.history.numFirst);
    var numSecond = parseFloat(state.history.numSecond);
    // if both multipliers have abs value <=10 and whole numbers
    if( (Math.abs(numFirst)<=10 && Math.abs(numSecond)<=10) && (Math.abs(numFirst)>0 && Math.abs(numSecond)>0)  && (Number.isInteger(numFirst)&&Number.isInteger(numSecond)) ){
      console.log("Special multiplication case will be animated!"); // DEBUG
      // Arrange history units into a column
      $("#visHistory .collection").animate({width: "9.5%"},700,function(){
        $("#visHistory .collection>div").animate({width: "80%", margin:"9.5%"},timeAnimate,function(){
          stateVis.history.orientation = "multiply";
        });
      });
      // make the history and results "ghost" or start to fade out (after a delay)
      $("#visResult .collection").animate({color: "white"},1000,function(){
        $(".collection>div").addClass("ghost");
      });
      // make results visualization the same height as history visualization
      $("#visResult .collection").animate({color: "white"},1000,function(){
        let hheight = $("#visHistory").css("height");
        $("#visResult .collection").css("height",hheight);
        // Move ghost results and history into position
        $("#visResult").addClass("multiplyAnimate");
        $("#visResult .collection").addClass("sendUpSmall").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
          $("#visResult .collection").removeClass("sendUpSmall").addClass("multiplyRow receiveDownSmall");
        });
        // Create new result section, sized appropriately
        // Populate result section
        // Remove extra elements
        // reshape results to standard "addition" orientation
      });
    }
    // default animation: do a simple revisualization
    else{
      $(".collection div").remove(); // DEBUG placeholder code TBD!
      let unit = (Math.abs(resultNew)>0.1&&Math.abs(resultNew)<100) ? 1 : determineUnit(resultNew);
      revisualizeResult(resultNew,unit,timeAnimate);
      stateVis.history.value = undefined;
      stateVis.result.orientation = "add";
    }
  }

  // Visualize the subtraction of two numbers
  // Method A: Treat it like addition of the appropriate +/- numbers
  function visSubtract(state,stateVis){
    // determine animation time (more units animate faster)
    let timeAnimate = 10; // default times for unit to animate in ms
    // if history = 0, 0.0, 0.00 etc
    if(state.history.numFirst==0){
      // flip sign appearance of result
      let unitVis = 1;
      let target = parseFloat(state.result);
      if( Math.abs(target)<0.1 || Math.abs(target)>100){
        unitVis = determineUnit(target);
      }
      detectSignChange(parseFloat(state.history.numSecond),target);
      styleUnits(target,unitVis);
      // clear history
      $("#visHistory").animate({opacity: "0"},timeAnimate,function(){
        $(this).html("<div class='collection'></div>").animate({opacity: "1"},0);
      });
      stateVis.result.value = target;
      stateVis.history.value = undefined;
      stateVis.history.orientation = undefined;
    }
    // if history firstNum != 0, secondNum = 0
    else if(state.history.numFirst!=0 && state.history.numSecond==0){
      // move history to result (send to right), refresh history
      var temp = $("#visHistory .collection").html();
      $("#visHistory .collection").stop(true).addClass("sendRight").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
        $("#visHistory").html("<div class='collection'></div>");
        $("#visResult .collection").html(temp).stop(true).addClass("receiveLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
          $("#visResult .collection").removeClass("receiveLeft");
        });
      });
      stateVis.history.value = undefined;
      stateVis.history.orientation = undefined;
    }
    // else if history!=0 && result!=0
    else{
      // flip sign appearance of result
      styleUnitsFlip();
      // get the values to operate on
      let compareHistory = stateVis.history.value;
      let compareResult = -stateVis.result.value;
      // delay for a bit (using jquery) (state values will update before this), then subtract
      $("#visResult .collection").animate({color: "white"},500,function(){
        // console.log(compareHistory,compareResult); // DEBUG
        // if history numbers now have the same signs...
        if( (compareHistory>0&&compareResult>0) || (compareHistory<0&&compareResult<0) ){
          console.log("Subtraction: Like adding numbers with the same sign."); //debug
          // add units together using addition function
          visAddSameSign(state,stateVis,timeAnimate);
        }
        // if history numbers now have opposite signs... (subtract animation)
        else if( (compareHistory>0&&compareResult<0) || (compareHistory<0&&compareResult>0) ){
          console.log("Subtraction: Like adding numbers with opposite signs."); //debug
          // add units together using addition function
          visAddOppSign(state,stateVis,timeAnimate);
        }
        // update visualization state
        stateVis.history.value = undefined;
        stateVis.history.orientation = "add";
      });
    }
  }

  // Visualize the addition of two numbers
  function visAdd(state,stateVis){
    // determine animation time (more units animate faster)
    let timeAnimate = 10; // default times for unit to animate in ms
    // if history = 0, 0.0, 0.00 etc
    if(state.history.numFirst==0){
      // keep result the same, refresh history
      $("#visHistory").animate({opacity: "0"},timeAnimate,function(){
        $(this).html("<div class='collection'></div>").animate({opacity: "1"},0);
      });
      stateVis.history.value = undefined;
      stateVis.history.orientation = undefined;
    }
    // if history firstNum != 0, secondNum = 0
    else if(state.history.numFirst!=0 && state.history.numSecond==0){
      // move history to result (send to right), refresh history
      var temp = $("#visHistory .collection").html();
      $("#visHistory .collection").stop(true).addClass("sendRight").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
        $("#visHistory").html("<div class='collection'></div>");
        $("#visResult .collection").html(temp).stop(true).addClass("receiveLeft").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
          $("#visResult .collection").removeClass("receiveLeft");
        });
      });
      stateVis.history.value = undefined;
      stateVis.history.orientation = undefined;
    }
    // otherwise if numbers are !=0
    else{
      console.log("Time to animate: ", timeAnimate); // DEBUG
      if( (stateVis.history.value>0 && stateVis.result.value>0)||(stateVis.history.value<0 && stateVis.result.value<0) ){
        // same sign (function)
        visAddSameSign(state,stateVis,timeAnimate);
        // update visualization state
        stateVis.history.value = undefined;
      }
      else if( (stateVis.history.value>0 && stateVis.result.value<0)||(stateVis.history.value<0 && stateVis.result.value>0) ){
        // opposite sign (function)
        visAddOppSign(state,stateVis,timeAnimate);
        // update visualization state
        stateVis.history.value = undefined;
      }
    }
  }

  // Visualize the addition of non-zero numbers with the same sign
  function visAddSameSign(state,stateVis,timeAnimate){
    console.log("Adding same sign!"); // DEBUG
    // handle whole units one at a time - slide history right, prepend to result
    if($('#visHistory .collection div:first-child').hasClass("fraction")===false){ // if not a fraction unit...
      $('#visHistory .collection div:first-child').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
        // console.log("Sending history to result...");
        $("#visHistory .collection div:first-child").prependTo("#visResult .collection");
        $("#visResult .collection div:first-child").css("left","-100%").stop(true).animate({opacity: "1", left: "0"},100,function(){
          // check remaining divs
          // console.log("test length: ", $('#visHistory .collection div').length); // DEBUG
          if($('#visHistory .collection div').length>0){
            visAddSameSign(state,stateVis,timeAnimate);
          }
        });
      });
    }
    // if decimal/fraction present in history...
    else if($('#visHistory .collection div:first-child').hasClass("fraction")===true){
      console.log("Moving the fractional part over!"); // DEBUG
      // if there is NO fraction in the result, just move the fraction over
      if($("#visResult .collection .fraction").length===0){
        $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
          $("#visHistory .collection .fraction").appendTo("#visResult .collection");
          $("#visResult .collection .fraction").css("left","-100%").stop(true).animate({opacity: "1", left: "0"},timeAnimate)
        })
      }
      // if there is a fraction in the result, then take that into account
      else{
        // get the clip-path 1st value of the fractional parts in history (in %clipped)
        var fractionHistory = $("#visHistory .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
        var fractionResult = $("#visResult .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
        // transform clip-path values to %full (1-%clippath), sum the %full values
        fractionHistory = 100 - fractionHistory;
        fractionResult = 100 - fractionResult;
        var fractionNew = fractionHistory + fractionResult; // Says how much 1 unit should be %full
        console.log("Fraction history, fraction result: ", fractionHistory, fractionResult); // DEBUG
        // remove fractional parts from history
        $("#visHistory .collection .fraction").stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
          $("#visHistory .collection .fraction").remove();
          // if sum >= 1
          if(fractionNew >= 100){
            // add single unit of same type in visualized result
            if(stateVis.result.value>0){
              $("#visResult .collection").prepend("<div class='square positive bloopIn'>1</div>");
            }
            else if(stateVis.result.value<0){
              $("#visResult .collection").prepend("<div class='square negative bloopIn'>1</div>");
            }
            // fractional remainder = sum - 1
            fractionNew-=100;
            console.log("New fraction value after subtracting whole number: ", fractionNew); // DEBUG
            // change fractional remainder to result visualization, if appropriate
            if(fractionNew>0){
              let fxString = 100-fractionNew;
              let x = "inset(" + fxString + "% 0px 0px 0px)";
              $("#visResult .fraction").css("clip-path", x);
            }
          }
          // if sum <1
          else{
            // change existing fraction
            if(fractionNew>0){
              let fxString = 100-fractionNew;
              let x = "inset(" + fxString + "% 0px 0px 0px)";
              $("#visResult .fraction").css("clip-path", x);
            }
          }
        });
      }
    }
  }

  // Visualize the addition of non-zero numbers with the opposite sign
  function visAddOppSign(state,stateVis,timeAnimate){
    console.log("Adding opposite sign!"); // DEBUG
    timeAnimate=100; // This fixes the timing to better match additino animations
    // if history has any units visualized still...
    if($("#visHistory .collection div").length>0){
      // if result has whole units visualized still...
      if($("#visResult .collection div").length - $("#visResult .collection .fraction").length>0){
        // handle whole units one at a time - slide history right, remove from result
        if($('#visHistory .collection div:first-child').hasClass("fraction")===false){ // if not a fraction unit...
          $('#visHistory .collection div:first-child').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
            // console.log("Sending history to result..."); // DEBUG
            $("#visHistory .collection div:first-child").remove();
            $("#visResult .collection div:first-child").remove();
            if($('#visHistory .collection div').length>0){
              visAddOppSign(state,stateVis,timeAnimate);
            }
          });
        }
        // if the last unit in the history is a fraction...
        else if($("#visHistory .collection .fraction").length>0){
          console.log("Down to the last fraction in the history...");  // DEBUG
          // if result has a fraction, in addition to a whole unit...
          if($("#visResult .collection .fraction").length>0){
            // get fraction clip sizes for history and result; then get %full
            var fractionHistory = $("#visHistory .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
            var fractionResult = $("#visResult .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
            fractionHistory = 100-fractionHistory;
            fractionResult = 100-fractionResult;
            // if fractionHistory > fractionResult
            if(fractionHistory>fractionResult){
              // send&remove fraction in history, result; remove unit in result too
              $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                $('#visHistory .collection .fraction').remove();
                $('#visResult .collection .fraction').stop(true).animate({opacity: "0"},timeAnimate,function(){
                  $('#visResult .collection .fraction').remove();
                  // change last unit in result to fractional unit; %full = 1-fractionHistory+fractionResult
                  var fractionNew = 100-fractionHistory+fractionResult;
                  if(fractionNew>=0){
                    let fxString = 100-fractionNew;
                    $("#visResult .collection div:last-child").html("").removeClass("circle").addClass("square fraction");
                    let x = "inset(" + fxString + "% 0px 0px 0px)";
                    $("#visResult .fraction").css("clip-path", x);
                  }
                });
              });
            }
            // if fractionHistory < fractionResult
            else if(fractionHistory<fractionResult){
              // send&remove fraction in history, result;
              $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                $('#visHistory .collection .fraction').remove();
                // change last unit in result to fractional unit; %full = fractionResult-fractionHistory
                var fractionNew = fractionResult-fractionHistory;
                if(fractionNew>=0){
                  let fxString = 100-fractionNew;
                  let x = "inset(" + fxString + "% 0px 0px 0px)";
                  $("#visResult .fraction").css("clip-path", x);
                }
              });
            }
            // if fractionHistory = fractionResult
            else if(fractionHistory===fractionResult){
              // send&remove fraction in history, result; remove unit in result too
              $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                $('#visHistory .collection .fraction').remove();
                $('#visResult .collection .fraction').stop(true).animate({opacity: "0"},timeAnimate,function(){
                  $('#visResult .collection .fraction').remove();
                });
              });
            }
          }
          // if result does NOT have a fraction, even if it has a whole unit...
          else if($("#visResult .collection .fraction").length===0){
            var fractionHistory = $("#visHistory .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
            fractionHistory = 100-fractionHistory;
            // send&remove fraction in history, result
            $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
              $('#visHistory .collection .fraction').remove();
              // change last unit in result to fractional unit; %full = 1-fractionHistory+fractionResult
              var fractionNew = 100-fractionHistory;
              if(fractionNew>=0){
                let fxString = 100-fractionNew;
                $("#visResult .collection div:last-child").html("").removeClass("circle").addClass("square fraction");
                let x = "inset(" + fxString + "% 0px 0px 0px)";
                $("#visResult .fraction").css("clip-path", x);
              }
              // style results unit/fraction appropriately
              $("#visResult .collection div").removeClass("circle").addClass("square");
              /*
              let resultNew = parseFloat(state.result);
              let unit = 1;
              if(Math.abs(resultNew)<0.1 || Math.abs(resultNew)>100){
                unit = determineUnit(resultNew);
              }
              styleUnits(resultNew,unit);
              */
            });
          }
        }
      }
      // else if result has NO whole units visualized anymore...
      else{
        console.log("No more whole units detected in results."); // DEBUG
        // and decimal/fraction is NOT present in result, either
        if($("#visResult .collection .fraction").length===0){
          // console.log("No fraction detected in results."); // DEBUG
          // add remaining units from history to result
          sendRemainingHistory(50);
        }
        // else a decimal/fraction is present in result...
        else if($("#visResult .collection .fraction").length>0){
          // console.log("Fraction detected in results."); // DEBUG
          // if decimal/fraction is NOT also present in history...
          if($("#visHistory .collection .fraction").length===0){
            // if history has at least one whole unit remaining, too...
            if($("#visHistory .collection div").length - $("#visHistory .collection .fraction").length > 0){
              // send&remove 1 whole unit from history
              $('#visHistory .collection div:first-child').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                $('#visHistory .collection div:first-child').remove();
                // Get the clip-path value for the fractional part of the result
                var fractionResult = $("#visResult .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
                // remove fraction from result
                $("#visResult .collection .fraction").animate({opacity: "0"},timeAnimate,function(){
                  // create new fractional unit in result representing (1-fraction), if appropriate
                  $("#visResult .collection .fraction").remove();
                  fractionResult = 100 - (100-fractionResult); //New %full (100- (100-fractionResult))
                  if(fractionResult>=0){
                    let fxString = 100-fractionResult;
                    $("#visResult .collection").append("<div class='square fraction bloopIn'></div>");
                    let x = "inset(" + fxString + "% 0px 0px 0px)";
                    $("#visResult .fraction").css("clip-path", x);
                  }
                  // style results unit/fraction appropriately
                  let resultNew = parseFloat(state.result)
                  let unit = 1;
                  if(Math.abs(resultNew)<0.1 || Math.abs(resultNew)>100){
                    unit = determineUnit(resultNew);
                  }
                  styleUnits(resultNew,unit);
                  // send&remove remaining whole units from history; prepend to results
                  sendRemainingHistory(50);
                });
              });
            }
            // if history has NO whole units remaining
            else if($("#visHistory .collection div").length - $("#visResult .collection .fraction").length===0){
              // refresh history (end) // DEBUG this branch should never actually occur!
              console.log("Debug: This branch should never occur..."); // DEBUG
            }
          }
          // else if decimal/fraction is also present in history...
          else if($("#visHistory .collection .fraction").length>0){
            // get fraction clip sizes for history and result; then get %full
            var fractionHistory = $("#visHistory .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
            var fractionResult = $("#visResult .collection .fraction").css("clip-path").split(" ")[0].match(/\d+/)[0];
            fractionHistory = 100-fractionHistory;
            fractionResult = 100-fractionResult;
            // if history's fraction has bigger abs value
            if(fractionHistory>fractionResult){
              // send&remove fraction from history; remove fraction from result
              $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                $('#visHistory .collection .fraction').remove();
                $('#visResult .collection .fraction').stop(true).animate({opacity: "0"},timeAnimate,function(){
                  $('#visResult .collection .fraction').remove();
                  // create new fractional unit in result representing (historyFx-resultFx)
                  var fractionNew = fractionHistory-fractionResult;
                  if(fractionNew>0){
                    let fxString = 100-fractionNew;
                    $("#visResult .collection").append("<div class='square fraction bloopIn'></div>");
                    let x = "inset(" + fxString + "% 0px 0px 0px)";
                    $("#visResult .fraction").css("clip-path", x);
                  }
                  // style results unit/fraction appropriately
                  let resultNew = parseFloat(state.result)
                  let unit = 1;
                  if(Math.abs(resultNew)<0.1 || Math.abs(resultNew)>100){
                    unit = determineUnit(resultNew);
                  }
                  styleUnits(resultNew,unit);
                  // send&remove remaining whole units from history; prepend to results
                  sendRemainingHistory(50);
                });
              });
            }
            // else if result's fraction has bigger abs value
            else if(fractionHistory<fractionResult){
              // if history also has at least one whole unit, too...
              if($("#visHistory .collection div").length - $("#visHistory .collection .fraction").length > 0){
                // send&remove fraction + one whole unit from history; remove fraction from result
                $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                  $('#visHistory .collection .fraction').remove();
                  $('#visHistory .collection div:first-child').remove();
                  $('#visResult .collection .fraction').stop(true).animate({opacity: "0"},timeAnimate,function(){
                    $('#visResult .collection .fraction').remove();
                    // create new fractional unit in result representing (1-(resultFx-historyFx))
                    var fractionNew = 100+fractionHistory-fractionResult;
                    if(fractionNew>0){
                      let fxString = 100-fractionNew;
                      $("#visResult .collection").append("<div class='square fraction bloopIn'></div>");
                      let x = "inset(" + fxString + "% 0px 0px 0px)";
                      $("#visResult .fraction").css("clip-path", x);
                    }
                    // style results unit/fraction appropriately
                    let resultNew = parseFloat(state.result)
                    let unit = 1;
                    if(Math.abs(resultNew)<0.1 || Math.abs(resultNew)>100){
                      unit = determineUnit(resultNew);
                    }
                    styleUnits(resultNew,unit);
                    // send&remove remaining whole units from history; prepend to results
                    sendRemainingHistory(50);
                  });
                });
              }
              // else if history does not have any whole units...
              else if($("#visHistory .collection div").length - $("#visHistory .collection .fraction").length===0){
                // send&remove fraction; remove fraction from result
                $('#visHistory .collection .fraction').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
                  $('#visHistory .collection .fraction').remove();
                  // create new fractional unit in result representing (1-fraction), if appropriate
                  var fractionNew = fractionResult-fractionHistory;
                  if(fractionNew>=0){
                    let fxString = 100-fractionNew;
                    // change last fraction to the correct size
                    let x = "inset(" + fxString + "% 0px 0px 0px)";
                    $("#visResult .fraction").css("clip-path", x);
                  }
                  // style results unit/fraction appropriately
                  let resultNew = parseFloat(state.result);
                  let unit = 1;
                  if(Math.abs(resultNew)<0.1 || Math.abs(resultNew)>100){
                    unit = determineUnit(resultNew);
                  }
                  styleUnits(resultNew,unit);
                });
              }
            }
            // else if history's and result's fractions have equal abs values
            else if(fractionHistory===fractionResult){
              // send&remove fractions from history; remove fraction from result
              $("#visHistory .collection .fraction").stop(true).addClass("sendRight").on("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend",function(e){
                $("#visResult .collection .fraction").animate({opacity: "0"},timeAnimate,function(){
                  $("#visResult .collection .fraction").remove();
                  // send&remove remaining whole units from history; prepend to results
                  sendRemainingHistory(50);
                });
              });
            }
          }
        }
      }
    }
    // if history has NO units visualized anymore...
    else if($("#visResult .collection div").length===0){
      // stop, refresh history
    }
  }

  // Send the remaining history units one at a time
  function sendRemainingHistory(timeAnimate,noDelay){
    if(!timeAnimate){
      var timeAnimate = 100; // default timing of each unit movement
    }
    if(!noDelay){
      noDelay = 0; // delay in start by default
    }
    if(noDelay){
      moveUnit(timeAnimate,0);
    }
    else{
      $("#visResult .collection").animate({color: "white"},700,function(){
        moveUnit(timeAnimate,0);
      });
    }
    function moveUnit(){
      $('#visHistory .collection div:first-child').stop(true).animate({opacity: "0", left: "100%"},timeAnimate,function(){
        if($("#visHistory .collection div:first-child").hasClass("fraction")){
          $("#visHistory .collection div:first-child").appendTo("#visResult .collection");
          $("#visResult .collection .fraction").css("left","-100%").stop(true).animate({opacity: "1", left: "0"},timeAnimate);
        }
        else{
          $("#visHistory .collection div:first-child").prependTo("#visResult .collection");
          $("#visResult .collection div:first-child").css("left","-100%").stop(true).animate({opacity: "1", left: "0"},timeAnimate,function(){
            if($('#visHistory .collection div').length>0){ // if there are any units in the history...
              sendRemainingHistory(timeAnimate,1);
            }
          });
        }
      });
    }
  }

  // This function accepts numbers and displays then w/ animations of length defined in ms
  // It assumes resultVis is the number of units already displayed in the results
  // while resultNew is the new number to show in the results
  function visResult(resultNew, resultVis, timeAnimate){
    console.log("Running visResult function... resultNew, resultVis:", resultNew, resultVis);
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
        console.log("Running visualizeFraction() function from visResult()"); // DEBUG
        visualizeFraction(resultNew,resultVis);
      }
      // if no decimals present (just whole numbers)
      else{
        console.log("Running visualizeBasic() function from visResult()"); // DEBUG
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
    }
  };

  // This function accepts numbers and displays then w/ animations of length defined in ms
  // Only execute when the history and result have different visualization units.
  function visHistoryAndResult(resultNew, resultVis, timeAnimate, historyVis, unitHistory, unitNew){
    if(resultNew===undefined){
      resultNew = 0;
    }
    if(resultVis===undefined){
      resultVis = 0;
    }
    // get the common visualization units
    var unitLargest = (unitNew>unitHistory) ? unitNew : unitHistory;
    console.log("Largest unit: ",unitLargest, " unitNew, unitHistory: ", unitNew, unitHistory); // DEBUG
    // if history unit is bigger...
    if(unitHistory===unitLargest){
      console.log("History unit is larger or equal."); // DEBUG
      // if it's not just a sign change in the result, and it's not just a decimal added...
      showResults(resultNew,resultVis,timeAnimate,unitLargest);
    }
    // else if result unit is bigger...
    else if(unitNew===unitLargest){
      console.log("Result unit is larger."); // DEBUG
      // redraw results completely
      // if it's not just a sign change in the result AND not the same number...
      showResults(resultNew,resultVis,timeAnimate,unitLargest);
      // clear history visualization, then visualize new history
      revisualizeHistory(historyVis,unitLargest,timeAnimate);
    }
    // style results
    styleUnits(resultNew,unitLargest);

    function showResults(resultNew,resultVis,timeAnimate,unitLargest){
      // console.log("start: ", resultNew, resultVis, unitLargest); // DEBUG
      if(!detectSignChange(resultNew,resultVis) && resultNew!=resultVis){
        $("#visResult .collection").animate({opacity: "0"},timeAnimate,function(){
          $("#visResult").html("<div class='collection'></div>");
          // redraw results completely
          var resultNewReduced = parseFloat((resultNew/unitLargest).toFixed(12)); // converts to number >0,<=100
          // console.log("reduced: ", resultNewReduced); // DEBUG
          if(Math.abs(resultNewReduced)>=1){
            // display the "whole/round number" units
            for(var i=0; i<Math.floor(Math.abs(resultNewReduced)); i++){
              $("#visResult .collection").append("<div class='circle bloopIn'>"+unitLargest+"</div>");
            }
          }
          // Then visualize the "fractional" part last (based on visualizeFraction())
          // set the leftover fractional part of new result aside
          var wholeNum = Math.floor(Math.abs(resultNewReduced));
          var fraction = Math.abs(resultNewReduced)-wholeNum;
          // console.log("fraction is... ", fraction); // DEBUG
          if(fraction!=0){
            var fxString = Math.round((1-fraction)*100).toString();
            var x = "inset(" + fxString + "% 0px 0px 0px)";
            $("#visResult .collection").append("<div class='square fraction bloopIn'></div>");
            $("#visResult .fraction").css("clip-path", x);
            // and change all the shapes to fractional shapes
            $("#visResult .collection>div").removeClass("circle").addClass("square");
          }
          // style history
          styleUnits(resultNew,unitLargest);
        });
      }
    }
  };

  // This function is for redrawing whatever's shown in the results
  function revisualizeResult(resultVis,unit,timeAnimate){
    $("#visResult .collection").animate({opacity: "0"},timeAnimate,function(){
      // redraw result completely
      $("#visResult").html("<div class='collection'></div>");
      // if new Result is zero...
      if(resultVis===0){
        $("#visResult .collection").append("<div class='circle zero'></div>");
      }
      // otherwise add units
      else{
        var resultVisReduced = parseFloat((resultVis/unit).toFixed(12)); // converts to number >0,<=100
        if(Math.abs(resultVisReduced)>=1){
          // display the "whole/round number" units
          for(var i=0; i<Math.floor(Math.abs(resultVisReduced)); i++){
            $("#visResult .collection").append("<div class='circle bloopIn'>"+unit+"</div>");
          }
        }
        // Then visualize the "fractional" part last if needed
        // set the leftover fractional part of new result aside
        var wholeNum = Math.floor(Math.abs(resultVisReduced));
        var fraction = Math.abs(resultVisReduced)-wholeNum;
        // if fraction exists
        if(fraction>0){
          var fxString = Math.round((1-fraction)*100).toString();
          var x = "inset(" + fxString + "% 0px 0px 0px)";
          $("#visResult .collection").append("<div class='square fraction bloopIn'></div>");
          $("#visResult .fraction").css("clip-path", x);
          // and change all the shapes to fractional shapes
          $("#visResult .collection>div").removeClass("circle").addClass("square");
        }
      }
      // style history
      styleUnits(resultVis,unit);
    });
  }

  // This function is for redrawing whatever's shown in the history
  function revisualizeHistory(historyVis,unit,timeAnimate){
    $("#visHistory .collection").animate({opacity: "0"},timeAnimate,function(){
      // redraw history completely
      $("#visHistory").html("<div class='collection'></div>");
      // if new history is zero...
      if(historyVis===0){
        $("#visHistory .collection").append("<div class='circle zero'></div>");
      }
      // otherwise add units
      else{
        var historyVisReduced = parseFloat((historyVis/unit).toFixed(12)); // converts to number >0,<=100
        if(Math.abs(historyVisReduced)>=1){
          // display the "whole/round number" units
          for(var i=0; i<Math.floor(Math.abs(historyVisReduced)); i++){
            $("#visHistory .collection").append("<div class='circle bloopIn'>"+unit+"</div>");
          }
        }
        // Then visualize the "fractional" part last if needed
        // set the leftover fractional part of new result aside
        var wholeNum = Math.floor(Math.abs(historyVisReduced));
        var fraction = Math.abs(historyVisReduced)-wholeNum;
        // if fraction exists
        if(fraction>0){
          var fxString = Math.round((1-fraction)*100).toString();
          var x = "inset(" + fxString + "% 0px 0px 0px)";
          $("#visHistory .collection").append("<div class='square fraction bloopIn'></div>");
          $("#visHistory .fraction").css("clip-path", x);
          // and change all the shapes to fractional shapes
          $("#visHistory .collection>div").removeClass("circle").addClass("square");
        }
      }
      // style history
      styleUnits(historyVis,unit,1);
    });
  }

  // Deal w/ fractions
  function visualizeFraction(resultNew,resultVis){
    console.log("Running the visualizeFraction() function now: ", resultNew, resultVis); // DEBUG
    var unit = 1;
    if(Math.abs(resultNew)<0.1 || Math.abs(resultNew)>100){
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
        // if units displayed are different from what they should be, OR if it's just a fraction displayed...
        let unitVisResult = 1;
        let resultVisTarget = parseFloat(state.result);
        if( Math.abs(resultVisTarget)<0.1 || Math.abs(resultVisTarget)>100){
          unitVisResult = determineUnit(resultVisTarget);
        }
        console.log(unitVisResult,resultVisTarget);
        if( ($("#visResult .collection div:first-child").html()!=unitVisResult) ||
          ($("#visResult .collection div").length===1&&$("#visHistory .collection .fraction").length===1) ){
          console.log("Redisplaying the results...", resultVisTarget); // DEBUG
          // clear result & redisplay it
          revisualizeResult(resultVisTarget,unitVisResult,timeAnimate);
        }
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
    else{
      // if units displayed are different from what they should be, OR if it's just a fraction displayed...
      let unitVisResult = 1;
      let resultVisTarget = parseFloat(state.result);
      if( Math.abs(resultVisTarget)<0.1 || Math.abs(resultVisTarget)>100){
        unitVisResult = determineUnit(resultVisTarget);
      }
      console.log(unitVisResult,resultVisTarget);
      if( ($("#visResult .collection div:first-child").html()!=unitVisResult) ||
        ($("#visResult .collection div").length===1&&$("#visHistory .collection .fraction").length===1) ){
        console.log("Redisplaying the results...", resultVisTarget); // DEBUG
        revisualizeResult(resultVisTarget,unitVisResult,timeAnimate);
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
    else{
      // if units displayed are different from what they should be, OR if it's just a fraction displayed...
      let unitVisResult = 1;
      let resultVisTarget = parseFloat(state.result);
      if( Math.abs(resultVisTarget)<0.1 || Math.abs(resultVisTarget)>100){
        unitVisResult = determineUnit(resultVisTarget);
      }
      console.log(resultVisTarget,unitVisResult);
      if( ($("#visResult .collection div:first-child").html()!=unitVisResult) ||
        ($("#visResult .collection div").length===1&&$("#visHistory .collection .fraction").length===1) ){
        console.log("Redisplaying the results...", resultVisTarget); // DEBUG
        revisualizeResult(resultVisTarget,unitVisResult,timeAnimate);
      }
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
  function styleUnits(resultNew,unit,doHistoryInstead){
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
      else if(unit<1e30){unitLabel = unit.toExponential().toString();}
      else{
        if(resultNew>0){unitLabel = "+"}
        else if(resultNew<0){unitLabel = ""}
      }
    }
    else if(unit<1){
      borderType = "inset";
      if(unit===0.1){unitLabel = "0.1";}
      else if(unit===0.01){unitLabel = "0.01";}
      else{unitLabel = unit.toExponential().toString();}
    }
    else{unit = unit.toExponential();} // not needed - just in case
    // determine if affecting history or result
    var target = "#visResult";
    if(doHistoryInstead){
      target = "#visHistory";
    }
    // if positive
    if(resultNew>0){
      $(target + " .collection>div").removeClass("negative zero").addClass("positive");
      $(target + " .collection>div:not(.fraction)").html(unitLabel);
    }
    // if negative
    else if(resultNew<0){
      $(target + " .collection>div").removeClass("positive zero").addClass("negative");
      $(target + " .collection>div:not(.fraction)").html("-"+unitLabel);
    }
    // if zero
    else if(resultNew===0){
      $(target + " .collection>div").removeClass("positive negative").addClass("zero");
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
      $(target + " .collection>div").css("border",borderString);
    }
  }

  // Change the results appearance to the opposite sign ONLY (don't change units)
  function styleUnitsFlip(){
    // find current state
    var borderType = $("#visResult .collection div:first-child").css("border-style"); // none, inset, outset
    if($("#visResult .collection div:first-child").hasClass("positive")){
      var oldSign = "positive";
    }
    else if($("#visResult .collection div:first-child").hasClass("negative")){
      var oldSign = "negative";
    };
    var unitLabel = $("#visResult .collection div:first-child").html(); // only works if there's a whole unit...
    if(typeof unitLabel != undefined){
      unitLabel = unitLabel.toString();
    }
    else{
      unitLabel = ""; // default if undefined, for fractions, zeros
    }
    // set new visualized state to opposite
    // switch label sign
    if(unitLabel.charAt(0)==="-"){
      unitLabel = unitLabel.slice(1,unitLabel.length);
    }
    else{
      unitLabel = "-" + unitLabel;
    }
    $("#visResult .collection div:not(.fraction)").html(unitLabel);
    // change color of background and border
    var borderColor;
    if(oldSign==="negative"){
      borderColor = "#e50000";
      $("#visResult .collection>div").removeClass("negative").addClass("positive shake").css("border-color",borderColor);
    }
    else if(oldSign==="positive"){
      borderColor = "#1C2833";
      $("#visResult .collection>div").removeClass("positive").addClass("negative shake").css("border-color",borderColor);
    }
  }

}
