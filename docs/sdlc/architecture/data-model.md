# Data Model

<!-- sdlc:auto:start entities -->
### users

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| email | varchar(320) unique, lowercased | False | — | False |
| password_hash | text (argon2id) | False | — | False |
| created_at | timestamptz | False | — | False |
| password_changed_at | timestamptz | False | — | True |

### user_sessions

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | char(64) unique (sha256 of random token) | False | — | False |
| created_at | timestamptz | False | — | False |
| expires_at | timestamptz | False | — | False |
| revoked_at | timestamptz | False | — | True |

### documents

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| filename | varchar(255) | False | — | False |
| format | varchar(8) check in (pdf, txt, md) | False | — | False |
| size_bytes | integer | False | — | False |
| s3_key | text | False | — | True |
| status | varchar(16) check in (processing, ready, failed) | False | — | False |
| failure_reason | text | False | — | True |
| chunk_count | integer default 0 | False | — | False |
| created_at | timestamptz | False | — | False |

### document_chunks

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| document_id | uuid on delete cascade | False | documents.id | False |
| user_id | uuid | False | users.id | False |
| chunk_index | integer | False | — | False |
| page_number | integer (PDF only) | False | — | True |
| char_start | integer | False | — | False |
| char_end | integer | False | — | False |
| content | text | False | — | False |
| embedding | vector(1536) with HNSW vector_cosine_ops index | False | — | False |

### chats

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| name | varchar(120) check length > 0 | False | — | False |
| created_at | timestamptz | False | — | False |
| last_message_at | timestamptz | False | — | True |

### chat_documents

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| chat_id | uuid on delete cascade | True | chats.id | False |
| document_id | uuid on delete cascade | True | documents.id | False |
| attached_at | timestamptz | False | — | False |

### messages

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| chat_id | uuid on delete cascade | False | chats.id | False |
| user_id | uuid | False | users.id | False |
| role | varchar(16) check in (user, assistant) | False | — | False |
| content | text | False | — | False |
| answer_kind | varchar(16) check in (grounded, not_found), assistant only | False | — | True |
| turn_status | varchar(16) check in (pending, complete, failed), user only | False | — | True |
| reply_to_id | uuid | False | messages.id | True |
| created_at | timestamptz | False | — | False |

### message_citations

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| message_id | uuid on delete cascade | False | messages.id | False |
| ordinal | integer | False | — | False |
| chunk_id | uuid on delete set null | False | document_chunks.id | True |
| document_id | uuid on delete set null | False | documents.id | True |
| document_name | varchar(255) snapshot | False | — | False |
| page_number | integer | False | — | True |
| chunk_index | integer | False | — | False |
| passage_text | text snapshot | False | — | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
| Source | Target | Type |
|---|---|---|
| users | user_sessions | one-to-many |
| users | documents | one-to-many |
| documents | document_chunks | one-to-many |
| users | chats | one-to-many |
| chats | chat_documents | one-to-many |
| documents | chat_documents | one-to-many |
| chats | messages | one-to-many |
| messages | message_citations | one-to-many |
| document_chunks | message_citations | one-to-many |
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  users {
    uuid id PK
    varchar_320__unique__lowercased email
    text__argon2id_ password_hash
    timestamptz created_at
    timestamptz password_changed_at
  }
  user_sessions {
    uuid id PK
    uuid user_id FK
    char_64__unique__sha256_of_random_token_ token_hash
    timestamptz created_at
    timestamptz expires_at
    timestamptz revoked_at
  }
  documents {
    uuid id PK
    uuid user_id FK
    varchar_255_ filename
    varchar_8__check_in__pdf__txt__md_ format
    integer size_bytes
    text s3_key
    varchar_16__check_in__processing__ready__failed_ status
    text failure_reason
    integer_default_0 chunk_count
    timestamptz created_at
  }
  document_chunks {
    uuid id PK
    uuid_on_delete_cascade document_id FK
    uuid user_id FK
    integer chunk_index
    integer__PDF_only_ page_number
    integer char_start
    integer char_end
    text content
    vector_1536__with_HNSW_vector_cosine_ops_index embedding
  }
  chats {
    uuid id PK
    uuid user_id FK
    varchar_120__check_length___0 name
    timestamptz created_at
    timestamptz last_message_at
  }
  chat_documents {
    uuid_on_delete_cascade chat_id PK,FK
    uuid_on_delete_cascade document_id PK,FK
    timestamptz attached_at
  }
  messages {
    uuid id PK
    uuid_on_delete_cascade chat_id FK
    uuid user_id FK
    varchar_16__check_in__user__assistant_ role
    text content
    varchar_16__check_in__grounded__not_found___assistant_only answer_kind
    varchar_16__check_in__pending__complete__failed___user_only turn_status
    uuid reply_to_id FK
    timestamptz created_at
  }
  message_citations {
    uuid id PK
    uuid_on_delete_cascade message_id FK
    integer ordinal
    uuid_on_delete_set_null chunk_id FK
    uuid_on_delete_set_null document_id FK
    varchar_255__snapshot document_name
    integer page_number
    integer chunk_index
    text_snapshot passage_text
  }
  users ||--o{ user_sessions : "one-to-many"
  users ||--o{ documents : "one-to-many"
  documents ||--o{ document_chunks : "one-to-many"
  users ||--o{ chats : "one-to-many"
  chats ||--o{ chat_documents : "one-to-many"
  documents ||--o{ chat_documents : "one-to-many"
  chats ||--o{ messages : "one-to-many"
  messages ||--o{ message_citations : "one-to-many"
  document_chunks ||--o{ message_citations : "one-to-many"
```
<!-- sdlc:auto:end er-diagram -->
