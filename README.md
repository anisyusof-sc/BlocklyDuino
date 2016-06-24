### Welcome to BlocklyDuino

BlocklyDuino is a **web-based visual programming editor for [Arduino](http://www.arduino.cc/)**.

BlocklyDuino is based on [Blockly](https://developers.google.com/blockly/), the web-based, graphical programming editor. Provide static type language blocks and code generators for Arduino programming.

BlocklyDuino also support [Grove](http://www.seeedstudio.com/wiki/GROVE_System) blocks to easily get started with microcontroller-based experimentation and learning.

This version of BlocklyDuino is custom built to use on [Zumo32U4](https://www.pololu.com/category/170/zumo-32u4-robot) sumo robot from Pololu. This allows easy interaction with onboard hardwares.

### Features

* Programming Arduino with visually drag and drop code blocks
* Generate fully compatible Arduino source code
* Interactive Arduino board with 10+ predefined Grove sensor blocks
* Load different on-site examples with url parameters
* Drag and drop blocks for Zumo 32U4 Robot

### Demo
-

### Run locally on your web browser

If you want to install it locally. Get code from github and open `blockly/apps/blocklyduino/index.html` in your browser.

The preffered way is to put the BlocklyDuino/web folder into a web server and open the url like localhost/public/blockly/apps/blocklyduino/index.html for use.

### Integrated Arduino upload

To avoid the tedious step of manually pasting code to the Arduino IDE, you can run a mini webserver that uses
the [Arduino IDE](https://www.arduino.cc/en/Main/Software) to upload the code to a connected Arduino board on Windows, Mac OS X and Linux systems.
Invoke this command from the BlocklyDuino root folder:

```
python arduino_web_server.py
```

You can optionally specify the port with `--port=COM3` (or `--port=/dev/tty.foo` on Linux and Mac); if you don't, it will try and guess which port to use.

When the webserver is running, you can access BlocklyDuino itself on [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

### Usage

1. Open browser to BlocklyDuino, drag and drop blocks to make an Arduino program
2. Select the 'Arduino' tab and copy all of the source code into an existing or new project in the Arduino IDE
3. Press the 'Upload' button in the Arduino IDE to burn the code into a connected Arduino board

OR (if running `ino_web_server.py`):

1. Open browser to BlocklyDuino, drag and drop blocks to make an Arduino program.
2. Select the 'Arduino' tab and press the 'Upload' button. (press the 'Reset' button to upload an empty program)

### Authors and Contributors
Fred Lin (@gasolin)
@taipan541

Thanks Neil Fraser, Q.Neutron from Blockly https://developers.google.com/blockly/
Thanks Dale Low (gumbypp) for contribute the python server to pipe BlocklyDuino source to arduino board.
Thanks Arduino and Seeeduino guys for Arduino and Grove blocks.

The project is also inspired by [arduiblock](https://github.com/taweili/ardublock) and [modkit](http://www.modk.it/)

### License

Copyright (C) 2012~2016
Original Developer: Fred Lin gasolin+blockly@gmail.com
Extension Developer: taipan541

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
