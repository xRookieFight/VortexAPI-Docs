# Coming from Roblox

Vortex borrows Roblox's object model and much of its API, so most code reads the same. The catch is that a lot is missing, and copied Roblox code fails at runtime. When in doubt, look the name up in the [reference](/reference/services/): if it isn't listed, assume Vortex doesn't have it.

## Services

Vortex has `Workspace`, `Players`, `RunService`, `UserInputService`, `TweenService`, `Debris`, `ReplicatedStorage`, `ServerScriptService`, `StarterPlayerScripts` and `Lighting`.

Not available, among others: `DataStoreService`, `HttpService`, `MarketplaceService`, `TeleportService`, `SoundService`, `PathfindingService`, `CollectionService`, `ContextActionService`, `StarterGui`, `StarterPack`, `ServerStorage`, `Teams`, `PhysicsService`.

## Classes you can create

`Instance.new` accepts the classes marked creatable on the [classes page](/reference/classes/): parts, models, folders, the three script kinds, remotes and bindables, lights, value objects and body movers. There are no GUI objects, sounds, particles, decals, welds or constraints.

## Parts

* Shapes: Block, Wedge, CornerWedge, Cylinder, Ball. Trusses and spawn locations are parts with a flag set in Studio.
* [Materials](/reference/enums#material): SmoothPlastic, Plastic, Wood, Metal, Grass, Ice, Paint. No Neon, Glass or Concrete.
* Surfaces have Studs or Inlets.

## Datatypes

`Vector3`, `CFrame`, `Color3` and `TweenInfo` cover the common cases, but not every constructor exists. For example `Color3.fromHSV` and `Color3.fromHex` are missing, use `Color3.fromRGB` or `Color3.new`. There's no `Vector2`, `UDim2`, `BrickColor`, `Ray` or `NumberSequence`.

## Networking

RemoteEvents and RemoteFunctions can't carry Instances or CFrames yet. See [networking](/guide/networking) for what you can send.

## Attributes

`SetAttribute` only accepts `nil`, booleans, numbers and strings from scripts.

## Old globals

`wait()` still exists but use `task.wait()`, `task.spawn()` and `task.delay()` instead.

## Checking code automatically

[VortexStudio-MCP](https://github.com/xRookieFight/VortexStudio-MCP) has a linter that flags all of the above: Roblox only services and classes, unknown enum items, missing datatype members and client or server only APIs used on the wrong side.
