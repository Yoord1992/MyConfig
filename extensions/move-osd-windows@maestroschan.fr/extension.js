const Main = imports.ui.main;
const OsdWindow = imports.ui.osdWindow;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//------------------------------------------------

function init() {
    Convenience.initTranslations();
}

//------------------------------------------------

function injectToFunction(parent, name, func) {
	let origin = parent[name];
	parent[name] = function() {
		let ret;
		ret = origin.apply(this, arguments);
			if (ret === undefined)
				ret = func.apply(this, arguments);
			return ret;
		}
	return origin;
}

function removeInjection(object, injection, name) {
	if (injection[name] === undefined)
		delete object[name];
	else
		object[name] = injection[name];
}

let injections=[];

//---------------------------------------------

function enable() {
	
	let _settings = Convenience.getSettings('org.gnome.shell.extensions.move-osd-windows');
	
	injections['show'] = injectToFunction(OsdWindow.OsdWindow.prototype, 'show',  function(){
	
		if ( _settings.get_boolean('hide') ){
			this.actor.visible = false;
		} else {
			this.actor.visible = true;
			let monitor = Main.layoutManager.monitors[this._monitorIndex];
			let h_percent = _settings.get_int('horizontal');
			let v_percent = _settings.get_int('vertical');
			
			this._box.translation_x = h_percent * monitor.width / 100;
			this._box.translation_y = v_percent * monitor.height / 100;
		}
	});
}

function disable() {
	
	let arrayOSD = Main.osdWindowManager._osdWindows;
	
	for (let i = 0; i < arrayOSD.length; i++) {
		arrayOSD[i]._relayout();
		arrayOSD[i]._box.translation_x = 0;
	}
	
	removeInjection(OsdWindow.OsdWindow.prototype, injections, 'show');
}

