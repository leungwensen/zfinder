#!/bin/bash
#usage:
#    ./update-repo.sh $path-of-repo

cd $1
#git config user.name "wensen.lws" #example
git stash #stash local changes!
git pull

