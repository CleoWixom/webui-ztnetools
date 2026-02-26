# ZTNET Tools

ZTNET Tools is a web UI and Go backend for ZeroTier-powered exit-node setup automation.

## Prerequisites

- Go **1.22+**
- Node.js **20+**
- `zerotier-one` installed and running on the host

## Development

Run the backend and frontend development server together:

```bash
make dev
```

- The Go server runs from `./cmd/server`.
- The Vite frontend runs in dev mode.
- Vite proxies `/api` requests to `http://localhost:3001`.

## Production build and run

Create production artifacts:

```bash
make build
```

This builds:

- backend binary: `dist/server`
- frontend production bundle

Run in production:

```bash
sudo ./dist/server
```

## Why `sudo` / root is required

The exit-node setup flow performs privileged host networking operations, including:

- writing kernel routing and forwarding settings with `sysctl`
- configuring packet forwarding/NAT using `iptables`

These actions require root privileges on Linux, so the server process must be run as root (or with equivalent capabilities).

## API spec: `POST /api/exit-node/setup`

Configures the host as a ZeroTier exit node and enables forwarding/NAT.

### Request schema

`Content-Type: application/json`

```json
{
  "networkId": "string, required",
  "interface": "string, required",
  "clientManagedRoutes": "boolean, optional, default true",
  "natInterface": "string, optional, auto-detected if omitted",
  "persist": "boolean, optional, default false"
}
```

#### Field details

- `networkId` (string, required): ZeroTier network ID to configure.
- `interface` (string, required): ZeroTier interface to use (for example `ztxxxxxxxx`).
- `clientManagedRoutes` (boolean, optional): whether to advertise managed routes to clients.
- `natInterface` (string, optional): egress interface used for NAT (for example `eth0`).
- `persist` (boolean, optional): when true, attempts to persist sysctl/iptables configuration.

### Success response schema

`200 OK`

```json
{
  "status": "ok",
  "message": "Exit-node setup complete",
  "data": {
    "networkId": "8056c2e21c000001",
    "interface": "ztabc123",
    "natInterface": "eth0",
    "ipForwardingEnabled": true,
    "iptablesRulesApplied": true,
    "persisted": false
  }
}
```

### Error response schema

#### Validation error

`400 Bad Request`

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "networkId and interface are required",
    "details": {
      "fields": ["networkId", "interface"]
    }
  }
}
```

#### Privilege error

`403 Forbidden`

```json
{
  "status": "error",
  "error": {
    "code": "INSUFFICIENT_PRIVILEGES",
    "message": "root privileges are required to configure iptables/sysctl"
  }
}
```

#### Runtime/configuration error

`500 Internal Server Error`

```json
{
  "status": "error",
  "error": {
    "code": "EXIT_NODE_SETUP_FAILED",
    "message": "Failed to apply NAT rule",
    "details": {
      "command": "iptables -t nat ...",
      "stderr": "Permission denied"
    }
  }
}
```

### cURL example

```bash
curl -X POST http://localhost:3001/api/exit-node/setup \
  -H 'Content-Type: application/json' \
  -d '{
    "networkId": "8056c2e21c000001",
    "interface": "ztabc123",
    "clientManagedRoutes": true,
    "natInterface": "eth0",
    "persist": false
  }'
```
