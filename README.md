# Video API Project

## Overview

This project is a **Video API System** that offers the following features:

1. Uploading videos with customizable size and duration limits.
2. Trimming uploaded videos based on user specifications.
3. Merging several video clips into a single video.
4. Sharing videos through links that have time-based expiration.
5. Serving videos as streams or direct downloads.

The project utilizes the following technologies:

- Node.js
- Express
- SQLite
- FFmpeg

---

## Requirements

- **Node.js**: `^22.11.0`
- **FFmpeg**: Must be installed and accessible in the system's PATH.

---

## Assumptions and Design Choices

1. **Static API Tokens**:
   - A static token is employed for authentication for simplicity (`Bearer your-static-api-token`).

2. **File Storage**:
   - Video files are stored locally in the `uploads/` directory. For production, a cloud storage solution (e.g., AWS S3) is recommended.

3. **Video Processing**:
   - **FFmpeg** is required for video operations such as trimming and merging.

4. **Database**:
   - **SQLite** is chosen for easy setup. For production, a more scalable database like PostgreSQL or MySQL is suggested.

5. **Testing**:
   - Tests utilize a test dataset, ensuring that no mocks are used in end-to-end tests.

---

## Setup Instructions


### 1. Install Dependencies

```bash
npm install
```

## Commands

### Start the Server

```bash
npm start
```

The server will be accessible at `http://localhost:3000`.


### Run Tests

```bash
npm run test
```

### View Test Coverage

```bash
npm run test:coverage
```

---

## Database Schema Design


### 1. **Users Table**

This table holds information about the users of the system.
| Column Name   | Data Type   | Constraints          | Description                     |
|---------------|-------------|----------------------|---------------------------------|
| `id`          | `int`       | Primary Key, Auto Increment | Unique identifier for the user.
| `username`    | `text`      | Not Null, Unique     | Username of the user.
| `token`       | `varchar`   | Not Null            | Static token for authentication.



### 1. **Videos Table**

This table holds information about the video files uploaded to the system.

| Column Name   | Data Type   | Constraints          | Description                     |
|---------------|-------------|----------------------|---------------------------------|
| `id`          | `int`       | Primary Key, Auto Increment | Unique identifier for the video. |
| `name`    | `text`      | Not Null            | Name of the video.
| `path`    | `text`      | Not Null            | Path to the video file in storage. |
| `size`        | `float`     | Not Null            | Size of the video file. |
| `duration`    | `int`       | Not Null            | Duration of the video (in seconds). |
| `user`    | `int`       | Not Null, Foreign Key | Links to the associated user in the `users` table.
| `uploaded_at`  | `datetime`  | Default: `CURRENT_TIMESTAMP` | Timestamp of when the video was uploaded. |

### 2. **Public Links Table**

This table manages the sharing links for videos, enabling users to share videos with unique URLs and expiration times.

| Column Name   | Data Type   | Constraints          | Description                     |
|---------------|-------------|----------------------|---------------------------------|
| `id`          | `int`       | Primary Key, Auto Increment | Unique identifier for the shared link. |
| `video`     | `int`       | Not Null, Foreign Key | Links to the associated video in the `videos` table. |
| `slug`        | `text`      | Not Null, Unique     | Unique slug for the shared link. |
| `expires_at`   | `datetime`  | Not Null            | Timestamp for when the link will expire. |
| `created_at`   | `datetime`  | Default: `CURRENT_TIMESTAMP` | Timestamp of when the shared link was created. |

### ER Diagram

```plaintext
+------------+       +------------------+
|   Videos   |       |   Shared Links   |
+------------+       +------------------+
| id         |<----->| video            |
| filePath   |       | id               |
| size       |       | slug             |
| duration   |       | expire_at        |
| uploadedAt |       | created_at       |
| user       |<- |   |                  |
+------------+   |   +------------------+
```              |  |
+------------+   |
|   Users    |   |    
+------------+   |   
| id         |<---
| username   |      
| token      |      
+------------+   


---

## Postman Collection

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://red-astronaut-537910.postman.co/workspace/videoverse-video~a36a5b78-41fc-44dd-8aaf-86e31f86c511/collection/18671452-27c712cf-f2fd-4b2d-a268-a8d470a9e91b?action=share&creator=18671452)

Note: Ensure to register the user and add the Authorization API token to the collection before testing the APIs.

---

## API Documentation

### Authentication

All endpoints (except `GET /:slug` , `POST /register`) require the following header:

```json
{
  "Authorization": "Bearer {token}"
}
```

Note: The auth token is kept as a static value for each user

### Endpoints

#### 1. **Video Upload**

- **POST /api/v1.0/upload**
- Uploads a video file.

**Headers**:

- Authorization: `Bearer yZBekCcz5zxbmXR2Fxo1jt8I5S8OFsby`

**Body (Form-Data)**:

- `video`: File (MP4/MOV)

#### 2. **Video Trimming**

- **POST /api/v1.0/trim/:id**
- Trims a video based on start and end times.

**Body**:

```json
{
  "start": 5,
  "end": 15
}
```

#### 3. **Video Merging**

- **POST /api/v1.0/merge**
- Merges multiple video clips.

**Body**:

```json
{
  "videos": [1, 2, 3]
}
```

#### 4. **Create Shared Link**

- **POST /api/v1.0/share**
- Generates a time-limited shared link.

**Body**:

```json
{
  "video": 1,
  "ttl": 30
}
```

#### 5. **Retrieve Shared Link**

#### 6. **Get Shared Video**

- **GET \<host\>/:slug**
- Example: <http://localhost:3000/7bbf0599>
- Streams or downloads a video based on the header:

**Header**:

- `Content-Disposition: inline` for streaming.
- `Content-Disposition: attachment` for download.

---

## References

- <https://www.npmjs.com/package/fluent-ffmpeg>
- <https://www.ffmpeg.org/>
- <https://www.sqlite.org/>
- <https://www.npmjs.com/package/jest>

---

## Future Enhancements

1. **Token-Based Authentication**:
   - Transition from static tokens to JWT or OAuth for improved security.

2. **Cloud Storage**:
   - Implement AWS S3 or Google Cloud Storage for better scalability.

3. **Video Processing Queue**:
   - Delegate video processing tasks to a job queue (e.g., Bull, kafka).

4. **Caching**:
   - Utilize Redis for caching shared link metadata with video expiry

5. **Dockerization**:
   - Utilize Docker for containerization and deployment.


---