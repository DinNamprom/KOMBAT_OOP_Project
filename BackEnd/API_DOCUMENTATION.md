# KOMBAT OOP Project - API Documentation

This document describes the API endpoints available for the KOMBAT OOP Project backend.

## Base URL
Default: `http://localhost:8080`

---

## 1. Game Controller (`/game`)
Handles game setup, player management, and state retrieval.

### 1.1 Create Game
- **Endpoint:** `POST /game/create`
- **Description:** Initializes a new game board and configuration.
- **Request Body (`CreateModeConfig`):**
  ```json
  {
    "mode": "DUEL", // Enum: DUEL, SOLITAIRE, AUTO
    "config": "string_configuration_data"
  }
  ```
- **Response:** `String` (The generated `gameID` as a UUID string, or an error message).

### 1.2 Join Game
- **Endpoint:** `POST /game/join/{gameID}?playerID={playerID}`
- **Description:** Adds a player to an existing game.
- **Path Variables:**
    - `gameID`: UUID of the game.
- **Request Parameters:**
    - `playerID`: UUID of the player joining.
- **Response:** `boolean` (`true` if successful, `false` otherwise).

### 1.3 Create Minion Kind
- **Endpoint:** `POST /game/minion-kind/{gameID}`
- **Description:** Defines a new type of minion and its strategy before the game starts.
- **Path Variables:**
    - `gameID`: UUID of the game.
- **Request Body (`CreateMinion`):**
  ```json
  {
    "name": "MinionName",
    "hp": 100,
    "def": 50,
    "spawncost": 20,
    "strategy": "move up; attack nearest;"
  }
  ```
- **Response:** `boolean` (`true` if successful).

### 1.4 Check Strategy
- **Endpoint:** `POST /game/strategy/{gameID}`
- **Description:** Validates if a strategy string is syntactically correct by parsing it.
- **Path Variables:**
    - `gameID`: UUID of the game.
- **Request Body (`CheckStartegy`):**
  ```json
  {
    "strategy": "move up; attack nearest;"
  }
  ```
- **Response:** `boolean` (`true` if valid, `false` otherwise).

### 1.5 Start Game
- **Endpoint:** `POST /game/start/{gameID}`
- **Description:** Confirms and starts the game setup.
- **Path Variables:**
    - `gameID`: UUID of the game.
- **Response:** `boolean` (`true` if successful).

### 1.6 Get Minion Actions
- **Endpoint:** `GET /game/actions/{gameID}/{playerID}`
- **Description:** Retrieves the list of actions performed by a player's minions. **Note:** This call clears the action queue for those minions on the backend after retrieval.
- **Path Variables:**
    - `gameID`: UUID of the game.
    - `playerID`: UUID of the player.
- **Response:** `List<MinionAction>`
  ```json
  [
    {
      "no": 1,
      "owner_uuid": "...",
      "actions": [
        {
          "row": 2,
          "col": 3,
          "atk": true,
          "target_owner": "...",
          "target_no": 2,
          "dmg": 10
        }
      ]
    }
  ]
  ```

### 1.7 Get Buyable Grids
- **Endpoint:** `GET /game/buyable-grids/{gameID}/{playerID}`
- **Description:** Returns a list of coordinates for grids that the player can currently purchase.
- **Path Variables:**
    - `gameID`: UUID of the game.
    - `playerID`: UUID of the player.
- **Response:** `List<GridPosition>`
  ```json
  [ { "row": 1, "col": 1 }, { "row": 1, "col": 2 } ]
  ```

### 1.8 Get Spawnable Grids
- **Endpoint:** `GET /game/spawnable-grids/{gameID}/{playerID}`
- **Description:** Returns a list of coordinates for grids owned by the player where they can spawn minions.
- **Path Variables:**
    - `gameID`: UUID of the game.
    - `playerID`: UUID of the player.
- **Response:** `List<GridPosition>`
  ```json
  [ { "row": 0, "col": 0 } ]
  ```

### 1.9 Get Game Status
- **Endpoint:** `GET /game/status/{gameID}`
- **Description:** Retrieves the complete current state of the game (grids, minions, players).
- **Path Variables:**
    - `gameID`: UUID of the game.
- **Response Body (`GameStatus`):**
  ```json
  {
    "gridStatusList": [
      { "row": 0, "col": 0, "ownerID": "..." }
    ],
    "minionStatusList": [
      { "no": 1, "kindName": "Zaku", "row": 0, "col": 0, "ownerID": "...", "hp": 100 }
    ],
    "playerStatusList": [
      { "playerID": "...", "budget": 500 }
    ]
  }
  ```

---

## 2. Action Controller (`/action`)
Handles player moves and turn management.

### 2.1 Buy Grid
- **Endpoint:** `POST /action/buy-grid`
- **Description:** Requests to purchase a new hex grid.
- **Request Body (`BuyGrid`):**
  ```json
  {
    "gameID": "...",
    "PlayerName": "...", // UUID
    "row": 1,
    "col": 2
  }
  ```
- **Response:** `Boolean` (`true` if purchase was successful).

### 2.2 Spawn Minion
- **Endpoint:** `POST /action/spawn-minion`
- **Description:** Requests to spawn a minion of a specific type at a location.
- **Request Body (`SpawnMinion`):**
  ```json
  {
    "gameID": "...",
    "playerName": "...", // UUID
    "kind": "MinionKindName",
    "row": 0,
    "col": 0
  }
  ```
- **Response:** `Boolean` (`true` if spawning was successful).

### 2.3 End Turn
- **Endpoint:** `POST /action/endTurn/{gameID}/{playerID}`
- **Description:** Ends the current player's turn phase and triggers backend execution of minion strategies.
- **Path Variables:**
    - `gameID`: UUID of the game.
    - `playerID`: UUID of the player ending their turn.
- **Response:** `Boolean` (`true` if the game is over, `false` otherwise).
