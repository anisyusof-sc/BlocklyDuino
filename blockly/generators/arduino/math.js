/**
* Visual Blocks Language
*
* Copyright 2012 Google Inc.
* http://blockly.googlecode.com/
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
* @fileoverview Generating Arduino for math blocks.
* @author gasolin@gmail.com  (Fred Lin)
*/
'use strict';

goog.provide('Blockly.Arduino.math');

goog.require('Blockly.Arduino');


Blockly.Arduino.math_number = function() {
	// Numeric value.
	var code = window.parseFloat(this.getFieldValue('NUM'));
	// -4.abs() returns -4 in Dart due to strange order of operation choices.
	// -4 is actually an operator and a number.  Reflect this in the order.
	var order = code < 0 ?
	Blockly.Arduino.ORDER_UNARY_PREFIX : Blockly.Arduino.ORDER_ATOMIC;
	return [code, order];
};

Blockly.Arduino.math_arithmetic = function() {
	// Basic arithmetic operators, and power.
	var mode = this.getFieldValue('OP');
	var tuple = Blockly.Arduino.math_arithmetic.OPERATORS[mode];
	var operator = tuple[0];
	var order = tuple[1];
	var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
	var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
	var code;
	if (!operator) {
		code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
		return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
	}
	code = argument0 + operator + argument1;
	return [code, order];
};

