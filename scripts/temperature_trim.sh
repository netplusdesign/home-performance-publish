#!/bin/bash

# Trims all files that have the first argument in the file name with the extension csv

# Example:
# ./temperature_trim.sh /path/to/source/ /path/to/target/ 2016-10-12 'Plot 2016-10 2016-11 2016-12'

echo "Trimming dates outside range..."

cd $1

for i in $(ls *$3.csv)
do
  echo Trimming $i
  for j in $4
  do
    grep -e $j $i >> $2$i.bak
  done
done

cd ~

echo Done

exit 0
