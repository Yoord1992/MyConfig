
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('move-osd-windows');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//-----------------------------------------------

function init() {
    Convenience.initTranslations();
}

//-----------------------------------------------

const OSDSettingsWidget = new GObject.Class({
    Name: 'OSD.Prefs.Widget',
    GTypeName: 'OSDPrefsWidget',
    Extends: Gtk.Box,

    _init: function(params) {
		this.parent(params);
        this.margin = 30;
        this.spacing = 25;
        this.fill = true;
        this.set_orientation(Gtk.Orientation.VERTICAL);

		this.SETTINGS = Convenience.getSettings('org.gnome.shell.extensions.move-osd-windows');
		
		let labelHorizontalPercentage = _("Horizontal position (percentage) :");
		
		let horizontalPercentage = new Gtk.SpinButton();
        horizontalPercentage.set_sensitive(true);
        horizontalPercentage.set_range(-60, 60);
		horizontalPercentage.set_value(0);
        horizontalPercentage.set_value(this.SETTINGS.get_int('horizontal'));
        horizontalPercentage.set_increments(1, 2);
        
		horizontalPercentage.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this.SETTINGS.set_int('horizontal', value);
		}));
		
		let hBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 15 });
		hBox.pack_start(new Gtk.Label({ label: labelHorizontalPercentage, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		hBox.pack_end(horizontalPercentage, false, false, 0);
		this.add(hBox);
		
		//-------------------------------------------------------
		
		let labelVerticalPercentage = _("Vertical position (percentage) :");
		
		let verticalPercentage = new Gtk.SpinButton();
        verticalPercentage.set_sensitive(true);
        verticalPercentage.set_range(-110, 110);
		verticalPercentage.set_value(70);
		verticalPercentage.set_value(this.SETTINGS.get_int('vertical'));
        verticalPercentage.set_increments(1, 2);
        
		verticalPercentage.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this.SETTINGS.set_int('vertical', value);
		}));
		
		let vBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 15 });
		vBox.pack_start(new Gtk.Label({ label: labelVerticalPercentage, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		vBox.pack_end(verticalPercentage, false, false, 0);
		this.add(vBox);
		
		//-------------------------------------------------------
		
		let labelHide = _("Hide totally OSD windows :");
		
		let HideSwitch = new Gtk.Switch();
	    HideSwitch.set_state(false);
		HideSwitch.set_state(this.SETTINGS.get_boolean('hide'));
        
		HideSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			if (widget.active) {
				this.SETTINGS.set_boolean('hide', true);
			} else {
				this.SETTINGS.set_boolean('hide', false);
			}
		}));
		
		let hideBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 15 });
		hideBox.pack_start(new Gtk.Label({ label: labelHide, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		hideBox.pack_end(HideSwitch, false, false, 0);
		this.add(hideBox);
	}
});

//-----------------------------------------------

//I guess this is like the "enable" in extension.js : something called each
//time he user try to access the settings' window
function buildPrefsWidget() {
    let widget = new OSDSettingsWidget();
    widget.show_all();

    return widget;
}
