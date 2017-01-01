#!/bin/bash

# runs python upload script
# Usage
# make sure to set SIMPLE_SETTINGS before running.
#export SIMPLE_SETTINGS=settings_test or settings_prod

# ./upload_data.sh /location/app/ /location/batch.json start_date end_date test|prod

filename=`basename $2 .json`
fpath=`dirname $2`

cd $1

. env/bin/activate

echo Starting update...

python uploaddata.py -fse $2 $3 $4 | tee $fpath/upload_$5_$filename.txt

deactivate
