const GLib = imports.gi.GLib;
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Lang = imports.lang;
const Gio = imports.gi.Gio;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const Gettext = imports.gettext.domain("gnome-shell-extensions");
const _ = Gettext.gettext;

/*const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();*/


const DESKTOP_MENU_LABEL = "Desktop";


const DesktopFolder = new Lang.Class({
    Name: "DesktopFolder",
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, _(DESKTOP_MENU_LABEL));

        let label = new St.Label({
            text: _(DESKTOP_MENU_LABEL),
            y_expand: false,
            y_align: Clutter.ActorAlign.CENTER
        });

        this.actor.add_child(label);

        let path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DESKTOP);
        this.file = Gio.File.new_for_path(path);
    },

    _onEvent: function(actor, event) {
        this.parent(actor, event);

        if (event.type() == Clutter.EventType.TOUCH_END ||
            event.type() == Clutter.EventType.BUTTON_RELEASE) {
            try {
                let context = global.create_app_launch_context(event.get_time(), -1);
                Gio.AppInfo.launch_default_for_uri(this.file.get_uri(), context);
            } catch(e) {
                Main.notifyError(_("Failed to launch desktop folder."), e.message);
            }
        }

        return Clutter.EVENT_PROPAGATE;
    },

    destroy: function() {
        this.parent();
    },
});

/**
 * Gnome Shell function
 */

let _desktop_folder;

function init() {
}

function enable() {
    _desktop_folder = new DesktopFolder;
    let pos = 1;
    if ('apps-menu' in Main.panel.statusArea) {
        pos = 2;
    }
    Main.panel.addToStatusArea('desktop-folder', _desktop_folder, pos, 'left');
}

function disable() {
    _desktop_folder.destroy();
}