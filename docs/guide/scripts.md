# Scripts and where they run

Vortex has three kinds of script. Which one you pick, and where you put it, decides where the code runs.

| Kind | Runs on | Put it in |
| --- | --- | --- |
| [Script](/reference/classes/script) | the server | `ServerScriptService`, or `Workspace` |
| [LocalScript](/reference/classes/localscript) | each player's client | `StarterPlayerScripts` |
| [ModuleScript](/reference/classes/modulescript) | wherever it's required | usually `ReplicatedStorage` |

A Script or LocalScript somewhere else, for example inside `ReplicatedStorage`, most likely never starts.

## Server Scripts

The server owns the game state: scores, damage, spawning things everyone should see. Server code can't read input and has no `Players.LocalPlayer`, use events like `Players.PlayerAdded` or the `player` argument of `RemoteEvent.OnServerEvent` instead.

## LocalScripts

Client code handles input, the camera and anything only one player should see. These are client only:

* [UserInputService](/reference/services/userinputservice)
* `Players.LocalPlayer`
* `RunService.RenderStepped`
* `workspace.CurrentCamera`

## ModuleScripts

Modules hold shared code. They run once the first time something requires them and return a value, usually a table:

```lua
-- ReplicatedStorage/MathUtil
local MathUtil = {}

function MathUtil.lerp(a: number, b: number, t: number): number
	return a + (b - a) * t
end

return MathUtil
```

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MathUtil = require(ReplicatedStorage:WaitForChild("MathUtil"))

print(MathUtil.lerp(0, 10, 0.25)) --> 2.5
```

A module that doesn't end in `return` gives `require` nothing to work with.

## Waiting and scheduling

Use the [task library](/reference/libraries#task) rather than the old globals:

```lua
task.wait(2)                      -- pause this script for two seconds
task.spawn(function() end)        -- run something right away in parallel
task.delay(5, function() end)     -- run something later
```

`WaitForChild` is the safe way to grab objects that might not be loaded yet. It checks every 0.05 seconds and returns `nil` once the optional timeout passes:

```lua
local door = workspace:WaitForChild("Door", 10)
if not door then
	warn("no door after 10 seconds")
end
```

Long loops without `task.wait()` run into the per frame [time budget](/guide/limits).
