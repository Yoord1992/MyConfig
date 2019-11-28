#!/bin/bash

# Flag for is_gnome or not
FLAG=true 
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
	# Print '$title' at the center of the terminal
	COLUMNS=$(tput cols) 
	title="*******      MyConfig    V1.1 Beta      *******"
	printf "%*s\n" $(((${#title}+$COLUMNS)/2)) "$title"	
	if [ "$EUID" -eq 0 ];then
		echo -e "$(tput setaf 1)WARNING: You are running script as root.Some files will move in your 'root' home directory."
		echo -e "$(tput setaf 7)press ENTER to continue or CTRL+C to exit."
		read 
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

	if [ "$FLAG" = true ];then
		gnome

	echo -e " Copying Music, Picture and Video ..."
	sleep 1
	cp personal/music.mp3 ~/Music 
	cp personal/video.mp4 ~/Videos  
	cp personal/pic.jpeg ~/Pictures   

	sleep 1
	echo -e "done!"
	echo -e "@Yoord"
}

if [ ! -d "/usr/share/gnome" ];then
	echo "$(tput setaf 2)ERROR: You are not using GNOME desktop environment."
	FLAG=false
	read -p "Do you want to install apps and simple Configs (y/n): " answer	
	if [ $answer != "y" -a $answer != "Y" ];then 
		exit -1
	else 
		main  
fi
