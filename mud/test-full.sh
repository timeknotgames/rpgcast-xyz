#!/usr/bin/env bash
# Full MUD test: GWE 360°, diagonal movement, Joseph dialogue, system switching

node dist/server/index.js &
SERVER_PID=$!
sleep 3

exec 3<>/dev/tcp/localhost/4000
cat <&3 &
READER_PID=$!
sleep 1

echo "JaiRuviel" >&3; sleep 2
echo "1" >&3; sleep 2
echo "roll gwe" >&3; sleep 2
echo "southeast" >&3; sleep 2
echo "south" >&3; sleep 2
echo "look" >&3; sleep 1
echo "talk joseph" >&3; sleep 1
echo "1" >&3; sleep 1
echo "1" >&3; sleep 1
echo "1" >&3; sleep 1
echo "system pathfinder" >&3; sleep 1
echo "check earth 40" >&3; sleep 1
echo "system mm3e" >&3; sleep 1
echo "check chaos 50" >&3; sleep 1
echo "north" >&3; sleep 1
echo "north" >&3; sleep 1
echo "look" >&3; sleep 1
echo "attack spore" >&3; sleep 1
echo "sing" >&3; sleep 1
echo "quit" >&3; sleep 1

kill $READER_PID 2>/dev/null
exec 3<&-
exec 3>&-
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
