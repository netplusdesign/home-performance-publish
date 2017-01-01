#!/bin/bash

# ./mysqld.sh status
# ./mysqld.sh start
# ./mysqld.sh stop
# ./mysqld.sh list /location/file.sql.gz
# ./mysqld.sh backup database_name password /tmp/fielename_date.sql.gz
# ./mysqld.sh restore database_name password /tmp/fielename_date.sql.gz

alias mysql=/usr/local/mysql/bin/mysql
alias mysqladmin=/usr/local/mysql/bin/mysqladmin

function listbackup() {
  ls -tlhT $1 | head -1 | colrm 1 32
}

if [ "$1" = "status" ] || [ "$#" = 0 ]
then

  if ps | grep -v grep | grep bin/mysqld > /dev/null
  then
    echo Running
  else
    echo Stopped
  fi

fi

if [ "$1" = "start" ]
then

  if ps | grep -v grep | grep bin/mysqld > /dev/null
  then
    echo Already running
  else
    #echo "start database"
    /usr/local/mysql/bin/mysqld
  fi
  # echo Running

fi

if [ "$1" = "stop" ]
then

  if ps | grep -v grep | grep bin/mysqld > /dev/null
  then
    # stop server
    /usr/local/mysql/bin/mysqladmin -u root --password= shutdown
  fi
  echo Stopped

fi

if [ "$1" = "list" ]
then
  listbackup "$2"
fi

if [ "$1" = "backup" ]
then

  if ps | grep -v grep | grep bin/mysqld > /dev/null
  then
    /usr/local/mysql/bin/mysqldump -u larry -p$3 $2 | gzip -9 > $4
    listbackup "$2"
  else
    echo Start database first
  fi

fi

if [ "$1" = "restore" ]
then

  if ps | grep -v grep | grep bin/mysqld > /dev/null
  then
    gunzip < $4 | /usr/local/mysql/bin/mysql -u larry -p$3 $2
    echo Restore complete
  else
    echo Start database first
  fi

fi
