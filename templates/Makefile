make:
	make install
	#make compile
	make test
install:
	npm install
#compile:
	#npm run-script compile
test:
	#make server
	npm test
publish:
	npm publish
	cnpm sync {%= name %}
server:
	sh bin/server.sh
all:
	make
	make publish
