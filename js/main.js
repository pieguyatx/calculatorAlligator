$(document).ready(function(){
  // initialize common variables
  var state = {};
  state.operatorExists = false; // status of operator in history
  state.equalsExists = false; // status of equals sign in history
  state.history = {
    "numFirst": undefined,
    "operator": undefined,
    "numSecond": undefined,
    "text": ""
  };
  state.result = "0";

  // Read in button presses (types: clear, square/operator, number, dec, sign, equals)
  // Listen for signal: CLEAR
  listenForClear(state);
  // Listen for signal: number 0-9
  listenForNumber(state);
  // Listen for signal: DECIMAL
  listenForDecimal(state);
  // Listen for signal: operator +-*/
  listenForOperator(state);
  // Listen for signal: SIGN
  listenForSign();
  // Listen for signal: EQUALS
  listenForEquals(state);
  // Listen for signal: SQUARED
  listenForSquared();

  // result result

  // clear on click

});

// note: key codes reference: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// TO DO: will need to visually denote button presses somehow when keyboard is used
// TO DO: Add visualizations..
// TO DO: Add notes/popups? with tips, like ESC will also reset

// CLEAR =======================================================================
function listenForClear(state){
  // keyboard: ESC keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===27){
      console.log("Key pressed (ESC): CLEAR"); // debug
      clear(state);
    }
  });
  // mouse click
  $("#clear").on('click', function(){
    console.log("Button pressed: CLEAR"); // debug
    clear(state);
  });
}

function clear(state){
  state.operatorExists = false;
  state.equalsExists = false;
  state.history = {"numFirst": undefined, "operator": undefined, "numSecond": undefined, "text": ""};
  $("#history").html(state.history.text);   // clear history
  state.result = "0";
  $("#result").html(state.result); // clear result
  $("#helpText").html("You reset? Feed me more numbers!");
}

// NUMBER ======================================================================
function listenForNumber(state){
  // keyboard: ESC keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode>=48 && charCode<=57 && event.shiftKey===false){
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
  });
  // mouse click
  $(".digit").on('click', function(){
    var digit = this.value.toString();
    console.log("Button pressed (digit): " + digit); // debug
    numberPressed(digit,state);
    digit = NaN;
  });
}

function numberPressed(digit,state){
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
        // if it's a 2nd number, division, and divisor>1, output "divisor" msg
        if(state.history.numFirst!=undefined && state.history.operator==="divide" && parseInt(state.result)>1){
          $("#helpText").html("That DIVISOR looks delectable.");
        }
      }
    }
//    else if(state.operatorExists===true && state.equalsExists===false){
      // If there IS a 1st operator in the history already AND NO (equals) in history...
        // If current number = "0" without decimal point
          // put in result replacing 0
        // else if current number is empty, add in digit
        // else if current number != "0" and not empty,
          // add digit to number on right-hand side
//    }
    // If there's already an (equals) in the history
    else if(state.equalsExists===true){
      clear(state);
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
    $("#helpText").html("OK. That number looks tasty.");
  }
};

// DECIMAL =====================================================================
function listenForDecimal(state){
  // keyboard: ESC keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if ((charCode===190 && event.shiftKey===false) || charCode===110){
      console.log("Key pressed (.): DECIMAL POINT"); // debug
      if(state.result!="error"){
        decimalPoint(state);
      }
    }
  });
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
      $("#helpText").html("Such a teensy number!");
    }
    // if there is a decimal in the result number already, output an error
    else if(state.result.indexOf(".")>0){
      state.result = "error";
      $("#result").html(state.result);
      $("#helpText").html("Too many decimal points!");
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
    clear(state);
    // replace result with (0.)
    state.result = "0.";
    $("#result").html(state.result);
    // update help text
    $("#helpText").html("Making a small number, eh?");
  }
}

// operators: +-*/==============================================================
function listenForOperator(state){
  var operator;
  // keyboard: +-*/
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if ((charCode===187 && event.shiftKey===true) || charCode===107){
      operator = "add";
    } else if ((charCode===189 && event.shiftKey===false) || charCode===109){
      operator = "subtract"
    } else if ((charCode===56 && event.shiftKey===true) || charCode===106){
      operator = "multiply"
    } else if ((charCode===191 && event.shiftKey===false) || charCode===111){
      operator = "divide"
    }
    if(operator){
      console.log("Keyboard pressed (operator): " + operator); // debug
      operatorPressed(operator,state);
      operator = NaN; // clear var so as not to trigger anything later
    }
  });
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
    $("#helpText").html("Press the ESC key or AC button to reset this meal.");
  }
  // If no error in the result...
  else {
    // If there is NO 1st operator in the history already (and no equals?)...
    if(state.operatorExists===false && state.equalsExists===false){
      // assume (1st num) = number on result (stored in string?)
      state.history.numFirst = state.result;
      // if any number is negative (<0), put it in parentheses
      // TO DO LATER AFTER SIGN() is defined

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
    // If there IS a 1st operator in the history already, and NO equals sign...
    else if(state.operatorExists===true && state.equalsExists===false){
      // ...and if the number in result is empty...
      if(state.result===""){
        // Replace the 1st operator in the history with the new operator
        let symbol;
        symbol = getSymbol(operator);
        state.history.text = state.history.numFirst.concat(" " + symbol);
        $("#history").html(state.history.text);
      }
      // ...and if the number on result exists/not empty...
      else if(state.result!=""){
        // Assume (1st num) = the one in the history already

        // Assume (2nd num) = number on result
        // Calculate (1st num) (operator) (2nd num); store as (ans)
        // Replace history with (1st num) (operator) (2nd num) =
          // if any number is negative (<0), put it in parentheses
        // Replace result with (ans)
        // store status of "operatorExists" to true
        // store status of "equalsExists" to true
      }
    }
    // If there IS a 1st operator in the history already AND an equals sign...
    if(state.operatorExists===true && state.equalsExists===true){
      // assuming result is NOT empty (otherwise there would be no equals)...
      // Assume (resultNum) = (1st num)
      // Replace history with (1st num) (new operator)
        // if any number is negative (<0), put it in parentheses
      // Empty the result
      // store status of "operatorExists" to true
      // store status of "equalsExists" to false
    }
  }
};

