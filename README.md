Hotkey Ninja
============

# Configurations

## Environment Variables
### MONGO_USER
Sets the username of the connection string

### MONGO_PASS
sets the password of the connection string

# Web Sockets Communication Protocol
## Namespace
### Default namespace is '/socket'

## Server
### 'load' event
Finds all connected client sockets to this room and emits a 'loaded' event.
If the game is full, then a 'full' event is emitted.
### 'join' event
Finds the requested game room and joins it. When 2 players have joined the room it requests
the appropriate application shortcuts list. If such list is found, and both players are still presents,
server emits a 'start' game event and then the first 'query' event is also emitted.
If the game is full, then a 'full' event is emitted.

### 'answer' event
Checks if the shortcut combination in the answer is correct and emits a 'progress' event.
If the progress of one of the players reaches the length of the shortcuts list, the game ends.
Winner is the player with highest score.

Example:

```json
{
    "answer": "ctrl+s",
    "user": "Player"
}
```
### 'disconnect' event
Notifies the other person in the game room that his partner has left

##Client
### 'loaded' event
Receives game setup.

Example:

```json
{
	"players": 1,
    "user": "Player",
    "id": "id"
}
```

### 'start' event
Occurs when game is started.

Example:

```json
{
    "id": "id",
    "users": ["Player", "Opponent"],
    "total": "11"
}
```

### 'query' event
Occurs when a new query is received.

Example:

```json
{
    "query": "Select all text."
}
```
### 'progress' event
Reports progress change of a player to all players in the current game room.

Example:

```json
{
    "id": "id",
    "score": "3",
    "user": "Opponent"
}
```
### 'game over' event
Indicates end of game and the winner.

Example:
```json
{
    "winner": "Player"
}
```
### 'leave' event
If a player leaves the game room this event will occur.

Example:

```json
{
    "room": "id",
    "user": "Player"
}
```
### 'full' event
Indicates that the game is full, and no more players can join it.