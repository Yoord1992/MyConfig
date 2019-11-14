const Clutter = imports.gi.Clutter;
const Lang = imports.lang;
const St = imports.gi.St;

/**
 * Simplify global signals and function injections handling
 * abstract class
 */
const BasicHandler = new Lang.Class({
    Name: 'PanelTransparency.BasicHandler',

    _init: function() {
        this._storage = new Object();
    },

    add: function(/* unlimited 3-long array arguments */) {
        // Convert arguments object to array, concatenate with generic
        let args = Array.concat('generic', Array.slice(arguments));
        // Call addWithLabel with ags as if they were passed arguments
        this.addWithLabel.apply(this, args);
    },

    destroy: function() {
        for( let label in this._storage )
            this.removeWithLabel(label);
    },

    addWithLabel: function(label /* plus unlimited 3-long array arguments*/) {
        if (this._storage[label] == undefined)
            this._storage[label] = new Array();

        // Skip first element of the arguments
        for (let i = 1; i < arguments.length; i++) {
            this._storage[label].push( this._create(arguments[i]));
        }
    },

    removeWithLabel: function(label) {
        if (this._storage[label]) {
            for (let i = 0; i < this._storage[label].length; i++)
                this._remove(this._storage[label][i]);

            delete this._storage[label];
        }
    },

    // Virtual methods to be implemented by subclass

    /**
     * Create single element to be stored in the storage structure
     */
    _create: function(item) {
        throw new Error('no implementation of _create in ' + this);
    },

    /**
     * Correctly delete single element
     */
    _remove: function(item) {
        throw new Error('no implementation of _remove in ' + this);
    }
});

/**
 * Manage global signals
 */
const GlobalSignalsHandler = new Lang.Class({
    Name: 'PanelTransparency.GlobalSignalHandler',
    Extends: BasicHandler,

    _create: function(item) {
        let object = item[0];
        let event = item[1];
        let callback = item[2]
        let id = object.connect(event, callback);

        return [object, id];
    },

    _remove: function(item) {
         item[0].disconnect(item[1]);
    }
});

/**
 * Manage function injection: both instances and prototype can be overridden
 * and restored
 */
const InjectionsHandler = new Lang.Class({
    Name: 'PanelTransparency.InjectionsHandler',
    Extends: BasicHandler,

    _create: function(item) {
        let object = item[0];
        let name = item[1];
        let injectedFunction = item[2];
        let original = object[name];

        object[name] = injectedFunction;
        return [object, name, injectedFunction, original];
    },

    _remove: function(item) {
        let object = item[0];
        let name = item[1];
        let original = item[3];
        object[name] = original;
    }
});
