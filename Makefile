
# grouped tasks
make:
	make install
	make test
all:
	make preinstall
	make
	make publish

# tasks
preinstall:
	npm  install -g cnpm --registry=http://registry.npm.taobao.org
install:
	cnpm install
	npm install
test:
	jasmine init
	jasmine
publish:
	npm publish
	cnpm sync zfinder

