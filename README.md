# Lume Rest-API

Restful API to create Tree Nodes in Neo4j db

## Create a new Contact Point

**POST** `/v1/new`

```jsonc
{
    uuidParent: <uuid>, // UUID of the already lit device
    uuidChild: <uuid>,  // UUID of the device to light
    position: {
        lat: <float>,   // Latitude  between - 90 & + 90
        lng: <float>    // Longitude between -180 & +180
    }
}
```
