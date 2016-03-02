# zfinder

zfinder is a simple, powerful, flexible **static server**.

you can setup a static server with markdown support and lots of other features using one command: `$ zfinder serve`

links: [homepage](http://zfinder.github.io/zfinder/) | [markdown syntax features](http://leungwensen.github.io/marked-plus-renderer/demo/features.html)

## install

```
$ npm install zfinder -g
```

## usage

### starting a zfinder server

```
$ zfinder serve [server root]
```

options:

* `--port(-p) <number>`: set a port for zfinder server
* `--open(-o)`: open url to zfinder server in web browser
* `--config(-c) <$path/to/a/config/file.yaml>`: specify a server config file(YAML format)
* `--localmiddleware <$path/to/a/local/middleware/project>`: specify a local middleware project(for developing)

sample config file(./config/server.yaml):

```yaml
port: 9090          # default port
debug: true         # set true to output middleware info
openOnStart: false  # same as --open
locale: zh_CN       # set the default user language
#favicon:           # set a favicon file
path:               # root path of zfinder/zfinder middleware files
    middlewareRoot: /__ZFINDER_MW__
    zfinderRoot: /__ZFINDER__
middleware:         # config for middlewares
    zfinder-mw-basic-auth:
        users:
            zfinder: awesome
        ignores:
            - ^(\/)?$
            #documents
            - \.(htm|html|markdown|md|pdf)$
            #code
            - \.(css|js|json|map)$
            #images
            - \.(bmp|gif|ico|jpeg|jpg|png|webp|pgf)$
            #fonts
            - \.(eot|svg|ttf|woff|woff2)$
    zfinder-mw-fs:
    zfinder-mw-search:
    zfinder-mw-directory:
    zfinder-mw-index:
        priority: 100
        suffixes:
            - .markdown
            - .md
            - /index.html
            - /index.htm
            - /README.markdown
            - /README.md
            - /readme.markdown
            - /readme.md
            - .html
            - .htm
    zfinder-mw-markdown:
```

### kill all zfinder processes

```
$ zfinder killall
```

### developing a middleware of your own

```
$ zfinder create-middleware [name]
```

options:

* `--root -r <$root/path>`

more about middleware, see [zfinder-middleware](https://github.com/zfinder?utf8=%E2%9C%93&query=zfinder-middleware) & [zfinder-mw-xxx](https://github.com/zfinder?utf8=%E2%9C%93&query=zfinder-mw)

### build files into html(TODO)

```
$ zfinder build
```

## builtin middlewares

### [zfinder-mw-basic-auth](https://github.com/zfinder/zfinder-mw-basic-auth)

basic auth support, with RegExp configuration.

### [zfinder-mw-fs](https://github.com/zfinder/zfinder-mw-fs)

restful api to access server files/directories

### [zfinder-mw-search](https://github.com/zfinder/zfinder-mw-search)

glob searching api and content searching api

### [zfinder-mw-directory](https://github.com/zfinder/zfinder-mw-directory)

listing files in a directory, like `finder.app` or `explorer.exe`

### [zfinder-mw-index](https://github.com/zfinder/zfinder-mw-index)

url fallback solution, fulling configurable

### [zfinder-mw-markdown](https://github.com/zfinder/zfinder-mw-markdown)

markdown file server, preview your markdown files as html in the browser.

it is built on top of [marked-plus-renderer](https://github.com/leungwensen/marked-plus-renderer), with rich syntax features:

- [x] all basic markdown features(headings, tables, etc.)
- [x] gfm-like check-list
- [x] code highlighting
- [x] definition list
- [x] footnote
- [x] graph (mermaid)
- [x] sequence diagram (mermaid)
- [x] gantt diagram (mermaid)
- [x] flowchart (flowchart.js)
- [x] latex math typesetting (KaTex)
- [x] emoji
- [x] html/js/css injection

more info about the markdown syntax features: [features](http://leungwensen.github.io/marked-plus-renderer/demo/features.html)

## [License (MIT License)](./LICENSE)

## [contact](doc/contact.markdown)
 
