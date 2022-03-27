
# Backend CRUD dengan Node JS

API yang dapat digunakan untuk CRUD data postingan seperti blog pada umumnya dengan database berupa file JSON.



## Run Locally

Clone the project

```bash
  git clone https://github.com/taqiyyaghazi/backend-post-crud-nodejs.git
```

Go to the project directory

```bash
  cd backend-post-crud-nodejs
```

Start the server

```bash
  npm run start
```


## API Reference

#### Get all post

```http
  GET /get_all_post
```

| Parameter | Type      | Description                |
| :-------- | :-------- | :------------------------- |
| `   -   ` | `   -   ` | -                          |
 
#### Get query post

```http
  GET /get_query_post
```

| Parameter | Type      | Description                       |
| :-------- | :-------- | :-------------------------------- |
| `id`      |   `int`   | **Required**. Id of item to fetch |

#### Insert new post

```http
  POST /insert_new_post
```

|    Body     | Type     | Description                            |
| :---------- | :------- | :------------------------------------- |
| `judul`     | `string` | **Required**. Title of item  post      |
| `kategori`  | `string` | **Required**. Category of item post    |
| `deskripsi` | `string` | **Required**. Description of item post |

#### Update post

```http
  PUT /update_post
```

|    Body     | Type     | Description                                 |
| :---------- | :------- | :------------------------------------------ |
| `id`        |  `int`   | **Required**. Id of the item to be updated  |
| `judul`     | `string` | Title of item  post                         |
| `kategori`  | `string` | Category of item post                       |
| `deskripsi` | `string` | Description of item post                    |

#### Delete post

```http
  DELETE /delete_data_post
```

| Parameter | Type      | Description                       |
| :-------- | :-------- | :-------------------------------- |
| `id`      |   `int`   | **Required**. Id of item to fetch |

## Authors

- [@taqiyyaghazi](https://github.com/taqiyyaghazi)

