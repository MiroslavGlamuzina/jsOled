
# jsOled (Raspberry Pi)


## Etcher -  Flash Raspbian image (LITE) 
  - run: `sudo raspi-config` and:
  - go to network options to setup wifi
  - Go to interfacing options and setup i2c
  - update config button

run: `sudo update apt update & sudo apt upgrade`
run: `sudo apt install git`

## Install node: 
```
wget https://nodejs.org/dist/v8.16.1/node-v8.16.1-linux-armv6l.tar.gz
tar -xzf node-v8.16.1-linux-armv6l.tar.gz
cd node-v8.16.1-linux-armv6l/
sudo cp -R * /usr/local/
```
check with: node -v , npm -v 


## Install PM2  & add to PM2 (Run everything as sudo)

https://stackoverflow.com/questions/31579509/can-pm2-run-an-npm-start-script
```
pm2 start "npm -- start" --name back --watch
```

Run these commands: https://stackoverflow.com/a/54193188/5066625

Add this to the service file: https://stackoverflow.com/a/44737570/5066625
(Should be somewhere here: `sudo nano /etc/systemd/system/pm2-root.service`)


Note: 

IF USING SUDO (PM2)
Add authorized keys (`ssh-keygen`) for ROOT user 
