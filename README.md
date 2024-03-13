# Backend REST API für die Fallstudie Blog

## Setup

```bash
   $ npm install
```

(Im Projektroot ausführen)

Server laufen lassen:

```bash
   npm run dev
```

Der Port kann in der Datei .env angepasst werden.

# Authentifizierung aktivieren

Um die Authentifizierung zu aktivieren, muss in der Datei .env folgende Zeile gelöscht werden:

```bash
DISABLE_AUTH=true
```

## Postman collection

Die Datei Fallstudie-backend.postman_collection.json kann in Postman importiert werden und enthält alle API Aufrufe.

## Routen

### POST /api/authenticate

Request:
```json
{
    "email": "adamadmin@blog.ch",
    "password": "admin1234"
}
```

Response:

```json
{
    "token": "ey...",
    "user": {
        "name": "Adam Admin"
    }
}
```

### GET /api/posts

Response:

```json
[
    {
        "id": 3,
        "title": "My trhid post",
        "text": "First post text",
        "createdAt": "2023-06-15T08:56:51.655Z",
        "updatedAt": "2023-06-15T08:56:51.655Z"
    },
    {
        "id": 2,
        "title": "My second post",
        "text": "First post text",
        "createdAt": "2023-06-15T08:56:51.655Z",
        "updatedAt": "2023-06-15T08:56:51.655Z"
    },
    {
        "id": 1,
        "title": "My first post",
        "text": "First post text",
        "createdAt": "2023-06-15T08:56:51.655Z",
        "updatedAt": "2023-06-15T08:56:51.655Z"
    }
]
```

### GET /api/posts/:id

/api/posts/1

```json
{
    "id": 1,
    "title": "My first post",
    "text": "First post text",
    "createdAt": "2023-06-15T08:56:51.655Z",
    "updatedAt": "2023-06-15T08:56:51.655Z"
}
```

### POST /api/posts

Request:

```json
{
    "title":"New post title",
    "text": "New post text"
}
```

Response:

```json
{
    "id": 4,
    "title": "New post title",
    "text": "New post text",
    "updatedAt": "2023-06-15T11:13:16.627Z",
    "createdAt": "2023-06-15T11:13:16.627Z"
}
```

### PUT /api/posts/:id

Request:

```json
{
    "id": 4,
    "title": "Edited title",
    "text": "Edited text"
}
```

Response:

```json
{
    "id": 4,
    "title": "Edited title",
    "text": "Edited text",
    "createdAt": "2023-06-15T11:13:16.627Z",
    "updatedAt": "2023-06-15T11:14:57.303Z"
}
```

### DELETE /api/posts/:id

Response:

```json
{
    "message": "Post deleted"
}
```