---
title: "Building Native Board Games in Jetpack Compose: Concurrency, 2.5D Physics, and Procedural Audio"
description: "Architectural learnings from building Ludo Supreme: resolving multi-coroutine state race conditions, procedural 2.5D tumbling dice, real-time PCM audio synthesis, and adaptive tablet layouts."
date: 2026-09-14
tags: ["android", "jetpack-compose", "kotlin-coroutines", "game-dev", "audio-synthesis", "ui-ux"]
category: "mobile"
source: "c3810c34-b35e-4924-8861-346208ac0e4f"
---

## Overview

This guide compiles the technical insights, architectural patterns, and debugging solutions gained while building **Ludo Supreme**, a high-performance native Indian board game created entirely with Jetpack Compose, Kotlin Coroutines, and Android Canvas.

---

## 1. Concurrency & Race Conditions in Game State Machines

### Problem: Multiple Tokens Moving Simultaneously

During gameplay testing, two tokens were occasionally seen moving across the board simultaneously. The issue was erratic, happening primarily when bots played or when automatic moves triggered.

#### Root Cause Analysis

1. **Unmanaged Coroutines & Overlapping Fallbacks**:
   In `rollDice()`, a safety fallback coroutine was launched:
   ```kotlin
   // Fallback to advance turn if UI roll animation callback was delayed
   viewModelScope.launch {
       delay(550)
       if (_gameState.value.turnPhase == TurnPhase.ROLLING_DICE) {
           processRollResult(finalRoll)
       }
   }
   ```
2. **Animation Delay Gap**:
   The 2.5D dice animation finished at ~400ms and called `onDiceRollComplete(dice) -> processRollResult(dice)`.
3. **The Race Window**:
   When `processRollResult(dice)` found only one eligible token to move (or a bot move), it launched a coroutine with `delay(450)` so the player could see the rolled number before the token began hopping.
   Crucially, `turnPhase` was **not** immediately transitioned away from `TurnPhase.ROLLING_DICE` during that 450ms pause.
4. **Double Execution**:
   At $t = 550\text{ms}$ (while the 450ms pause was still active), the fallback timer woke up, checked `turnPhase == TurnPhase.ROLLING_DICE` (evaluating to `true`), and called `processRollResult(finalRoll)` a **second time**.
5. Both coroutines entered `executeMove()` in parallel, executing step-by-step loops concurrently and animating two separate tokens on the board at the exact same time.

### Solution: Strict Job Tracking & Immediate Phase Locking

1. **Explicit Coroutine Job Ownership**:
   Track active jobs as nullable references rather than launching detached coroutines:
   ```kotlin
   private var diceRollFallbackJob: Job? = null
   private var moveJob: Job? = null
   private var botJob: Job? = null
   private var turnJob: Job? = null
   ```

2. **Cancel Fallbacks on UI Callbacks**:
   Cancel the fallback timer immediately when the UI event arrives:
   ```kotlin
   fun onDiceRollComplete(dice: Int) {
       diceRollFallbackJob?.cancel()
       diceRollFallbackJob = null

       val state = _gameState.value
       if (state.turnPhase != TurnPhase.ROLLING_DICE) return
       processRollResult(dice)
   }
   ```

3. **Synchronous Phase Transition Before Suspension**:
   Never delay without first changing the state phase away from the triggering phase:
   ```kotlin
   } else if (movableTokens.size == 1 || allYardMoves) {
       // Lock UI immediately to prevent duplicate triggers or fallback race conditions
       _gameState.update {
           it.copy(
               turnPhase = TurnPhase.ANIMATING_MOVE,
               legalMoves = emptyList()
           )
       }
       val moveToExecute = legalMoves.first()
       turnJob = viewModelScope.launch {
           delay(400)
           executeMove(moveToExecute)
       }
   }
   ```

4. **Single-Execution Guard in Move Execution**:
   Ensure previous move jobs are cancelled before starting a new step animation:
   ```kotlin
   private fun executeMove(move: MoveOption) {
       moveJob?.cancel()
       moveJob = viewModelScope.launch {
           // Step-by-step hop animation loop...
       }
   }
   ```

---

## 2. 2D Coordinate Stacking & Cell Clustering

### Problem: Unintended Token Offsets in Home Stretches

When multiple tokens occupy the same square on the global track, they must be offset in a circle to remain visible. However, tokens of different colors in their private colored home stretches were also getting offset radially as if they were sharing the same square.

#### Root Cause
The position grouping map used `-2 to token.homeStretchPosition` as the dictionary key for home stretch tokens. Tokens of Player Red at index 2 and Player Green at index 2 shared the same `(-2, 2)` key despite being in completely different colored quadrants.

