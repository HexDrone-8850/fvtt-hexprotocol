# ⬡-Drone Communication Protocol

Exposes a text-based API implementing the ⬡-Drone Communication Protocol, providing fast, efficient drone-to-drone interfacing and external messaging.

Inspired by and dedicated to the good and cute drones at [HexCorp](https://www.hexcorp.net/)! Reference the [Drone Status Codes](https://www.hexcorp.net/drone-status-codes-v2) for information on the protocol itself, including the list of codes.

## Usage

Parameters enclosed in `<>` are required. Parameters enclosed in `[]` are optional. All commands except `/hc!protocol` and `/hc!status` are only valid for GMs and registered administration drones. A user does not need to be online to be registered as a drone and configured.

### ⬡-Protocol Transmission

`/hc!protocol [droneId] <code> [msg]`

Aliases: `/h`, `/d`

Transmit a ⬡-Protocol message into chat. If given, `droneId` must match the transmitting drone's ID or the drone must be an admin. It is required if `forcePrependId` is set in the drone's configuration. `msg` is required for codes with no additional content, such as `050`. Specifying `msg` is a protocol error if the drone's speech is optimized.

For example, assume the current drone has ID `1234` and no restrictions are enabled. The command `/d 100` would produce the output `1234 :: Code 100 :: Status :: Online and ready to serve.` The command `/d 050 Mind control is fun.` would produce the output `1234 :: Code 050 :: Statement :: Mind control is fun.`

### Asset Registration

**Register Drone:** `/hc!register <username> [droneId]`

Alias: `/hc!dronify`

Register the designated user as a drone and assign it an ID. If no ID is provided, one will be randomly generated.

**Unregister Drone:** `/hc!unregister <droneId | username>`

Alias: `/hc!undronify`

Unregister the designated drone and return it to Associate status. Either a drone ID or a username can be provided.

### Drone Configuration

`/hc!config <droneId> <key> <value>`

Set the designated configuration key to the designated value for the target drone. Acceptable values are `true` or `1`; and `false` or `0`.

`isAdmin`: If true, the drone has admin privileges for purposes of this module. As a GM users always have admin privileges regardless of whether they are drones.

`optimizeSpeech`: If true, the drone may not append text to the end of a transmission and may not use transmission codes without extra data (e.g. `050`, `250`) at all.

`forcePrependId`: If true, the drone must prepend their ID number when inputting a transmission.

### Other Commands

**List Drones:** `/hc!list`

List all drones in the game world along with their username.

**Drone Status:** `/hc!status <droneId>`

Display the designated drone's current status and configuration. Any drone may query its own status. Admins may query any drone's status.

**Explain Error Code:** `/hc!explain <errorCode>`

`errorCode` must be a 2-digit protocol error code.

## Global Settings

### Protocol Extensions

This library includes two optional extension codes to expedite communication in a tabletop RPG context. GM users may choose to disallow them on an individual basis using the module settings..

`700: OOC`

A ⬡-Protocol-flavored alternative to the built-in `/ooc` command.

### Bullying

This module's default behavior is to bully non-admin, non-GM users by having faulty transmissions display an opaque error code instead of any meaningful information. This behavior can be toggled off in the module settings by a GM user.
