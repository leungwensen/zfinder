#!/usr/bin/env bash

printf "make-dir#####################################################################################################\n"
curl -u zfinder:awesome -X POST -L "http://localhost:9090/_temp/temp.md?_handler=make-dir"

printf "\nread-dir###################################################################################################\n"
curl -u zfinder:awesome -X GET -d "newPath=/temp/temp.md" -L "http://localhost:9090?_handler=read-dir"

printf "\nread-file##################################################################################################\n"
curl -u zfinder:awesome -X GET -L "http://localhost:9090/README.md?_handler=read-file"

printf "\nrename-path################################################################################################\n"
curl -u zfinder:awesome -X PUT -d "newPath=test" -L "http://localhost:9090?_handler=rename-path"
curl -u zfinder:awesome -X PUT -d "newPath=_temp/temp" -L "http://localhost:9090/_temp/temp.md?_handler=rename-path"

printf "\nremove-path################################################################################################\n"
curl -u zfinder:awesome -X DELETE -L "http://localhost:9090/_temp/temp?_handler=remove-path"

printf "\write-file##################################################################################################\n"
curl -u zfinder:awesome -X PUT -d "content=test" -L "http://localhost:9090/_temp/temp.txt?_handler=write-file"
curl -u zfinder:awesome -X PUT -d "content=test" -L "http://localhost:9090/_temp/.temp.log?_handler=write-file"

printf "\content-search##############################################################################################\n"
curl -u zfinder:awesome -X GET -d "q=test" -L "http://localhost:9090/lib?_handler=content-search"

printf "\glob-search#################################################################################################\n"
curl -u zfinder:awesome -X GET -d "q=**.json" -L "http://localhost:9090?_handler=glob-search"

printf "\n"
