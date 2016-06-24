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
	Blockly.Arduino.ORDER_NONE) || '1';

	Blockly.Arduino.definitions_['define_math'] = '#include <math.h>\n';
	// First, handle cases which generate values that don't need parentheses
	// wrapping the code.
	switch (operator) {
	case 'ROOT':
		code = 'sqrt(' + arg + ')';
		break;
	case 'ABS':
		code = 'fabs(' + arg + ')';
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

	Blockly.Arduino.definitions_['define_math'] = '#include <math.h>\n';
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

Blockly.Arduino['math_constant'] = function(block) {
	// Math operators with single operand.
	var constant = block.getFieldValue('CONSTANT');
	var code;
	
	Blockly.Arduino.definitions_['define_math'] = '#include <math.h>\n';
	
	switch (constant) {
	case 'PI':
		code = 'M_PI';
		break;
	case 'E':
		code = 'M_E';
		break;
	case 'SQRT2':
		code = 'sqrt(2)';
		break;
	case 'SQRT1_2':
		code = 'sqrt(1/2)';
		break;
	case 'INFINITY':
		code = 'INFINITY';
		break;
	}
	return code;
};