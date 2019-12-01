#!/bin/bash

pacman(){
	if grep "[archlinuxcn]" /etc/pacman.conf &>/dev/null;then
		sudo pacman --noconfirm -S yay
	else
		echo "Adding 'http://repo.archlinuxcn.org/$arch' unofficial repository to '/etc/pacman.conf' ..."
		sleep 1
		echo -e "[archlinuxcn]\nServer = http://repo.archlinuxcn.org/$arch" | sudo tee --append /etc/pacman.conf
		sudo pacman -Sy yay
	fi

	sudo pacman --noconfirm -S openshot peek clipgrab ffmpeg xarchiver blender goldendict gparted gnome-tweaks\
               				   tor gimp steam chromium privoxy playonlinux privoxy mpv clamav brasero geary\
               				   handbrake kolourpaint thunar screenfetch unzip  geany telegram-desktop

	yay --noconfirm  -S persepolis gpaint winff kazam fslint xournal oceanaudio anydesk
}

apt(){
	sudo add-apt-repository ppa:clipgrab-team/ppa -y   &>/dev/null
	sudo add-apt-repository ppa:yannubuntu/boot-repair -y   &>/dev/null
	sudo add-apt-repository ppa:peek-developers/stable -y     &>/dev/null
	sudo add-apt-repository ppa:openshot.developers/ppa -y   &>/dev/null
	sudo add-apt-repository ppa:persepolis/ppa -y   &>/dev/null
	sudo apt update -y
	sudo apt install gnome-paint peek clipgrab winff libavcodec-extra xarchiver boot-repair\
					 openshot-qt blender goldendict goldendict-wordnet gparted persepolis\
					 tor gimp steam chromium-browser resolvconf playonlinux privoxy \
					 mpv  clamav clamtk persepolis brasero handbrake kazam kolourpaint4 fslint\
					 xournal thunar screenfetch unzip gnome-tweak-tool geany geary conky aria2\
					 git jcal virtualbox youtube-dl openssh-server torsocks obfs4proxy -y

	sudo dpkg -i --force-all AnyDesk/anydesk.deb
	sudo dpkg -i --force-all ocenaudio/ocenaudio.deb
	unzip telegram/telegram.zip -d telegram/
	chmod +x telegram/Telegram
	telegram/Telegram
}

dnf(){
    # Enabling the Free repository
    sudo dnf install \
    https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm

	# Enabling the Nonfree repository
    sudo dnf install \
    https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

    sudo dnf install -y openshot peek xarchiver blender goldendict gparted tor gimp\
                        steam chromium privoxy playonlinux mpv clamav brasero handbrake\
                        thunar screenfetch unzip gnome-tweaks geany geary telegram-desktop\
                        kolourpaint persepolis gpaint kazam fslint xournal ffmpeg
}

gnome () {
	echo -e " Installing Gnome Extensions ..."
	sleep 1
	unzip extensions/extensions.zip  -d extentions/ &>/dev/null
	rm -rf extensions/extensions.zip
	sudo cp -r extensions/* ~/.local/share/gnome-shell/extensions
}

main(){
	tput reset
  zenity --info --width=600 --height=200 --text "
  Welcome to MyConfig
  Let's make your GNU/Linux easier to use!
  "

	if [ "$EUID" -eq 0 ];then
		echo -e "$(tput setaf 1)WARNING: You are running script as root.Some files will move in your 'root' home directory."
    zenity --question --no-wrap --text "WARNING: You are running script as root.\nSome files will move in your 'root' home directory,do you want to continue?"
    if [ "$?" == 1 ];
      exit -1
    fi
	fi

	# distribution detection

	distro_name=$(hostnamectl | grep "Operating System" | cut -c 21-24)
	declare -A osInfo;
	osInfo[/etc/redhat-release]=dnf
	osInfo[/etc/arch-release]=pacman
	osInfo[/etc/gentoo-release]=emerge
	osInfo[/etc/SuSE-release]=zypp
	osInfo[/etc/debian_version]=apt

	for i in ${!osInfo[@]}
	do
		if [ -f $i ];then
		   distro=${osInfo[$i]}
		fi
	done

	sleep 1
	echo -e "Installing Packages ..."
	case $distro in
			pacman)
				pacman
				;;
			apt)
				apt
				;;
			dnf)
				dnf
				;;
			*)
				echo "Unsupported distribution."
				exit -1
				;;
	esac

	echo -e "Installing Telegram Config ..."
	sleep 1
	cp -r telegram/tpf/.fonts telegram/tpf/.fonts.conf ~/Desktop

	echo -e "Installing Mpv Config ..."
	sleep 1
	cp mpv/.mpv ~/Desktop
	sudo cp -r mpv/confing/* /etc/mpv

	echo -e "Installing Tor Config ..."
	sleep 1
	sudo cp tor/torrc /etc/tor

	echo -e " Resolving DNS Issues ..."
	sleep 1
	sudo mv /etc/resolvconf/resolv.conf.d/head /etc/resolvconf/resolv.conf.d/head.1  &>/dev/null
	sudo cp -r DNS/head /etc/resolvconf/resolv.conf.d/
	sudo resolvconf -u

	echo -e " Installing Newaita Icon ..."
	sleep 1
	unzip icon/Newaita.zip  -d icon/
	sudo cp -r icon/Newaita /usr/share/icons

	echo -e " Copying Music, Picture and Video ..."
	sleep 1
	cp personal/music.mp3 ~/Music
	cp personal/video.mp4 ~/Videos
	cp personal/pic.jpeg ~/Pictures

	sleep 1
	echo -e "done!"
	echo -e "@Yoord"
}

# detecting distribution 

if [ -z "$XDG_CURRENT_DESKTOP" ];then
    desktop=$(echo "$XDG_DATA_DIRS" | sed 's/.*\(xfce\|kde\|gnome\).*/\1/')
else
    desktop=$XDG_CURRENT_DESKTOP
fi

desktop=${desktop,,} # lower case   

if echo "$desktop" | grep "gnome" &>dev/null;then
	gnome 
	main
else 
	main 
fi
