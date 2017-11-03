# calculatorGator*
Calculator to help visualize simple operations

## About
* Written by Pius Wong, pius@pioslabs.com
* Originally part of a FreeCodeCamp exercise in HTML/CSS/JavaScript
* Created Sep 19, 2017
* Modified throughout Sep 2017

## Purpose
This web app is meant to be a basic visual calculator that allows users to add, subtract, multiply, and divide numbers by pressing the appropriate buttons, just like a real, physical calculator. Another button will clear the screen. In addition, this app should also help users envision these operations on individual units or objects. I hope it helps people of all ages understand how to manipulate numbers better and attach meaning to these operations.

## Known Bugs
These are known bugs that should be fixed over time. They haven't been fixed yet due to being lower priorities:
* When a second number is needed, and you attempt to change the sign, then press an operator, then press a digit, an extra, unnecessary "fraction" unit appears first.  This needs to be eliminated. (10/8/17)
* Unit labels don't show up properly on small screens. The fix should be to just hide the labels on small screens. (10/8/17)
* Long strings of 9's in fractions (decimal numbers) causes visualization errors, due to rounding errors, especially in the visResultComplex() function. Fortunately this shouldn't be a common occurrence for most users. (10/13/17)
* "Number Operator 0 Operator" changes style inappropriately to fraction style (10/25/17)
* Units are not correct when adding large/small numbers after animation completes (11/7/17)
* Numbers>100 added together don't have the right units (11/2/17)

## Miscellaneous
*The original project was named "Calculator Alligator" before I found out that a children's book already existed by that name.  I've changed it to "Calculator Gator" to disambiguate the names and because it is easier to say.
