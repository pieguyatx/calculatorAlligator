$(document).ready(function(){
  // initialize common variables
  var state = {};
  state.operatorExists = false; // status of operator in history
  state.equalsExists = false; // status of equals sign in history
  state.history = "";
  state.result = "0";

  // Read in button presses (types: clear, square/operator, number, dec, sign, equals)
  // Listen for signal: CLEAR
  listenForClear(state);
  // Listen for signal: number 0-9
  listenForNumber(state);
  // Listen for signal: DECIMAL
  listenForDecimal(state);
  // Listen for signal: operator +-*/
  listenForOperator();
  // Listen for signal: SIGN
  listenForSign();
  // Listen for signal: EQUALS
  listenForEquals();
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
  state.history = "";
  $("#history").html(state.history);   // clear history
  state.result = "0";
  $("#result").html(state.result); // clear result
  $("#helpText").html("Feed me more numbers!");
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
  // If there is NOT a 1st operator in the history already...
  if(state.operatorExists===false){
    // If result number = (0) without decimal point
    if(state.result=="0"){ // string or number is fine
      // put digit in results, replacing 0
      state.result = digit;
      $("#result").html(state.result);
    }
    // else if current number != (0),
    else if(state.result!="0" && state.result!="error"){
      // add digit to number on right-hand side
      state.result = state.result.concat(digit);
      $("#result").html(state.result);
    }
  }
  else if(state.operatorExists===true && state.equalsExists===false){
    // If there IS a 1st operator in the history already AND NO (equals) in history...
      // If current number = "0" without decimal point
        // put in result replacing 0
      // else if current number is empty, add in digit
      // else if current number != "0" and not empty,
        // add digit to number on right-hand side
  }
  else if(state.operatorExists===true && state.equalsExists===false){
    // If there's already an (equals) in the history and no (ansHistory)...
      // If current number = empty or (0) without decimal point
        // add the current (ans) on result to the history...
        // put digit in result replacing 0
      // else if current number != (0),
        // add digit to (result) number on right-hand side
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
  // if there is an EQUALS already in the history, then start a new number...

  // if there is a decimal in the result number already, output an error
  if(state.result.indexOf(".")>0){
    state.result = "error";
    $("#result").html(state.result);
    $("#helpText").html("Too many decimals!");
  }
  // If current result number is (0), (0.), or empty,
  else if(state.result=="0" || state.result=="0." || state.result==""){
    // replace result with (0.)
    state.result = "0.";
    $("#result").html(state.result);
  }
  // If current result number is != (0), (0.) or empty
  else{
    // add decimal to number on right-hand side
    state.result = state.result.concat(".");
    $("#result").html(state.result);
  }
}

// operators: +-*/==============================================================
function listenForOperator(){
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
      operatorPressed(operator);
      operator = NaN; // clear var so as not to trigger anything later
    }
  });
  // mouse click
  $(".operator").on('click', function(){
    operator = this.value;
    console.log("Button pressed (operator): " + operator); // debug
    operatorPressed(operator);
    operator = NaN; // clear var so as not to trigger anything later
  });
}

function operatorPressed(operator){

};

// If button is an operator (add, subtract, multiply divide),
  // If there is NO 1st operator in the history already (and no equals?)...
    // assume (1st num) = number on result (stored in string?)
    // set history as (1st num) (operator)
      // if any number is negative (<0), put it in parentheses
    // clear result results (empty)
    // store status of "operatorExists" to true
    // store status of "equalsExists" to false
  // If there IS a 1st operator in the history already, and NO equals sign...
    // ...and if the number on result is empty...
      // Replace the 1st operator in the history with the new operator
    // ...and if the number on result exists/not empty...
      // Assume (1st num) = the one in the history already
      // Assume (2nd num) = number on result
      // Calculate (1st num) (operator) (2nd num); store as (ans)
      // Replace history with (1st num) (operator) (2nd num) =
        // if any number is negative (<0), put it in parentheses
      // Replace result with (ans)
      // store status of "operatorExists" to true
      // store status of "equalsExists" to true
  // If there IS a 1st operator in the history already AND an equals sign...
    // assuming result is NOT empty (otherwise there would be no equals)...
    // Assume (resultNum) = (1st num)
    // Replace history with (1st num) (new operator)
      // if any number is negative (<0), put it in parentheses
    // Empty the result
    // store status of "operatorExists" to true
    // store status of "equalsExists" to false

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
function listenForEquals(){
  // keyboard: = keyboard
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
    if (charCode===187 && event.shiftKey===false){
      console.log("Key pressed (=): EQUALS"); // debug
      sign();
    }
  });
  // mouse click
  $("#equals").on('click', function(){
    console.log("Button pressed: EQUALS"); // debug
    equals();
  });
}

function equals(){

}

  // If button is (equals)
    // If (operatorExists) is false && (equalsExists) is false
    // OR if (equalsExists) in history already
      // do nothing; or just do some silly animation? "Are you calculating something?"
    // If (operatorExists) is true && (equalsExists) is false...
      // If result is empty
        // do nothing; ir have gator say "I need a number" or something
      // If result is not empty (resultNum) exists/has value
        // Assume (1st num) = the one in the history already
        // Assume (2nd num) = number on result
        // Calculate (1st num) (operator) (2nd num); store as (ans)
        // Replace history with (1st num) (operator) (2nd num) =
          // if any number is negative (<0), put it in parentheses
        // Replace result with (ans)
        // store status of "operatorExists" to true
        // store status of "equalsExists" to true

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
