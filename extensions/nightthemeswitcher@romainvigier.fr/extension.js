/*
Night Theme Switcher Gnome Shell extension

Copyright (C) 2019 Romain Vigier

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <http s ://www.gnu.org/licenses/>.
*/

'use strict';

const Gio = imports.gi.Gio;

let interface_settings, interface_settings_connect_id;
let nightlight_active;
let original_user_theme, user_theme_day, user_theme_night;
let conn, proxy, proxy_connect_id;


function _connect_dbus_proxy() {
	conn = Gio.bus_get_sync(Gio.BusType.SESSION, null);
	if ( conn === null ) {
		throw new Error('Unable to connect to the session bus');
	}
	proxy = Gio.DBusProxy.new_sync(
		conn,
		Gio.DBusProxyFlags.GET_INVALIDATED_PROPERTIES,
		null,
		'org.gnome.SettingsDaemon.Color',
		'/org/gnome/SettingsDaemon/Color',
		'org.gnome.SettingsDaemon.Color',
		null
	);
	if ( proxy === null ) {
		throw new Error('Unable to create proxy to the session bus');
	}
}

function _get_theme() {
	return interface_settings.get_string('gtk-theme');
}

function _set_theme(theme) {
	if ( theme === _get_theme() ) return;
	interface_settings.set_string('gtk-theme', theme);
}

function _build_theme_variants() {
	if ( original_user_theme.includes('HighContrast') ) {
		user_theme_day = 'HighContrast';
		user_theme_night = 'HighContrastInverse';
	}
	else if ( original_user_theme.match(/Materia.*-compact/g) ) {
		user_theme_day = original_user_theme.replace(/-dark(?!er)/g, '');
		user_theme_night = user_theme_day.replace(/(-light)?-compact/g, '-dark-compact');
	}
	else if ( original_user_theme.includes('Arc') ) {
		user_theme_day = original_user_theme.replace(/-Dark(?!er)/g, '');
		user_theme_night = user_theme_day.replace('-Darker', '') + '-Dark';
	}
	else {
		user_theme_day = original_user_theme.replace(/-dark(?!er)/g, '');
		user_theme_night = user_theme_day.replace(/(-light)?(-darker)?/g, '') + '-dark';
	}
}

function _apply_theme_variant() {
	nightlight_active = proxy.get_cached_property('NightLightActive').get_boolean();
	_set_theme(nightlight_active ? user_theme_night : user_theme_day);
}

function init() {}

function enable() {
	// Store the current user theme and build day and night variants
	interface_settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
	original_user_theme = _get_theme();
	_build_theme_variants();

	// Connect to session bus, listen to Color changes and change theme variant
	try {
		_connect_dbus_proxy();
	}
	catch(e) {
		logError(e);
	}
	proxy_connect_id = proxy.connect('g-properties-changed', _apply_theme_variant);
	_apply_theme_variant();

	// Listen to theme change, don't change if this is the same theme
	interface_settings_connect_id = interface_settings.connect('changed::gtk-theme', () => {
		const new_theme = _get_theme();
		if ( new_theme === user_theme_day || new_theme === user_theme_night ) return;
		original_user_theme = new_theme;
		_build_theme_variants();
		_apply_theme_variant();
	});
}

function disable() {
	if ( proxy && proxy_connect_id ) {
		proxy.disconnect(proxy_connect_id);
	}
	interface_settings.disconnect(interface_settings_connect_id);

	_set_theme(original_user_theme);

	interface_settings = null;
	interface_settings_connect_id = null;
	nightlight_active = null;
	original_user_theme = null;
	user_theme_day = null;
	user_theme_night = null;
	conn = null;
	proxy = null;
	proxy_connect_id = null;
}
