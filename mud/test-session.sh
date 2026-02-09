#!/usr/bin/env bash
# Test the Crying Depths MUD via telnet-style interaction
# Uses a named pipe for controlled send/receive

exec 3<>/dev/tcp/localhost/4000

# Read welcome banner
sleep 2
cat <&3 &
READER_PID=$!
sleep 1

# Send name
echo "JaiRuviel" >&3
sleep 2

# Choose Dice Godz
echo "1" >&3
sleep 2

# Explore commands
echo "look" >&3
sleep 1

echo "search" >&3
sleep 1

echo "south" >&3
sleep 2

echo "look" >&3
sleep 1

echo "examine spore" >&3
sleep 1

echo "check chaos 50" >&3
sleep 1

echo "east" >&3
sleep 2

echo "look" >&3
sleep 1

echo "take pendant" >&3
sleep 1

echo "inventory" >&3
sleep 1

echo "roll gwe" >&3
sleep 2

echo "stats" >&3
sleep 1

echo "map" >&3
sleep 1

echo "roll d20" >&3
sleep 1

echo "south" >&3
sleep 2

echo "look" >&3
sleep 1

echo "help" >&3
sleep 1

echo "quit" >&3
sleep 1

kill $READER_PID 2>/dev/null
exec 3<&-
exec 3>&-
