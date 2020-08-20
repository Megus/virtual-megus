# Internal data types

## Event

```js
{
  event: "note",    // Event type
  timeSteps: 12,    // Event start time in steps (1/4096 of a bar)
  timeSeconds: 6,   // Event start time in seconds
  data: {},         // Event data
}

```

### Event Types

- `note` — note for channel unit
- `unit` — change some unit parameter (automation)
- `channel` — change some channel parameter (automation)

#### Note event data

```js
{
  pitch: 48,            // Note pitch from pitch table
  velocity: 1,          // Velocity
  cc: {0: 1},           // Controller values
  durationSteps: 1,     // Note duration in steps (1/4096 of a bar)
  durationSeconds: 0.5, // Note duration in seconds
}
```

If note duration is zero, the sustain phase of ADSR envelope is skipped.

#### Unit event data

```js
{
  cutoff: 200,    // Filter cutoff frequency in Hz
  resonance: 1,   // Filter resonance
}
```

Unit event data object can include any set of parameter values.

#### Channel event data

```js
{
  reverbSend: 0.5,    // Send to master reverb (range: 0-1)
  delayLevel: 0.1,    // Delay level (range: 0-1)
  delayToReveb: 0.1,  // Delay-to-reverb send level (range: 0-1)
  delayTime: 0.2,     // Delay time in seconds
  delayStereo: 0.1,   // Delay stereo width (range: 0-1)
}
```
