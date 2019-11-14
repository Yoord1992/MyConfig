const GLib = imports.gi.GLib;

var setTimeout = (func, millis) => {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, millis, () => {
        func();

        return false; // Don't repeat
    }, null);
};

var clearTimeout = (id) => {GLib.Source.remove(id);}

var setInterval = (func, millis) => {
    var id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, millis, () => {
        func();

        return true; // Repeat
    }, null);

    return id;
};

var clearInterval = (id) => {GLib.Source.remove(id);}
