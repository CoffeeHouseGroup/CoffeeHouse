const addProductsToAPI = (proArr) => {
	for (var pro of proArr) {
		callBackAPI(
			`${URL_API}${CATEGORIES}${pro.CategoryId}${PRODUCTS}`,
			"post",
			pro
		);
	}
};


var imgArr = [
	"https://i.ibb.co/DCRHc5t/4.jpg",
	"https://i.ibb.co/CQtTJzK/5.jpg",
	"https://i.ibb.co/yYgV0WJ/6.jpg",
	"https://i.ibb.co/HxQSZyD/10.jpg",
	"https://i.ibb.co/Qnr9sC0/11.jpg",
	"https://i.ibb.co/x8Cjqqm/13.jpg",
	"https://i.ibb.co/Sn4sFnQ/22.webp",
	"https://i.ibb.co/F32ZQzR/23.webp",
];
const productArr = [
	new Product(
		1,
		1,
		"Milk Coffee",
		imgArr[0],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		2,
		1,
		"Espresso Coffee",
		imgArr[1],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		3,
		1,
		"Latte Coffee",
		imgArr[2],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		5,
		"Trung Nguyên"
	),
	new Product(
		4,
		1,
		"Original Coffee",
		imgArr[3],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		3,
		"Trung Nguyên"
	),
	new Product(
		1,
		2,
		"Milk Coffee",
		imgArr[4],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		2,
		2,
		"Espresso Coffee",
		imgArr[5],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		3,
		2,
		"Latte Coffee",
		imgArr[6],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		5,
		"Trung Nguyên"
	),
	new Product(
		4,
		2,
		"Original Coffee",
		imgArr[7],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		3,
		"Trung Nguyên"
	),
	new Product(
		1,
		3,
		"Milk Coffee",
		imgArr[0],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		2,
		3,
		"Espresso Coffee",
		imgArr[1],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		3,
		3,
		"Latte Coffee",
		imgArr[2],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		5,
		"Trung Nguyên"
	),
	new Product(
		4,
		3,
		"Original Coffee",
		imgArr[3],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		3,
		"Trung Nguyên"
	),
	new Product(
		1,
		4,
		"Milk Coffee",
		imgArr[4],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		2,
		4,
		"Espresso Coffee",
		imgArr[5],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		4,
		"Trung Nguyên"
	),
	new Product(
		3,
		4,
		"Latte Coffee",
		imgArr[6],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		5,
		"Trung Nguyên"
	),
	new Product(
		4,
		4,
		"Original Coffee",
		imgArr[7],
		20000,
		"Cà phê sữa được làm từ sữa :)",
		3,
		"Trung Nguyên"
	),
];

