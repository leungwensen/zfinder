# Zfinder

[Zfinder](https://github.com/leungwensen/zfinder) is designed to replace the finder.app in Mac (or file explorer in Windows). With the magic of modern Browsers, we can do a lot more.

## Usage

```shell
npm install -g zfinder
zfinder -r $path/to/root
```

## Features

#### file explorer

- [x] content search
- [x] glob search
* [ ] context menu
* [ ] application list (editors, etc)
* [ ] help info;

#### static server

- [x] static file server

#### file previewer

- [x] markdown previewer
- [ ] image previewer
- [ ] xmind previewer
- [ ] media player

#### file editor

- [x] markdown editor
* [ ] universal code editor
- [ ] image editor
- [ ] xmind editor

#### others

- [ ] i18n
- [ ] proxy server

## Thanks to

Zfinder is built on top of all these fantastic projects:

* [Khan/KaTeX](https://github.com/Khan/KaTeX)
* [avoidwork/filesize.js](https://github.com/avoidwork/filesize.js)
* [chjj/marked](https://github.com/chjj/marked)
* [codemirror/CodeMirror](https://github.com/codemirror/CodeMirror.git)
* [expressjs/serve-static](https://github.com/expressjs/serve-static)
* [isaacs/node-glob](https://github.com/isaacs/node-glob)
* [jshttp/http-errors](https://github.com/jshttp/http-errors)
* [jshttp/mime-types](https://github.com/jshttp/mime-types)
* [knsv/mermaid](https://github.com/knsv/mermaid)
* [moment/moment](https://github.com/moment/moment)
* [pwnall/node-open](https://github.com/pwnall/node-open)
* [senchalabs/connect](https://github.com/senchalabs/connect)
* [sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css)
* [substack/minimist](https://github.com/substack/minimist)

## History

#### 0.0.9

* markdown editor enhancement:
  * support diagrams drawing;
  * support math typesetting;
  * github-like task list;

#### 0.0.8

* bugfix in markdown editor;


#### 0.0.7

* markdown editor;

#### 0.0.6

* fix [issue 1](https://github.com/leungwensen/zfinder/issues/1);
* fix [issue 2](https://github.com/leungwensen/zfinder/issues/2);

#### 0.0.5

* content search;
* file browser;
* glob search;
* html static server;
* markdown previewer;
* the first usable version in npm;

## License (MIT License)

The MIT License (MIT)

Copyright (c) 2015 leungwensen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

