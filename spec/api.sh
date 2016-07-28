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

printf "\nwrite-file#################################################################################################\n"
curl -u zfinder:awesome -X PUT -d "content=test" -L "http://localhost:9090/_temp/temp.txt?_handler=write-file"
curl -u zfinder:awesome -X PUT -d "content=test" -L "http://localhost:9090/_temp/.temp.log?_handler=write-file"

printf "\ncontent-search#############################################################################################\n"
curl -u zfinder:awesome -X GET -d "q=test" -L "http://localhost:9090/lib?_handler=content-search"

printf "\nglob-search################################################################################################\n"
curl -u zfinder:awesome -X GET -d "q=**.json" -L "http://localhost:9090?_handler=glob-search"

printf "\ndot-previewer##############################################################################################\n"
curl -u zfinder:awesome -X GET -L "http://localhost:9090/spec/fixtures/git.dot?_raw"
curl -u zfinder:awesome -X GET -L "http://localhost:9090/spec/fixtures/git.dot"

printf "\ndot-renderer###############################################################################################\n"
curl -u zfinder:awesome -X GET -d "content=digraph G { main -> parse -> execute; main -> init; main -> cleanup; execute -> make_string; execute -> printf init -> make_string; main -> printf; execute -> compare; }" -L "http://localhost:9090/__HANDLER__/dot-renderer"
curl -u zfinder:awesome -X GET -d "content=digraph G { main -> parse -> execute; main -> init; main -> cleanup; execute -> make_string; execute -> printf init -> make_string; main -> printf; execute -> compare; }" -L "http://localhost:9090?_handler=dot-renderer"

printf "\nmarkdown-previewer#########################################################################################\n"
curl -u zfinder:awesome -X GET -L "http://localhost:9090/spec/fixtures/markdown-it-features.md?_raw"
curl -u zfinder:awesome -X GET -L "http://localhost:9090/spec/fixtures/markdown-it-features.md"

printf "\nmarkdown-renderer##########################################################################################\n"
curl -u zfinder:awesome -X GET -d "content=# h1 Heading 8-)%0A## h2 Heading%0A### h3 Heading%0A#### h4 Heading" -L "http://localhost:9090/__HANDLER__/markdown-renderer"
curl -u zfinder:awesome -X GET -d "content=# h1 Heading 8-)%0A## h2 Heading%0A### h3 Heading%0A#### h4 Heading" -L "http://localhost:9090?_handler=markdown-renderer"

printf "\n"
