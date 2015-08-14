# webhook for zfinder

## how to use

### server side

get a copy of this folder in your server, and run the hook script:

```shell
nohup node $path-to-server-root/hook/server.js > $path-to-server-root/log/hook.log &
```

and you should set up key pairs to enable script-use of git:

```shell
# in ~/.ssh/config
# see $path-to-server-root/hook/ssh-config.txt for detail
```

### webhook setting

in github/gitlab/bitbucket, set the webhook url as:

```
http://your-host:9191?repo=$repo-url-you-want-to-sync&name=$repo-name-on-your-server
```


