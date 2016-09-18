# grouped tasks
make:
	make install
	make test
all:
	make preinstall
	make
	make publish
publish:
 make publish-npm
 make publish-homepage

# tasks
preinstall:
	npm  install -g cnpm --registry=http://registry.npm.taobao.org
install:
	cnpm install
	npm install
test:
publish-homepage:
	git checkout gh-pages && git merge master && git push && git checkout master
publish-npm:
	npm publish
	cnpm sync zfinder

