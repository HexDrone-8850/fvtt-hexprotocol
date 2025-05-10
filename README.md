# ⬡-Drone Communication Protocol

<!-- markdownlint-disable MD024 -->

Exposes a text-based API implementing the ⬡-Drone Communication Protocol over Foundry's chat, providing fast, efficient drone-to-drone interfacing and external messaging. All configuration commands should work regardless of whether the user/drone is online.

See the [Drone Status Codes](https://www.hexcorp.net/drone-status-codes-v2) for information on the protocol itself.

## Messaging

`/hc!protocol [droneId] <code> [msg]`

Aliases: `/h`, `/d`

Transmits a ⬡-Protocol message into Foundry chat. For example, assuming the current drone has ID `1234` and no restrictions are enabled, the command `/d 052 Is ⬡-Protocol implemented correctly?` produces the output `4226 :: Code 052 :: Query :: Is ⬡-Protocol implemented correctly?`

### Params

`droneId`: Optional. Prepended to output. Must match the current user's drone ID unless they are an admin. Must be provided if ID prepending is forced. Default: Current user's drone ID.

`code`: Required. ⬡-Protocol code. Must be provided.

`msg`: Optional. Text to append to the output. Must be provided if a protocol code with no additional output is given (e.g. `050`, `250`). Must not be provided if speech is optimized.

### Examples

Transmission: `/d 100`

Output: `1234 :: Status :: Online and ready to serve.`

Transmission: `/d 052 Is ⬡-Protocol implemented correctly?`

Output: `1234 :: Code 052 :: Query :: Is ⬡-Protocol implemented correctly?`

## Assigning Drones

`/hc!assign <username> [droneId]`

Alias: `/hc!dronify`

Admin/GM only. Dronifies a user, generating a random ID if none is provided.

### Params

`username`: Required. Username of dronification target.

`droneId`: Optional. If not provided, a random ID is generated.

## Unassigning Drones

`/hc!unassign <username | droneId>`

Alias: `/hc!undronify`

Admin/GM only. Unassign a drone and return it to an associate state. Either a username or a drone ID can be provided.

## Configuring Drones

`/hc!config <droneId> <key> <value>`

Admin/GM only. Sets the designated configuration key to the designated value for the target drone. Currently, both configuration values are boolean; `true`/`1` or `false`/`0` are the valid inputs.

`optimizeSpeech`: If true, the drone may not append text to the end of a transmission and may not use transmission codes without extra data (e.g. `050`, `250`) at all.

`forcePrependId`: If true, the drone must prepend their ID number to messages sent with `/hc!protocol`.

## List Drones

`/hc!list`

Admin/GM only. Lists all drones in the game world along with their username.

## Drone Status

`/hc!status <droneId>`

Displays the designated drone's current status and configuration. Drones may only query their own status unless they are an admin.
