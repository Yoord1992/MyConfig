const Lang = imports.lang;
const Meta = imports.gi.Meta;
const St = imports.gi.St;

const Main = imports.ui.main;
const Panel = Main.panel;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Utils = Me.imports.utils;

const PanelTransparency = new Lang.Class({
    Name: 'PanelTransparency',

    _init: function() {
        this.actor = Panel.actor;

        this._signalsHandler = new Utils.GlobalSignalsHandler();
        this._trackedWindows = new Map();

//        this.dashToPanelExtension = ExtensionUtils.extensions['dash-to-panel@jderose9.github.com'];

        Panel._addStyleClassName('transparent');
        this.enable();

    },

    enable: function() {
//        if (this.dashToPanelExtension &&
//            this.dashToPanelExtension.state == ExtensionSystem.ExtensionState.ENABLED) {
//
//        }

        this._signalsHandler.removeWithLabel('transparency');

        this._signalsHandler.addWithLabel('transparency', [
            Main.overview,
            'showing',
            Lang.bind(this, this._updateSolidStyle)
        ], [
            Main.overview,
            'hiding',
            Lang.bind(this, this._updateSolidStyle)
        ], [
            global.window_group,
            'actor-added',
            Lang.bind(this, this._onWindowActorAdded)
        ], [
            global.window_group,
            'actor-removed',
            Lang.bind(this, this._onWindowActorRemoved)
        ], [
            global.window_manager,
            'switch-workspace',
            Lang.bind(this, this._updateSolidStyle)
        ]);

        global.get_window_actors().forEach(function(win) {
            if (win.get_meta_window().get_wm_class() !== 'Gnome-shell')
                this._onWindowActorAdded(null, win);
        }, this);

        this._updateSolidStyle();
    },

    _onWindowActorAdded: function(container, metaWindowActor) {
        let signalIds = [];
        ['allocation-changed', 'notify::visible'].forEach(s => {
            signalIds.push(metaWindowActor.connect(s, Lang.bind(this, this._updateSolidStyle)));
        });
        this._trackedWindows.set(metaWindowActor, signalIds);
    },

    _onWindowActorRemoved: function(container, metaWindowActor) {
        this._trackedWindows.get(metaWindowActor).forEach(id => {
            metaWindowActor.disconnect(id);
        });
        this._trackedWindows.delete(metaWindowActor);
        this._updateSolidStyle();
    },

    _updateSolidStyle: function() {
        if (this.actor.has_style_pseudo_class('overview') || !Main.sessionMode.hasWindows) {
            Panel._removeStyleClassName('solid');
            return;
        }

        /* Get all the windows in the active workspace that are in the primary monitor and visible */
        let activeWorkspace = global.screen.get_active_workspace();
        let windows = activeWorkspace.list_windows().filter(function(metaWindow) {
            return metaWindow.is_on_primary_monitor() &&
                   metaWindow.showing_on_its_workspace() &&
                   metaWindow.get_window_type() != Meta.WindowType.DESKTOP;
        });

        /* Check if at least one window is near enough to the panel */
        let [, panelTop] = this.actor.get_transformed_position();
        let panelBottom = panelTop + this.actor.get_height();
        let atBottom = false;
        if (panelBottom > Main.layoutManager.primaryMonitor.height/2) {
            atBottom = true;
        }
        let scale = St.ThemeContext.get_for_stage(global.stage).scale_factor;
        let isNearEnough = windows.some(Lang.bind(this, function(metaWindow) {
            if (atBottom) {
                let verticalPosition = metaWindow.get_frame_rect().y + metaWindow.get_frame_rect().height;
                return verticalPosition > panelTop - 5 * scale;
            } else {
                let verticalPosition = metaWindow.get_frame_rect().y;
                return verticalPosition < panelBottom + 5 * scale;
            }
        }));

        if (isNearEnough)
            Panel._addStyleClassName('solid');
        else
            Panel._removeStyleClassName('solid');
    },

    destroy: function() {
        this._signalsHandler.removeWithLabel('transparency');

        if (this._trackedWindows) {
            for (let key of this._trackedWindows.keys())
                this._trackedWindows.get(key).forEach(id => {
                    key.disconnect(id);
                });
            this._trackedWindows.clear();
        }

        this._signalsHandler.destroy();

        Panel._removeStyleClassName('solid');
        Panel._removeStyleClassName('transparent');
    }
});
