#!/usr/bin/env bash

# mkdir
curl -u zfinder:awesome -X POST "http://localhost:9090/_temp/temp.md?_handler=mkdir"

# readdir
curl -u zfinder:awesome "http://localhost:9090?_handler=readdir&newPath=/temp/temp.md"

# rename
curl -u zfinder:awesome -X PUT -d "newPath=test" "http://localhost:9090?_handler=rename"
curl -u zfinder:awesome -X PUT -d "newPath=_temp/temp" "http://localhost:9090/_temp/temp.md?_handler=rename"

# rmdir
curl -u zfinder:awesome -X DELETE "http://localhost:9090/_temp/temp?_handler=rmdir"