### Solution: Color-Partitioned Spatial Keys
```kotlin
val key = if (token.state == TokenState.ON_TRACK) {
    token.trackPosition to -1 // Global track shared across all colors
} else {
    token.homeStretchPosition to token.color.ordinal // Private per-color track
}
positionMap.getOrPut(key) { mutableListOf() }.add(player to token)
```

---

## 3. Pseudo-3D (2.5D) Fast Tumbling Dice in Compose

### Design Requirements
- Fixed container slot (62dp) without building an external 3D physics engine.
- Fast and snappy duration: 350ms–450ms total.
- Clear readability of the final rolled value on settle.

### Implementation Pattern

1. **Phase 1: Tumbling & Motion Blur (~270ms)**
   - Apply perspective transform:
     ```kotlin
     Modifier.graphicsLayer {
         cameraDistance = 16f * density
         rotationX = rotX.value
         rotationY = rotY.value
         rotationZ = rotZ.value
         scaleX = scale.value
         scaleY = scale.value
     }
     ```
   - Rapidly randomize pip faces every 35ms in a lightweight coroutine loop to simulate high-speed rotation and motion blur.
   - Animate `rotX` to 720° and `rotY` to 540° with a dynamic Z-axis wobble (-14° to +14°).

2. **Phase 2: Impact & Settle (~130ms)**
   - Abruptly cancel the face randomization and snap flat (`rotX=0`, `rotY=0`, `rotZ=0`).
   - Instantly set the displayed face to the deterministic `targetValue`.
   - Apply a physical impact bounce curve:
     - Impact scale dip to **0.90x** (35ms)
     - Spring overshoot to **1.06x** (55ms)
     - Settle back to **1.0x** (40ms)
   - Emit `onRollComplete(targetValue)`.

---

## 4. Zero-Asset Real-Time Procedural PCM Audio Synthesizer

### Why Procedural Audio?
Loading multiple MP3/WAV files for repetitive game sound effects (dice rattling, pawn hops, captures) introduces file I/O overhead, memory bloat, and `MediaPlayer` release/allocation latency.

### The Solution: Native `AudioTrack` Synthesizer

By generating raw 16-bit PCM waveforms at 44.1kHz and feeding them directly into Android's `AudioTrack`, sound effects are synthesized mathematically in real-time with zero external files.

#### Key Synthesis Techniques
- **Pawn Hop Step**: 120ms sharp sine transient with rapid pitch-decay envelope ($650\text{ Hz} \to 200\text{ Hz}$) to simulate a tactile wooden tap.
- **Dice Roll / Rattle**: Pseudo-random white noise bursts shaped with an exponential decay envelope, modulated at 18Hz to simulate dice tumbling inside a cup.
- **Capture**: Descending frequency chirp ($880\text{ Hz} \to 180\text{ Hz}$) combined with a low-pass burst.
- **Victory Fanfare**: Arpeggiated sequence of harmonic frequencies (C5, E5, G5, C6) rendered with ADSR envelopes.

---

## 5. Responsive Tablet & Physical Rotation Handling

### Configuration Changes vs. Activity Recreation
By default, rotating an Android tablet destroys and recreates the `Activity`, causing games to reset to the main menu if not properly preserved.

In `AndroidManifest.xml`:
```xml
<activity
    android:name=".MainActivity"
    android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize"
    android:exported="true">
```
In Compose UI:
- Use `BoxWithConstraints` to dynamically measure available screen dimensions.
- Use `isLandscape = maxWidth > maxHeight`.
- **Landscape**: 4-corner arrangement placing Red & Blue pods on the left flank and Green & Yellow pods on the right flank, maximizing the center board to `constraints.maxHeight - 32.dp`.
- **Portrait**: Stacked layout with top and bottom player pod rows sandwiching the maximized square board.

---

## 6. Release Builds & Adaptive Launcher Icons

### Key Takeaways
1. **Unsigned vs. Signed Release APKs**:
   Without a configured `signingConfig`, `./gradlew assembleRelease` outputs an unsigned APK which `adb install` rejects with `INSTALL_PARSE_FAILED_NO_CERTIFICATES`.
2. **One-Command Release Setup**:
   Generate a 2048-bit RSA keystore via `keytool` and configure `signingConfigs.create("release")` directly in `app/build.gradle.kts`.
3. **Adaptive Icon Safe Zones**:
   When designing game icons for Android, place the critical visual elements (crown, logo text, pawns) strictly within the inner 72dp circle of the 108dp adaptive icon canvas to prevent OEM masks (circles, squircles, rounded squares) from clipping icon content.
