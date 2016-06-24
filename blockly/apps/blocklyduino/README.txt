BlocklyDuino (Zumo32U4)
=======================

Introduction
-----------------

BlocklyDuino is based on Blockly, the web-based, graphical programming editor. Provide language blocks and code generators for arduino programming.

BlocklyDuino also support Grove blocks to easily get started with microcontroller-based experimentation and learning.

This version of BlocklyDuino is custom built to use on Zumo32U4 sumo robot from Pololu. This allows easy interaction with onboard hardwares.


* Blockly https://developers.google.com/blockly/
* Arduino http://www.arduino.cc/
* Grove http://www.seeedstudio.com/wiki/GROVE_-_Starter_Kit_V1.1b
* Zumo 32U4 robot https://www.pololu.com/category/170/zumo-32u4-robot

Install
-----------------

BlocklyDuino is a web tool. You can give it a try at http://www.gasolin.idv.tw/public/blockly/demos/blocklyduino/index.html .

If you want to install it locally. Checkout Blockly and BlocklyDuino from github.

$ git clone https://github.com/taipan541/BlocklyDuino.git


Put blockly into a web server and open the url like localhost/public/blockly/demos/blocklyduino/index.html for use.

Usage (3 Step)
-----------------

1. Open browser to BlocklyDuino, Drag and Drop blocks to make arduino program.
2. Select 'Arduino' tab to copy source code to Arduino IDE
3. press 'upload' button to burn the code into arduino

Credit
-----------------

Fred Lin is the creator of BlocklyDuino. This version of BlocklyDuino is an extended version created by taipan541.

Thanks Neil Fraser, Q.Neutron from Blockly http://code.google.com/p/blockly/
Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is inspired by arduiblock https://github.com/taweili/ardublock and modkit http://www.modk.it/

License
-----------------
Copyright (C) 2012 Fred Lin gasolin+arduino@gmail.com

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
