# Limits

Vortex protects servers from runaway scripts. Knowing the limits saves a lot of head scratching.

| Limit | What happens |
| --- | --- |
| **256 scripts** | Scripts beyond the 256th aren't started ("hit the 256 script limit"). |
| **Frame budget** | A script that runs too long in one frame gets its work dropped ("script over its frame budget"). Break long loops up with `task.wait()`. |
| **Lua heap** | Each script has a memory limit. Vortex runs a full garbage collection when a script gets close to it, so stay well below. |
| **Signal connections** | Each signal allows a limited number of connections ("exceeded ... connections"). Disconnect handlers you no longer need. |
| **Script queue** | Vortex warns when a script queues too much work in a single frame ("script queued more than ... in one frame"). |
| **Publish size** | A published game must stay under 100 MB. |

## Keeping within budget

```lua
-- this stalls the frame and gets dropped
for i = 1, 1e7 do
	doWork(i)
end

-- spread it out instead
for i = 1, 1e7 do
	doWork(i)
	if i % 1000 == 0 then
		task.wait()
	end
end
```

Store connections and disconnect them when the thing they watch goes away:

```lua
local connection = part.Touched:Connect(onTouched)

-- later
connection:Disconnect()
```

::: info
The exact numbers behind the budget, heap and connection limits aren't documented by Vortex and may change between versions.
:::
