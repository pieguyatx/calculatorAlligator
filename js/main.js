$(document).ready(function(){
  // initialize common variables
  var operatorExists = false; // status of operator in history
  var equalsExists = false; // status of equals sign in history

    // run CLEAR function (see below)
      // clear history
      // assume displayed number is 0; then set state to "number"
  // Read in button presses (types: clear, square/operator, number, dec, sign, equals)
  // If button is (clear), run the CLEAR function
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
  // If button is (decimal)...
    // If current display number is (0), (0.), or empty,
      // replace display with (0.)
    // If current display number is != (0), (0.) or empty
      // add decimal to number on right-hand side
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
