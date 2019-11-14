# Gnome Desktop Icons Enhanced
Adds icons to the desktop.

This extension source code can be found at:
https://gitlab.gnome.org/jfrei/org.gnome.desktop-icons

This extension is based on the following work of Carlos Soriano:
https://gitlab.gnome.org/csoriano/org.gnome.desktop-icons

The following work of Satyajit Sahoo (https://github.com/satya164) was used:
https://github.com/satya164/gjs-helpers/blob/master/src/timing.js

This version adds clipboard support (copy/paste), desktop directory monitoring, property window handling, open support, double click support, support for .desktop icons, support for .desktop launch actions and delayed update rendering support.

For clipboard support, precompiled binaries (x86_64) are used as the JS API has missing clipboard features. These binaries can be compiled by executing the buildExecutables.sh script.

## THIS EXTENSION MAY USE PRECOMPILED BINARIES! IT IS RECOMMENDED TO  COMPILE THESE BINARIES BY YOURSELF!