const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

var iconMenuItem;

function init() {
}

function enable() {
    iconMenuItem = new UserIconMenuItem();
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(iconMenuItem);
}

function disable() {
    iconMenuItem.destroy();
}

const { AccountsService, Clutter, GLib, St } = imports.gi;
const { Avatar } = imports.ui.userWidget;

var UserIconMenuItem = class UserIconMenuItem extends PopupMenu.PopupBaseMenuItem {
    constructor() {
        super({
            reactive: false
        });
        var userManager = AccountsService.UserManager.get_default();
        userManager.list_users(); // for some strange reasons, the picture is not loaded withouth this line

        var user = userManager.get_user(GLib.get_user_name());
        var box = new St.BoxLayout({ 
            x_align: Clutter.ActorAlign.CENTER,
        });
        var avatar = new Avatar(user, { 
            iconSize: 100
        });
        avatar.update();
        box.add_child(avatar.actor);

        this.actor.add(box, {
            expand: true
        });
    }
}
