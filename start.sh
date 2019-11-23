#!/bin/bash

if [ "$EUID" -eq 0 ];then
    echo -e "$(tput setaf 1)WARNING: You are running script as root.Some files will move in your 'root' home directory."
    echo -e "$(tput setaf 7)press ENTER to continue or CTRL+C to exit."
    read 
fi

clear
# Print '$title' at the center of the terminal
COLUMNS=$(tput cols) 
title="*******      MyConfig V1      *******"
printf "%*s\n" $(((${#title}+$COLUMNS)/2)) "$title"

sleep 1
echo -e "Installing Apps ..."
sudo add-apt-repository ppa:clipgrab-team/ppa -y   &>/dev/null
sudo add-apt-repository ppa:yannubuntu/boot-repair -y   &>/dev/null
sudo add-apt-repository ppa:peek-developers/stable -y     &>/dev/null
sudo add-apt-repository ppa:openshot.developers/ppa -y   &>/dev/null
sudo add-apt-repository ppa:persepolis/ppa -y   &>/dev/null
sudo apt update -y  
sudo apt install gnome-paint peek clipgrab winff libavcodec-extra xarchiver boot-repair openshot-qt blender goldendict goldendict-wordnet gparted persepolis tor gimp steam chromium-browser resolvconf playonlinux privoxy openshot-qt mpv  clamav clamtk persepolis brasero handbrake kazam kolourpaint4 fslint xarchiver xournal thunar screenfetch xarchiver winff libavcodec-extra unzip  gnome-tweak-tool geany geary -y 

echo -e "Installing Telegram Config ..."
sleep 1
cp -r telegram/tpf/.fonts telegram/tpf/.fonts.conf ~/Desktop  

echo -e "Installing Telegram ..."
sleep 1
unzip telegram/telegram.zip -d telegram/ 
chmod +x telegram/Telegram

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

echo -e " Installing AnyDesk ..."
sleep 1
sudo dpkg -i --force-all AnyDesk/anydesk.deb  

echo -e " Installing ocenaudio ..."
sleep 1
sudo dpkg -i --force-all ocenaudio/ocenaudio.deb

echo -e " Installing Gnome Extensions ..."
sleep 1
unzip extensions/extensions.zip  -d extentions/
rm -rf extensions/extensions.zip 
sudo cp -r extensions/* ~/.local/share/gnome-shell/extensions  

echo -e " Copying Music, Picture and Video ..."
sleep 1
cp personal/music.mp3 ~/Music 
cp personal/video.mp4 ~/Videos  
cp personal/pic.jpeg ~/Pictures   

# Executing Telegram
telegram/Telegram
sleep 1
echo -e "done!"
echo -e "@Yoord"
