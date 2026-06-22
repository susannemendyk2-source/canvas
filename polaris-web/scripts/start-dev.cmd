@echo off
cd /d E:\hb\polaris-web
"C:\Program Files\nodejs\node.exe" "E:\hb\polaris-web\node_modules\nuxt\bin\nuxt.mjs" dev --port 3090 --host 127.0.0.1 > "E:\hb\polaris-web\nuxt-dev.log" 2> "E:\hb\polaris-web\nuxt-dev.err.log"
