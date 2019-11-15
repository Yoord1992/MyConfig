#!/bin/bash

clear
echo " *******      Yoord Config V1      *******"

sleep 3

clear
sudo apt autoremove  &>/dev/null
clear
echo -e "Installing Apps ..."
sudo add-apt-repository ppa:clipgrab-team/ppa -y   &>/dev/null
sudo add-apt-repository ppa:yannubuntu/boot-repair -y   &>/dev/null
sudo add-apt-repository ppa:peek-developers/stable -y     &>/dev/null
sudo add-apt-repository ppa:openshot.developers/ppa -y   &>/dev/null
sudo add-apt-repository ppa:persepolis/ppa -y   &>/dev/null
sudo apt install gnome-paint peek clipgrab winff libavcodec-extra xarchiver boot-repair openshot-qt blender goldendict goldendict-wordnet gparted persepolis tor gimp steam chromium-browser resolvconf playonlinux privoxy openshot-qt mpv  clamav clamtk persepolis brasero handbrake kazam kolourpaint4 fslint xarchiver xournal thunar screenfetch xarchiver winff libavcodec-extra unzip  gnome-tweak-tool geany geary -y  &>/dev/null
clear

echo -e "Installing Telegram Config ..."
sleep 2
cd telegram/tpf
cp -r .fonts .fonts.conf ~/Desktop  &>/dev/null
cd ..
cd ..

clear
echo -e "Installing Telegram ..."
sleep 2
cd telegram 
unzip telegram.zip   &>/dev/null
cd Telegram
chmod +x ./Telegram    &>/dev/null

cd ..
cd ..
clear

echo -e "Installing Mpv Config ..."
sleep 2
cd mpv
cp .mpv ~/Desktop &>/dev/null
cd confing
sudo cp -r * /etc/mpv  &>/dev/null
cd .. 

clear
echo -e "Installing Tor Config ..."
sleep 2
cd tor
sudo cp -r torrc /etc/tor &>/dev/null 
cd ..
clear

echo -e " Resolving DNS Issues ..."
sleep 2
cd DNS
sudo mv /etc/resolvconf/resolv.conf.d/head /etc/resolvconf/resolv.conf.d/head.1  &>/dev/null
sudo cp -r head /etc/resolvconf/resolv.conf.d/   &>/dev/null
sudo resolvconf -u   &>/dev/null
cd ..
clear

echo -e " Installing Newaita Icon ..."
sleep 3
cd icon
unzip Newaita.zip  &>/dev/null
sudo cp -r Newaita /usr/share/icons  &>/dev/null
cd ..
clear

echo -e " Installing AnyDesk ..."
sleep 3
cd AnyDesk
sudo dpkg -i --force-all anydesk.deb  &>/dev/null
cd ..
clear

echo -e " Installing ocenaudio ..."
sleep 3
cd ocenaudio
sudo dpkg -i --force-all ocenaudio.deb  &>/dev/null
cd ..
clear

echo -e " Installing Gnome Extensions ..."
sleep 3
cd extensions
sudo cp -r * ~/.local/share/gnome-shell/extensions  &>/dev/null
cd ..
clear


echo -e " Copying Music, Picture and Video ..."
sleep 3
cd personal
cp music.mp3 ~/Music &>/dev/null
cp video.mp4 ~/Videos  &>/dev/null
cp pic.jpeg ~/Pictures   &>/dev/null
cd ..
clear


cd telegram
cd Telegram
./Telegram  
sleep 1
echo -e "done!"
echo -e "@Yoord"