Blockly.Arduino.math_arithmetic.OPERATORS = {
	ADD: [' + ', Blockly.Arduino.ORDER_ADDITIVE],
	MINUS: [' - ', Blockly.Arduino.ORDER_ADDITIVE],
	MULTIPLY: [' * ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
	DIVIDE: [' / ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
	POWER: [null, Blockly.Arduino.ORDER_NONE]  // Handle power separately.
};

Blockly.Arduino['math_single'] = function(block) {
	// Math operators with single operand.
	var operator = block.getFieldValue('OP');
	var code;
	var arg = Blockly.Arduino.valueToCode(block, 'NUM',
	Blockly.Arduino.ORDER_NONE) || '0';

	Blockly.Arduino.addInclude('math', '#include <math.h>');
	// First, handle cases which generate values that don't need parentheses
	// wrapping the code.
	switch (operator) {
	case 'ROOT':
		code = 'sqrt(' + arg + ')';
		break;
	case 'ABS':
		code = 'abs(' + arg + ')';
		break;
	case 'NEG':
		code = arg * -1;
		break;
	case 'LN':
		code = 'log(' + arg + ')';
		break;
	case 'LOG10':
		code = 'log10(' + arg + ')';
		break;
	case 'EXP':
		code = 'pow(M_E, ' + arg + ')';
		break;
	case 'POW10':
		code = 'pow(10, ' + arg + ')';
		break;
	}
	return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['math_trig'] = function(block) {
	// Math operators with single operand.
	var operator = block.getFieldValue('OP');
	var code;
	var arg = Blockly.Arduino.valueToCode(block, 'NUM',
	Blockly.Arduino.ORDER_NONE) || '1';

	Blockly.Arduino.addInclude('math', '#include <math.h>');
	// First, handle cases which generate values that don't need parentheses
	// wrapping the code.
	switch (operator) {
	case 'SIN':
		code = 'sin(' + arg + ')';
		break;
	case 'COS':
		code = 'cos(' + arg + ')';
		break;
	case 'TAN':
		code = 'tan(' + arg + ')';
		break;
	case 'ASIN':
		code = 'asin(' + arg + ')';
		break;
	case 'ACOS':
		code = 'acos(' + arg + ')';
		break;
	case 'ATAN':
		code = 'atan(' + arg + ')';
		break;
	}
	return [code, Blockly.Arduino.ORDER_NONE];
};


/**
 * Generator for math constants (PI, E, sqrt(2), 1/sqrt(2), INFINITY).
 * Arduino code: loop { constant }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['math_constant'] = function(block) {
	// Math operators with single operand.
	var constant = block.getFieldValue('CONSTANT');
	var code;
	
	Blockly.Arduino.addInclude('math', '#include <math.h>');
	
	switch (constant) {
	case 'PI':
		code = 'M_PI';
		return ['M_PI', Blockly.Arduino.ORDER_UNARY_POSTFIX];
	case 'E':
		code = 'M_E';
		return ['M_E', Blockly.Arduino.ORDER_UNARY_POSTFIX];
	case 'SQRT2':
		code = 'sqrt(2)';
		return ['M_SQRT2', Blockly.Arduino.ORDER_UNARY_POSTFIX];
	case 'SQRT1_2':
		code = 'sqrt(1/2)';
		return ['M_SQRT1_2', Blockly.Arduino.ORDER_UNARY_POSTFIX];
	case 'INFINITY':
		code = 'INFINITY';
		return ['INFINITY', Blockly.Arduino.ORDER_ATOMIC];
	}
};

/**
 * Generator for math checks: if a number is even, odd, prime, whole, positive,
 * negative, or if it is divisible by certain number. Returns true or false.
 * Arduino code: complex code, can create external functions.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['math_number_property'] = function(block) {
  var number_to_check = Blockly.Arduino.valueToCode(block, 'NUMBER_TO_CHECK',
      Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    var func = [
        '\n\n' +
		'boolean ' + Blockly.Arduino.DEF_FUNC_NAME + '(int n) {',
        '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
        '  if (n == 2 || n == 3) {',
        '    return true;',
        '  }',
        '  // False if n is NaN, negative, is 1.',
        '  // And false if n is divisible by 2 or 3.',
        '  if (isnan(n) || (n <= 1) || (n == 1) || (n % 2 == 0) || ' +
            '(n % 3 == 0)) {',
        '    return false;',
        '  }',
        '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
        '  for (int x = 6; x <= sqrt(n) + 1; x += 6) {',
        '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
        '      return false;',
        '    }',
        '  }',
        '  return true;',
        '}'];
    var funcName = Blockly.Arduino.addFunction('mathIsPrime', func.join('\n'));
    Blockly.Arduino.addInclude('math', '#include <math.h>');
    code = funcName + '(' + number_to_check + ')';
    return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      Blockly.Arduino.addInclude('math', '#include <math.h>');
      code = '(floor(' + number_to_check + ') == ' + number_to_check + ')';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.Arduino.valueToCode(block, 'DIVISOR',
          Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.Arduino.ORDER_EQUALITY];
};

/**
 * Generator to add (Y) to a variable (X).
 * If variable X has not been declared before this block it will be declared as
 * a (not initialised) global int, however globals are 0 initialised in C/C++.
 * Arduino code: loop { X += Y; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['math_change'] = function(block) {
  var argument0 = Blockly.Arduino.valueToCode(block, 'DELTA',
      Blockly.Arduino.ORDER_ADDITIVE) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' += ' + argument0 + ';\n';
};

Blockly.Arduino['math_round'] = function(block) {
	// Math operators with round operand.
	var operator = block.getFieldValue('OP');
	var code;
	var arg = Blockly.Arduino.valueToCode(block, 'NUM',
	Blockly.Arduino.ORDER_NONE) || '0';

	Blockly.Arduino.addInclude('math', '#include <math.h>');
	switch (operator) {
	case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'floor(' + arg + ')';
      break;
	}
	return [code, Blockly.Arduino.ORDER_NONE];
};

/**
 * Generator for the math function to a list.
 * Arduino code: ???
 * TODO: List have to be implemented first. Removed from toolbox for now.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['math_on_list'] = Blockly.Arduino.noGeneratorCodeInline;

/**
 * Generator for the math modulo function (calculates remainder of X/Y).
 * Arduino code: loop { X % Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['math_modulo'] = function(block) {
  var argument0 = Blockly.Arduino.valueToCode(block, 'DIVIDEND',
      Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.Arduino.valueToCode(block, 'DIVISOR',
      Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
};
