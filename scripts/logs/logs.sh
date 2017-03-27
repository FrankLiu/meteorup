#!/bin/bash

# set -x
set -e

## check nvm
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"

. /etc/profile

APPNAME=<%= appName %>

LOGFILE=`pm2 show $APPNAME|grep 'out log path'|awk '{print $6}'`
ERRLOGFILE=`pm2 show $APPNAME|grep 'error log path'|awk '{print $6}'`

FLUSH=<%= flush %>

if [ "$LOGFILE"x == ""x ];then
  echo "Not found logfile: $LOGFILE"
  exit 0
fi

if [ $FLUSH ];then
	pm2 logs -f $APPNAME
else
  pm2 logs $APPNAME --lines 50 --nostream
fi
