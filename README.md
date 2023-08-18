# A thunderbird plugin to automatically import Fastmail identities

## Install

Caution: This extension is at its prototyping stage. Use at your own risk. There will be breaking changes anytime.

1. Clone this repo.

2. Copy `token.mjs.repo` to `token.js`. Follow Fastmail's instructions to [get an API token](https://www.fastmail.com/for-developers/integrating-with-fastmail/).

   - The new token should have access to
     - Email `urn:ietf:params:jmap:mail`
     - Email submission `urn:ietf:params:jmap:submission`
     - Masked email `https://www.fastmail.com/dev/maskedemail`

3. Follow instructions in this Thunderbird's tutorial to install this as a [temporary extension](https://developer.thunderbird.net/add-ons/hello-world-add-on#installing)

## Usage

This extensions currently imports identities only when it first loads.

It gets all the Fastmail accounts the API token has access to and import identities from accounts with matching Thunderbird account name.

## Troubleshooting

[Open Thunderbird's error console](https://developer.thunderbird.net/add-ons/hello-world-add-on#installing).

## TODOs

- [x] Import identities during start up
- [ ] Create XPI
- [ ] OAuth screen to get Fastmail token
- [ ] Save token in storage (security requirements?)
- [ ] Import identities periodically / when composing message
