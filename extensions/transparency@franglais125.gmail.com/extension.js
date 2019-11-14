const Me = imports.misc.extensionUtils.getCurrentExtension();
const Transparency = Me.imports.transparency;

let panelTransparency;

function init() {
}

function enable() {
    panelTransparency = new Transparency.PanelTransparency();
}

function disable() {
    panelTransparency.destroy();
    panelTransparency = null;
}
