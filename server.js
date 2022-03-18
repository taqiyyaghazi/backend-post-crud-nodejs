// Import modul
const http = require("http");
const url = require("url");
const fs = require("fs");
const { on } = require("stream");

// Host and Port
const host = "localhost";
const port = 12345;

const requestListener = function (req, res) {
  const path_name = url.parse(req.url, true).pathname;

  switch (path_name) {
    //   API Index
    case "/":
      console.log("HIT API index");

      var response_payload = {
        deskripsi: "Sukses Mengakses API Portofolio Ghazi",
      };
      res.writeHead(200);
      res.end(JSON.stringify(response_payload));
      break;

    //   API untuk Mengambil Selurah Data Postingan
    case "/get_all_post":
      console.log("HIT API Get All Post");
      // Membaca json file
      fs.readFile("./data.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        var data = JSON.parse(jsonString);
        var response_payload = {
          deskripsi: "Sukses mendapatkan data postingan",
          result: data,
        };
        res.writeHead(200);
        res.end(JSON.stringify(response_payload));
      });
      break;

    //   API untuk Mengambil Data Sesuai dengan ID Postingan
    case "/get_query_post":
      console.log("HIT API Get Query Post");
      const parameters_get = url.parse(req.url, true).query;
      let data = undefined;
      fs.readFile("./data.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        if ("id" in parameters_get) {
          JSON.parse(jsonString)["post"].forEach(function (
            value,
            index,
            array
          ) {
            //   Mencari id_post yang sama dengan parameter id
            if (parameters_get["id"] == value["id_post"]) {
              data = JSON.parse(jsonString)["post"][index];
              var response_payload = {
                deskripsi: "Sukses mendapatkan data postingan",
                result: data,
              };
              res.writeHead(200);
              res.end(JSON.stringify(response_payload));
            }
          });
          if (data == undefined) {
            //   // Respon ketika id yang dicari tidak ada
            var response_payload = {
              deskripsi: "Data tidak ditemukan",
              result: "-",
            };
            res.end(JSON.stringify(response_payload));
          }
        } else {
          // Respon ketika parameter id belum ditentukan
          var response_payload = {
            deskripsi: "Parameter id belum ditentukan",
            result: "-",
          };
          res.end(JSON.stringify(response_payload));
        }
      });
      break;

    //   API untuk Menambah Postingan Baru
    case "/insert_new_post":
      console.log("HIT API Insert New Post");
      var body_insert = [];
      req
        .on("data", (chunk) => {
          body_insert.push(chunk);
        })
        .on("end", () => {
          body_insert = JSON.parse(Buffer.concat(body_insert).toString());

          var judul = body_insert["judul"];
          var kategori = body_insert["kategori"];
          var deskripsi = body_insert["deskripsi"];
          var tanggal = new Date();

          fs.readFile("./data.json", "utf8", (err, jsonString) => {
            if (err) {
              console.log("File read failed:", err);
              return;
            }
            var data = JSON.parse(jsonString);
            var list_id = data["id"].sort();
            var last_id_post = list_id[list_id.length - 1];
            var new_id = last_id_post + 1;

            var new_post = {
              id_post: new_id,
              judul: judul,
              tanggal: tanggal,
              kategori: kategori,
              deskripsi: deskripsi,
            };

            data["post"].push(new_post);
            data["id"].push(new_id);
            data = JSON.stringify(data);
            fs.writeFile("data.json", data, (err) => {
              if (err) throw err;
              var response_payload = {
                deskripsi: "Berhasil Menambah data",
                result: new_post,
              };
              res.end(JSON.stringify(response_payload));
            });
          });
        });
      break;

    //  API Update Postingan
    case "/update_post":
      console.log("HIT API Update Post");
      var body_update = [];
      req
        .on("data", (chunk) => {
          body_update.push(chunk);
        })
        .on("end", () => {
          body_update = JSON.parse(Buffer.concat(body_update).toString());

          fs.readFile("./data.json", "utf8", (err, jsonString) => {
            if (err) {
              console.log("File read failed:", err);
              return;
            }

            var data = JSON.parse(jsonString);

            if ("id_post" in body_update) {
              if (body_update["id_post"] in data["id"]) {
                data["post"].forEach(function (value, index, array) {
                  if (value["id_post"] == body_update["id_post"]) {
                    if ("judul" in body_update) {
                      data["post"][index]["judul"] = body_update["judul"];
                    }
                    if ("kategori" in body_update) {
                      data["post"][index]["kategori"] = body_update["kategori"];
                    }
                    if ("deskripsi" in body_update) {
                      data["post"][index]["deskripsi"] =
                        body_update["deskripsi"];
                    }
                    var data_edit = data["post"][index];
                    data = JSON.stringify(data);
                    fs.writeFile("data.json", data, (err) => {
                      if (err) throw err;
                      var response_payload = {
                        deskripsi: "Berhasil Menyunting data",
                        result: data_edit,
                      };
                      res.end(JSON.stringify(response_payload));
                    });
                  }
                });
              } else {
                var response_payload = {
                  deskripsi: "Postingan tidak ditemukan",
                  result: "-",
                };
                res.end(JSON.stringify(response_payload));
              }
            } else {
              var response_payload = {
                deskripsi: "ID postingan belum dimasukkan",
                result: "-",
              };
              res.end(JSON.stringify(response_payload));
            }
          });
        });
      break;

    //   API untuk Menghapus Data Postingan
    case "/delete_data_post":
      console.log("HIT API Delete Post");
      const parameters_delete = url.parse(req.url, true).query;

      fs.readFile("./data.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        var data = JSON.parse(jsonString);
        if ("id" in parameters_delete) {
          data["post"].forEach(function (value, index, array) {
            //   Mencari id_post yang sama dengan parameter id
            if (parameters_delete["id"] == value["id_post"]) {
              var data_delete = data["post"];
              var id_delete = data["id"];

              data_delete = data_delete.filter((item) => item !== value);
              id_delete = id_delete.filter((item) => item !== value["id_post"]);

              data["id"] = id_delete;
              data["post"] = data_delete;
              fs.writeFile("data.json", JSON.stringify(data), (err) => {
                if (err) throw err;
                var response_payload = {
                  deskripsi: "Berhasil Menghapus data",
                  result: data,
                };
                res.end(JSON.stringify(response_payload));
              });
            }
          });
          if (data["post"].length == JSON.parse(jsonString)["post"].length) {
            var response_payload = {
              deskripsi: "Data Tidak Ditemukan",
              result: "-",
            };
            res.end(JSON.stringify(response_payload));
          }
        } else {
          // Respon ketika parameter id belum ditentukan
          console.log("ID belum ditentukan");
          var response_payload = {
            deskripsi: "Parameter id belum ditentukan",
            result: "-",
          };
          res.end(JSON.stringify(response_payload));
        }
      });
      break;
  }
};

// Membuat sebuah server dan menjalankan server dengan fungsi listen()
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Base URL Server : http://${host}:${port}`);
});
