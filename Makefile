# grouped tasks
make:
	make install
	make test
all:
	make preinstall
	make
	make publish
publish:
 make push_github
 make publish_npm
 make publish_homepage

# tasks
preinstall:
	npm  install -g cnpm --registry=http://registry.npm.taobao.org
install:
	cnpm install
	npm install
test:
push_github:
 git push
publish_homepage:
	git checkout gh-pages && git merge master && git push && git checkout master
publish_npm:
	npm publish
	cnpm sync zfinder

