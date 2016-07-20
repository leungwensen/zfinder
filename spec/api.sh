#!/usr/bin/env bash

curl -u zfinder:awesome -X POST                              -L "http://localhost:9090/_temp/temp.md?_handler=make-dir"
curl -u zfinder:awesome -X GET    -d "newPath=/temp/temp.md" -L "http://localhost:9090?_handler=read-dir"
curl -u zfinder:awesome -X PUT    -d "newPath=test"          -L "http://localhost:9090?_handler=rename-path"
curl -u zfinder:awesome -X PUT    -d "newPath=_temp/temp"    -L "http://localhost:9090/_temp/temp.md?_handler=rename-path"
curl -u zfinder:awesome -X DELETE                            -L "http://localhost:9090/_temp/temp?_handler=remove-path"

