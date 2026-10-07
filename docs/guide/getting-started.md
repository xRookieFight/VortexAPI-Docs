# Getting started

Vortex games are built in **Vortex Studio** and scripted in **[Luau](https://luau.org)**, the typed Lua dialect Roblox made. If you've written Roblox code before you'll feel at home quickly, but Vortex only implements part of that API. This site lists what's actually there.

## Your first script

1. Open Studio and create a project. You get the services `Workspace`, `Lighting`, `ReplicatedStorage`, `ServerScriptService` and `StarterPlayerScripts`, plus a baseplate.
2. Insert a **Script** into `ServerScriptService`.
3. Replace its code with:

```lua
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
	print("Welcome,", player.DisplayName)
end)
```

4. Press **Play**. The greeting shows up in the Output panel.

## Making something happen in the world

Parts live in `Workspace`. This server script makes any part named `Lava` hurt players who touch it:

```lua
local lava = workspace:WaitForChild("Lava")

lava.Touched:Connect(function(other)
	local character = other.Parent
	local humanoid = character and character:FindFirstChild("Humanoid")
	if humanoid then
		humanoid:TakeDamage(20)
	end
end)
```

And this one fades a part out smoothly with [TweenService](/reference/services/tweenservice):

```lua
local TweenService = game:GetService("TweenService")

local part = workspace:WaitForChild("Door")
local info = TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

TweenService:Create(part, info, { Transparency = 1 }):Play()
```

## Where to go next

* [Scripts and where they run](/guide/scripts) explains Script, LocalScript and ModuleScript.
* [Talking between server and client](/guide/networking) covers RemoteEvents and their limits.
* [Coming from Roblox](/guide/coming-from-roblox) lists the differences that trip people up.
* The [reference](/reference/services/) has every service, class, datatype and enum.

::: tip Using an AI assistant?
[VortexStudio-MCP](https://github.com/xRookieFight/VortexStudio-MCP) lets assistants like Claude read and edit your `.vrtx` project and check scripts against this API.
:::
