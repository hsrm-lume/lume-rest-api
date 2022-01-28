# Lume Rest-API

Restful NodeJS-API to create Tree Nodes in Neo4j db

## REST-Routes

**POST** `/v1/new`

```ts
{
    "uuidParent": <uuid>,  // UUID of the already lit device
    "uuidChild":  <uuid>,  // UUID of the device to light
    "position": {
        "lat": <float>,    // Latitude  between - 90 & + 90
        "lng": <float>     // Longitude between -180 & +180
    }
}
```

**GET** `/v1/ready`

Returns 200 if Neo4j is ready, else 503

---

## Deployment

The app can be containerized with the [Dockerfile](Dockerfile) by running `docker build .`

The following GitHub-Actions can help deploying the app:

-   [Build](.github/workflows/build.yml) just builds the app.  
    Is used for branch protection and minimal automated testing
-   [DockerPublish](.github/workflows/docker-publish.yml) builds the app using the [Dockerfile](Dockerfile) of this repository.  
    The image then gets pushed to the [ghcr.io Registry](https://github.com/hsrm-lume/lume-rest-api/pkgs/container/lume-rest-api)

---

## Code Structure

| directory      | what is there?                        |
| -------------- | ------------------------------------- |
| .github        | yaml-Definitions of GitHub-Actions    |
| .vscode        | Editor configuration                  |
| src/config     | Configuration                         |
| src/controller | Actions bound to routes               |
| src/router     | Definitions and helpers for routes    |
| src/services   | Services supplied for the controllers |
| src/util       | Helpers                               |
| src/types      | Type extensions / definitions         |

To test / develop the API, a neo4j-container can be started through the [docker-compose.yml](docker-compose.yml) file.

A root-node has to be inserted manually for the API to work:

```cypher
MERGE (b:User { uuid: "00000000-0000-4000-A000-000000000000", litTime: 1609459200000, lat: 50.09692895957101, lng: 8.21682929992676 });
CREATE CONSTRAINT uuid_unique FOR (u:User) REQUIRE u.uuid IS UNIQUE;
```
