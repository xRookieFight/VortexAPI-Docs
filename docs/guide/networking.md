# Talking between server and client

Server and client scripts don't share variables. They talk through objects that both sides can see, so put these in `ReplicatedStorage`.

| Object | Direction | Use it for |
| --- | --- | --- |
| [RemoteEvent](/reference/classes/remoteevent) | either way, no reply | "player pressed jump", "round started" |
| [RemoteFunction](/reference/classes/remotefunction) | either way, waits for a reply | "how many coins do I have?" |
| [BindableEvent](/reference/classes/bindableevent) | same side only | one server script notifying another |
| [BindableFunction](/reference/classes/bindablefunction) | same side only | one script asking another |

## RemoteEvent

```lua
-- LocalScript in StarterPlayerScripts
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

local Shoot = ReplicatedStorage:WaitForChild("Shoot")

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.UserInputType == Enum.UserInputType.MouseButton1 then
		Shoot:FireServer(workspace.CurrentCamera.CFrame.LookVector)
	end
end)
```

```lua
-- Script in ServerScriptService
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Shoot = ReplicatedStorage:WaitForChild("Shoot")

Shoot.OnServerEvent:Connect(function(player, direction)
	print(player.DisplayName, "shot towards", direction)
end)
```

The server side always gets the sending `player` as the first argument. To go the other way use `FireClient(player, ...)` or `FireAllClients(...)` on the server and `OnClientEvent` on the client.

## What you can send

Arguments may be:

* numbers, strings, booleans and `nil`
* `Vector3` and `Color3`
* tables made of the above

**Instances and CFrames can't be sent yet.** Vortex rejects them with "Instances cannot be sent through a RemoteEvent yet". Send something that identifies the object instead, like its name, or a `Vector3` position:

```lua
-- instead of Hit:FireServer(part)
Hit:FireServer(part.Name, part.Position)
```

## RemoteFunction

```lua
-- server
GetCoins.OnServerInvoke = function(player)
	return coins[player.UserId] or 0
end
```

```lua
-- client
local amount = GetCoins:InvokeServer()
```

`InvokeServer` waits for the answer, so keep server handlers fast. If no handler is set, Vortex reports "RemoteFunction has no OnServerInvoke".

::: tip Trust the server
Clients can send anything. Check arguments on the server before acting on them, for example that a number is in range or that the player is close enough to what they claim to touch.
:::
