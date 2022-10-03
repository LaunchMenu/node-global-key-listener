#!/usr/bin/env bash
set -xe
c++ src/bin/X11KeyServer/main.cpp -o bin/X11KeyServer -lX11 -lXi -static-libgcc -static-libstdc++
strip bin/X11KeyServer
