# SUBROUTINE IDEAS

The subroutines will be in the form of Warioware style minigames, with a timelimit (rendered as a trace) and if the minigame is failed, then the trace succeeds. In the case of minigames where the goal is to *survive* a set time limit, then this could be represented as a `[ICE-BREAK IN PROGRES...]` progress bar that fills up, rather than a `[TRACE IN PROGRESS...]` that empties.

At the moment, the subroutines are just given very obvious names, but I will update them later and give them cheesy hacker names once I've finalised them all.

The subroutines are randomly chosen at the Corp set up, so you dont get the identical subroutines in a run. This means there need to be 8 unique subroutines (5 for the ICEs, 3 for the lives/retries on a failure). When you encounter an ICE, the subroutine is run via visual prompt of `> SUBROUTINE_NAME,` which will then show a screen saying:

```
> man SUBROUTINE_NAME


NAME
    SUBROUTINE_NAME

DESCRIPTION
    A brief tutorial on how the minigame works.
```

This stays on screen for a short time period (a few seconds), before the subroutine begins.

## PASSWORD_CRACKER
A password is chosen from a list (perhaps the john the ripper password list?). Then a calculation is made depending on the length of the password and the time limit for the crack. For example, assume that the current difficulty is 20 key presses per second. For example:

Time limit: 10 seconds // PW length: 11 (password123) // (20*10)/11 = 18.2, rounded to 18 keypresses per character solved.

The formula for a calculation of keypresses needed to solve a character in the crack is:

```
(difficulty * time limit) / password length
```

Characters are focused on from left to right, and when a key is pressed a random letter from the alphabet is chosen to display in its place, and the character's internal count is decremented. When the characters count reaches 0, it reveals the proper character and the next character is focused. When all characters have been solved, the crack is complete.

```
> man PASSWORD_CRACKER

NAME
    PASSWORD_CRACKER

DESCRIPTION
    The finest bruteforce cracker money can buy. Mash those keys!
```

## FIREWALL_BYPASSER
Red walls descend from the top of the screen to the bottom, with a gap in them. Using the left and right keys, you have to dodge through these gaps. Fairly simple. Perhaps speed can be changed in order to increase difficulty.

```
> man FIREWALL_BYPASSER

NAME
    FIREWALL_BYPASSER

DESCRIPTION
    Use the arrow keys to maneuver the payload through the gaps in the Corp's firewall.
```

## WORM
A maze in generated with a file/ICE to infect within it. You control the worm with the arrow keys. If the worm crosses itself or hits the side of the maze, the ICE-break fails.

The maze is made up of 28 x 12 blocks of 30 pixels each. A maze generation algorithm (maybe Prim's?) will be used to create a random one, and then the goal will be placed on the opposite side of the maze as the player.

```
> man WORM

NAME
    WORM

DESCRIPTION
    Guide the worm using the arrow keys to the infection vector.
    Don't hit the ICE walls or yourself!
```

## SQL_INJECT

## BOTNET_DDOS

You control 5 hosts in a botnet, and pressing the numeric keys 1-5 will launch a packet from them. However, the hosts have a set bandwidth that if maxxed will lock that host out for a few seconds. The target is a server with a bar that is filled up when a packet is recieved. The rate at which the server's bar drains increases based on the time since it last saw a packet. This means if you spam all the hosts & lock them all out, then your progress will be erased.

```
> man BOTNET_DDOS

NAME
    BOTNET_DDOS

DESCRIPTION
    Use numeric keys 1-5 to send a packet from a host in your botnet.
    Send enough packets at the target server to knock it offline.
    Sending packets from a host too quickly will result in its bandwidth being reached,
    and it will be disabled until a connection is re-established.
```

## BUFFER_OVERFLOW

Timing based minigame where the player has to hold down space to overflow a buffer and time it so that the buffer ends in the RETURN ADDRESS area, to jump to the next buffer. After 4 (maybe 5?) complete buffers you win. Missing the RETURN ADDRESS area locks you out for 4 seconds. Each stack buffer should fill at different speeds.

```
> man BUFFER_OVERFLOW

NAME
    BUFFER_OVERFLOW

DESCRIPTION
    Hold down space to start generating values in the stack buffer.
    When the data reaches the return address area, release space to inject your payload.
    Jump from 4 buffers to inject your ICE-BREAK payload.
```

## PACKET_SNIFFER
Streams of white data run across the bottom of the screen, with Key Info in green. In the middle of the screen is a small area that denotes the part of the stream being sniffed. Pressing space while key info is in the sniffing area causes it to be captured. Player needs to capture a certain amount of key info packets within a timeframe to complete the break. Sniffing packets when there is no key info in the buffer freezes the buffer for 4 seconds.

```
> man PACKET_SNIFFER

NAME
    PACKET_SNIFFER

DESCRIPTION
    Press spacebar to to capture key packets while they are in your sniffers buffer.
    Assemble enough key packets to break the ICE.
    Capturing non-key packets will lock up the sniffer and require it to be rebooted, taking 4 seconds.
```

## VOICE_CRACKER
A waveform is shown on the screen with a sound. There is also a base tone and 3 dials. The 3 dials affect the base tone differently, and the hacker needs to figure out which combination of dial settings allows the base tone to mimic the one shown on screen. When they match, the voice password is cracked.

```
> man VOICE_CRACKER

NAME
    VOICE_CRACKER

DESCRIPTION
    Use the modulation dials to mimic the waveform of a known login.
```
