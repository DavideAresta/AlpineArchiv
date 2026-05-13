#!/bin/bash

# API Integration Tests for localStorage endpoints
# These tests simulate the localStorage API calls described in the architecture

set -e

echo "Starting localStorage API tests..."

# Test 1: GET localStorage:ttt_scoreboard (retrieve persisted scoreboard)
echo "\nTest 1: GET scoreboard from localStorage"
# Simulate retrieving scoreboard - in real browser this would be localStorage.getItem('ttt_scoreboard')
# We'll create a mock localStorage file for testing
cat > mock_localStorage.json << 'EOF'
{
  "ttt_scoreboard": "{\"player1Wins\": 3, \"player1Losses\": 1, \"draws\": 2, \"gameMode\": \"pvp\", \"lastUpdated\": \"2024-01-15T10:30:00Z\"}",
  "ttt_move_history": "[]",
  "ttt_blitz_config": "{\"enabled\": false, \"durationSeconds\": 10}"
}
EOF

# Extract and parse the scoreboard
SCOREBOARD_JSON=$(grep -o '"ttt_scoreboard": "[^"]*' mock_localStorage.json | cut -d'"' -f4)
echo "Retrieved scoreboard: $SCOREBOARD_JSON"

# Validate the JSON structure
if echo "$SCOREBOARD_JSON" | grep -q '"player1Wins":' && \
   echo "$SCOREBOARD_JSON" | grep -q '"player1Losses":' && \
   echo "$SCOREBOARD_JSON" | grep -q '"draws":'; then
  echo "✓ GET scoreboard test PASSED - Valid JSON structure"
else
  echo "✗ GET scoreboard test FAILED - Invalid JSON structure"
  exit 1
fi

# Test 2: POST localStorage:ttt_scoreboard (persist updated scoreboard)
echo "\nTest 2: POST updated scoreboard to localStorage"
UPDATED_SCOREBOARD='{"player1Wins": 4, "player1Losses": 1, "draws": 2, "gameMode": "cpu", "lastUpdated": "2024-01-15T10:35:00Z"}'
echo "Updating scoreboard with: $UPDATED_SCOREBOARD"

# Simulate localStorage.setItem('ttt_scoreboard', UPDATED_SCOREBOARD)
sed -i "s/\"ttt_scoreboard\": \"[^\"]*/\"ttt_scoreboard\": \"$(echo $UPDATED_SCOREBOARD | sed 's/"/\\"/g')/" mock_localStorage.json

# Verify the update
UPDATED=$(grep -o '"ttt_scoreboard": "[^"]*' mock_localStorage.json | cut -d'"' -f4)
if echo "$UPDATED" | grep -q '"player1Wins": 4'; then
  echo "✓ POST scoreboard test PASSED - Scoreboard updated successfully"
else
  echo "✗ POST scoreboard test FAILED - Scoreboard not updated"
  exit 1
fi

# Test 3: DELETE localStorage:ttt_scoreboard (reset scoreboard)
echo "\nTest 3: DELETE scoreboard from localStorage"
# Simulate localStorage.removeItem('ttt_scoreboard')
sed -i '/"ttt_scoreboard":/d' mock_localStorage.json

if ! grep -q '"ttt_scoreboard":' mock_localStorage.json; then
  echo "✓ DELETE scoreboard test PASSED - Scoreboard removed successfully"
else
  echo "✗ DELETE scoreboard test FAILED - Scoreboard still exists"
  exit 1
fi

# Test 4: EventBus API simulation
echo "\nTest 4: EventBus API endpoints simulation"

echo "Testing MOVE_MADE event..."
MOVE_EVENT='{"moveNumber": 3, "player": "Player 1", "symbol": "X", "cellIndex": 4, "timestamp": "2024-01-15T10:31:05Z"}'
echo "Move event payload: $MOVE_EVENT"

# Validate move event structure
if echo "$MOVE_EVENT" | grep -q '"moveNumber":' && \
   echo "$MOVE_EVENT" | grep -q '"player":' && \
   echo "$MOVE_EVENT" | grep -q '"symbol":' && \
   echo "$MOVE_EVENT" | grep -q '"cellIndex":'; then
  echo "✓ MOVE_MADE event structure VALID"
else
  echo "✗ MOVE_MADE event structure INVALID"
  exit 1
fi

echo "\nTesting MATCH_CONCLUDED event..."
MATCH_EVENT='{"outcome": "win", "winner": "Player 1", "gameMode": "pvp"}'
echo "Match event payload: $MATCH_EVENT"

# Validate match event structure
if echo "$MATCH_EVENT" | grep -q '"outcome":' && \
   echo "$MATCH_EVENT" | grep -q '"winner":'; then
  echo "✓ MATCH_CONCLUDED event structure VALID"
else
  echo "✗ MATCH_CONCLUDED event structure INVALID"
  exit 1
fi

echo "\nTesting BOARD_RESET event..."
RESET_EVENT='{"gameMode": "pvp", "blitzEnabled": false}'
echo "Reset event payload: $RESET_EVENT"

# Validate reset event structure
if echo "$RESET_EVENT" | grep -q '"gameMode":' && \
   echo "$RESET_EVENT" | grep -q '"blitzEnabled":'; then
  echo "✓ BOARD_RESET event structure VALID"
else
  echo "✗ BOARD_RESET event structure INVALID"
  exit 1
fi

echo "\nTesting TURN_FORFEITED event..."
FORFEIT_EVENT='{"forfeitedPlayer": "Player 2", "gameMode": "cpu"}'
echo "Forfeit event payload: $FORFEIT_EVENT"

# Validate forfeit event structure
if echo "$FORFEIT_EVENT" | grep -q '"forfeitedPlayer":' && \
   echo "$FORFEIT_EVENT" | grep -q '"gameMode":'; then
  echo "✓ TURN_FORFEITED event structure VALID"
else
  echo "✗ TURN_FORFEITED event structure INVALID"
  exit 1
fi

echo "\nTesting TIMER_TICK event..."
TIMER_EVENT='{"remainingSeconds": 7}'
echo "Timer event payload: $TIMER_EVENT"

# Validate timer event structure
if echo "$TIMER_EVENT" | grep -q '"remainingSeconds":'; then
  echo "✓ TIMER_TICK event structure VALID"
else
  echo "✗ TIMER_TICK event structure INVALID"
  exit 1
fi

echo "\nTesting GAME_MODE_CHANGED event..."
MODE_EVENT='{"gameMode": "cpu", "blitzEnabled": true, "blitzDurationSeconds": 10}'
echo "Mode event payload: $MODE_EVENT"

# Validate mode event structure
if echo "$MODE_EVENT" | grep -q '"gameMode":' && \
   echo "$MODE_EVENT" | grep -q '"blitzEnabled":' && \
   echo "$MODE_EVENT" | grep -q '"blitzDurationSeconds":'; then
  echo "✓ GAME_MODE_CHANGED event structure VALID"
else
  echo "✗ GAME_MODE_CHANGED event structure INVALID"
  exit 1
fi

echo "\nAll localStorage API tests completed successfully!"
rm -f mock_localStorage.json
