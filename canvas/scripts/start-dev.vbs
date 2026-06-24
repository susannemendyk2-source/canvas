Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = "E:\hb"
shell.Run "cmd /c C:\Progra~1\nodejs\node.exe E:\hb\node_modules\next\dist\bin\next dev -p 3000 > E:\hb\dev-server.log 2>&1", 0, False