function getSymbol(operator){
  if(operator==="add"){
    symbol="+";
    $("#helpText").html("ADD some good ingredients.");
  }
  else if(operator==="subtract"){
    symbol="&minus;";
    $("#helpText").html("Don't SUBTRACT too much flavor...");
  }
  else if(operator==="multiply"){
    symbol="&times;";
    $("#helpText").html("MULTIPLY the portion size!");
  }
  else if(operator==="divide"){
    symbol="&divide;";
    $("#helpText").html("That DIVIDEND looks delicious.");
  }
  return symbol;
}

// SIGN ========================================================================
function listenForSign(){
  // keyboard: ~ keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===192 && event.shiftKey===true){
      console.log("Key pressed (~): SIGN"); // debug
      sign();
    }
  });
  // mouse click
  $("#sign").on('click', function(){
    console.log("Button pressed: SIGN"); // debug
    sign();
  });
}

function sign(){

}

  // If button is (sign), run SIGN function
    // if (resultNum) is (0) or (0.) or empty, do nothing
    // if (resultNum) is != (0) or (0.)
      // flip resultNum to opposite sign

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

function equals(state){
  // If (operatorExists) is false && (equalsExists) is false
  // OR if (equalsExists) in history already
  if(state.equalsExists===true || (state.operatorExists===false && state.equalsExists===false)){
    // do nothing; or just do some silly animation? "Are you calculating something?"
    $("#helpText").html("That equals itself, doesn't it?")
  }
  // If (operatorExists) is true && (equalsExists) is false...
  else if(state.operatorExists===true && state.equalsExists===false){
    // If result is empty
    if(state.result===""){
      // do nothing; or have gator say "I need a number" or something
      $("#helpText").html("What number are you going to enter?");
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
         $("#helpText").html("This is SUM meal!");
      }
      else if(state.history.operator==="subtract"){
        calc = parseFloat(state.history.numFirst) - parseFloat(state.history.numSecond);
        symbol="&minus;";
        $("#helpText").html("Is this food, or is this math? I can't tell the DIFFERENCE!");
      }
      else if(state.history.operator==="multiply"){
        calc = parseFloat(state.history.numFirst) * parseFloat(state.history.numSecond);
        symbol="&times;";
        $("#helpText").html("What a great food PRODUCT!");
      }
      else if(state.history.operator==="divide"){
        calc = parseFloat(state.history.numFirst) / parseFloat(state.history.numSecond);
        symbol="&divide;";
        $("#helpText").html("What's the health QUOTIENT of this meal?");
      }
      // Replace result with (ans)
      state.result = calc.toString();
      $("#result").html(state.result);
      // if second number is negative (<0), put it in parentheses
      // TO DO: Update this when sign() function equalsExists

      // Replace history with (1st num) (operator) (2nd num) =
      state.history.text = state.history.numFirst.toString() + " " + symbol + " " + state.history.numSecond.toString() + " =";
      $("#history").html(state.history.text);
      // store status of "operatorExists" to true
      state.operatorExists = true;
      // store status of "equalsExists" to true
      state.equalsExists = true;
    }
  }
}

// SQUARED =====================================================================
function listenForSquared(){
  // keyboard: ^ keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===54 && event.shiftKey===true){
      console.log("Key pressed (^): SQUARED"); // debug
      sign();
    }
  });
  // mouse click
  $("#squared").on('click', function(){
    console.log("Button pressed: SQUARED"); // debug
    squared();
  });
}

function squared(){

}

  // If button is (squared),
    // If result empty,
      // If (operatorExists) = true AND (equalsExists) = false
        // do not calculate
        // give "error", e.g. "Can't square a multiplication sign!"
      // Else if both false (empty history)
        // do nothing "need a number"
    // If result !empty,
      // calculate (resultNum)^2 = (ans)
      // Set result to (ans)
      // set history to (resultNum)^2 =
      // store status of "operatorExists" to false
      // store status of "equalsExists" to true
