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
