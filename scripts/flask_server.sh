#!/bin/bash

# ./flask_server.sh status for status
# ./flask_server.sh start flask/app/folder/ /my_path/flask_default_settings.cfg
# ./flask_server.sh stop

# Start Flask server at http://127.0.0.1:5000/

if [ "$1" = "status" ] || [ "$#" = 0 ]
then

  #if [ "$(ps | grep -c run.py)" -lt 2 ]
  if ps | grep -v grep | grep run.py > /dev/null
  then
    echo Running
  else
    echo Stopped
  fi

fi

if [ "$1" = "start" ]
then

  if ! ps | grep -v grep | grep run.py > /dev/null
  then
      #echo "start server"
      cd $2
      . env/bin/activate
      export HOMEPERFORMANCE_SETTINGS=$3
      python run.py
  fi

  echo Running

fi

if [ "$1" = "stop" ]
then

  if ps | grep -v grep | grep run.py > /dev/null
  then
    # stop server
    pkill -f run.py
  fi

  echo Stopped

fi
