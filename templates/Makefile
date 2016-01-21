make:
	make install
	#make compile
	make test
install:
	cnpm install
	npm install
#compile:
	#npm run-script compile
test:
	#make server
	jasmine init && jasmine
publish:
	npm publish
	cnpm sync {%= data.name %}
server:
	sh bin/server.sh
all:
	make
	make publish
