$(document).ready(function(){
  // initialize common variables
  var operatorExists = false; // status of operator in history
  var equalsExists = false; // status of equals sign in history

  // Read in button presses (types: clear, square/operator, number, dec, sign, equals)
  // Listen for signal: CLEAR
  listenForClear();
  // Listen for signal: number 0-9
  listenForNumber();
  // Listen for signal: DECIMAL
  listenForDecimal();
  // Listen for signal: operator +-*/
  listenForOperator();

  // If button is (sign), run SIGN function
    // if (displayNum) is (0) or (0.) do nothing
    // if (displayNum) is != (0) or (0.)
      // flip displayNum to opposite sign
  // If button is (equals)
    // If (operatorExists) is false && (equalsExists) is false
    // OR if (equalsExists) in history already
      // do nothing; or just do some silly animation? "Are you calculating something?"
    // If (operatorExists) is true && (equalsExists) is false...
      // If display is empty
        // do nothing; ir have gator say "I need a number" or something
      // If display is not empty (displayNum) exists/has value
        // Assume (1st num) = the one in the history already
        // Assume (2nd num) = number on display
        // Calculate (1st num) (operator) (2nd num); store as (ans)
        // Replace history with (1st num) (operator) (2nd num) =
          // if any number is negative (<0), put it in parentheses
        // Replace display with (ans)
        // store status of "operatorExists" to true
        // store status of "equalsExists" to true
  // If button is (squared),
    // If display empty,
      // If (operatorExists) = true AND (equalsExists) = false
        // do not calculate
        // give "error", e.g. "Can't square a multiplication sign!"
      // Else if both false (empty history)
        // do nothing "need a number"
    // If display !empty,
      // calculate (displayNum)^2 = (ans)
      // Set display to (ans)
      // set history to (displayNum)^2 =
      // store status of "operatorExists" to false
      // store status of "equalsExists" to true
  // display result

  // clear on click

});

// note: key codes reference: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// TO DO: will need to visually denote button presses somehow when keyboard is used

// CLEAR =======================================================================
function listenForClear(){
  // keyboard: ESC keyboard
  $(document).on('keyup', function(event){
    if (event.keyCode===27){
      console.log("Key pressed (ESC): CLEAR"); // debug
      clear();
    }
  });
  // mouse click
  $("#clear").on('click', function(){
    console.log("Button pressed: CLEAR"); // debug
    clear();
  });
}

function clear(){
  $("#history").html("");   // clear history
  $("#result").html("0");   // clear history
  return 0;
}

// NUMBER ======================================================================
function listenForNumber(){
  // keyboard: ESC keyboard
  $(document).on('keyup', function(event){
    if (event.keyCode>=48 && event.keyCode<=57 && event.shiftKey===false){
      console.log("Keyboard pressed (digit): " + (event.keyCode-48)); // debug
      numberPressed();
    }
  });
  // mouse click
  $(".digit").on('click', function(){
    var digit = this.value;
    console.log("Button pressed (digit): " + digit); // debug
    numberPressed(digit);
  });
}

function numberPressed(digit){

};

// If button is a number 0-9
  // If there is NOT a 1st operator in the history already...
    // If current number = (0) without decimal point
      // put digit in display replacing 0
    // else if current number != (0),
      // add digit to number on right-hand side
  // If there IS a 1st operator in the history already AND NO (equals) in history...
    // If current number = "0" without decimal point
      // put in display replacing 0
    // else if current number is empty, add in digit
    // else if current number != "0" and not empty,
      // add digit to number on right-hand side
  // If there's already an (equals) in the history and no (ansHistory)...
    // If current number = empty or (0) without decimal point
      // add the current (ans) on display to the history...
      // put digit in display replacing 0
    // else if current number != (0),
      // add digit to (display) number on right-hand side

// DECIMAL =====================================================================
function listenForDecimal(){
  // keyboard: ESC keyboard
  $(document).on('keyup', function(event){
    if ((event.keyCode===190 && event.shiftKey===false) || event.keyCode===110){
      console.log("Key pressed (.): DECIMAL POINT"); // debug
      decimalPoint();
    }
  });
  // mouse click
  $("#decimal").on('click', function(){
    console.log("Button pressed: DECIMAL POINT"); // debug
    decimalPoint();
  });
}

function decimalPoint(){

}

      // If button is (decimal)...
        // if there is a decimal in the display number already, output an error
        // If current display number is (0), (0.), or empty,
          // replace display with (0.)
        // If current display number is != (0), (0.) or empty
          // add decimal to number on right-hand side

// operators: +-*/==============================================================
function listenForOperator(){
  var operator;
  // keyboard: +-*/
  $(document).on('keyup', function(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode
    // console.log(charCode + ", " + event.which + ", " + event.keyCode) // debug
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
    // assume (1st num) = number on display (stored in string?)
    // set history as (1st num) (operator)
      // if any number is negative (<0), put it in parentheses
    // clear display results (empty)
    // store status of "operatorExists" to true
    // store status of "equalsExists" to false
  // If there IS a 1st operator in the history already, and NO equals sign...
    // ...and if the number on display is empty...
      // Replace the 1st operator in the history with the new operator
    // ...and if the number on display exists/not empty...
      // Assume (1st num) = the one in the history already
      // Assume (2nd num) = number on display
      // Calculate (1st num) (operator) (2nd num); store as (ans)
      // Replace history with (1st num) (operator) (2nd num) =
        // if any number is negative (<0), put it in parentheses
      // Replace display with (ans)
      // store status of "operatorExists" to true
      // store status of "equalsExists" to true
  // If there IS a 1st operator in the history already AND an equals sign...
    // assuming display is NOT empty (otherwise there would be no equals)...
    // Assume (displayNum) = (1st num)
    // Replace history with (1st num) (new operator)
      // if any number is negative (<0), put it in parentheses
    // Empty the display
    // store status of "operatorExists" to true
    // store status of "equalsExists" to false
