let express = require("express");
let app = express();
app.set("view engine", "hbs");

const mysql = require("mysql2");
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111"
});

connection.query("CREATE DATABASE IF NOT EXISTS shopdb",
    function (err, results) {
        if (err) console.log(err);
        else console.log("База данных создана");
    }
);
connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "shopdb"
});

let sql = `create table if not exists product(
  id int primary key auto_increment,
  name text not null,
  price int not null default 1
)`;

connection.query(sql, function (err, results) {
    if (err) console.log(err);
    else console.log("Таблица product создана");
});

sql = `create table if not exists productData(
  id int primary key auto_increment,
  productId int not null,
  color enum('white', 'yellow', 'red', 'blue', 'green', 'black') not null default 'black',
  quantity int not null default 1,
  location text not null,
  foreign key (productId) references product (id)
)`;

connection.query(sql, function (err, results) {
    if (err) console.log(err);
    else console.log("Таблица productData создана");
});
app.use(express.static(__dirname + "/public"));

app.get("/shop", function (request, response) {
    connection.query("SELECT productId, name, price, color, quantity, location FROM product INNER JOIN productData ON product.id = productData.productId", function (err, results, fields) {
        if (err) console.log(err);
        else {
			let products = [];
			for (let i = 0; i < results.length; i++) {
				if (i == 0 || results[i - 1].productId != results[i].productId)
					products.push({
						productId: results[i].productId,
						name: results[i].name,
						price: results[i].price,
						data: []
					});
				products[products.length - 1].data.push({
					color: results[i].color,
					quantity: results[i].quantity,
					location: results[i].location
				});
			}
			if (request.query.type == 'json')
				response.send(products);
			else
				response.render("index.hbs", {
					products,
					productsString: JSON.stringify(products)
				});
		}
    });
});

app.post("/shop/:productId", function (request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
    console.log(request.params["productId"]);
    response.redirect("shop");
});
app.listen(3000, () => {console.log("Прослушивание порта 3000")});