const DOUGHNUT_CHART_TYPE = "doughnut";
const LINE_CHART_TYPE = "line";
const BAR_CHART_TYPE = "bar";
const PRODUCT_ASSET_INDEX = 0;
const CUSTOMER_ASSET_INDEX = 1;
const BILL_ASSET_INDEX = 2;
const COUPON_ASSET_INDEX = 3;
const COLORS = [
	"#ef476f",
	"#ffd60a",
	"#0081a7",
	"#cdb4db",
	"#81b29a",
	"#e07a5f",
	"#219ebc",
];
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const assets = [new Asset(), new Asset(), new Asset(), new Asset()];
//const productCanvas = $("product-canvas");
//const data = {
//	labels: [],
//	datasets: [
//		{
//			label: "Number of quantity",
//			data: [],
//			borderColor: "#a2d2ff",
//			backgroundColor: COLORS,
//			datalabels: {
//				anchor: "center",
//				borderWidth: 0,
//			},
//		},
//	],
//};
//const options = {
//	scales: {
//		y: {
//			ticks: {
//				stepSize: 1,
//			},
//		},
//	},
//	plugins: {
//		datalabels: {
//			formatter: (value, context) => {
//				var data = context.chart.data.datasets[0].data;
//				var sum = data.reduce((a, b) => {
//					return a + b;
//				});
//				return Math.round((value / sum) * 100) + "%";
//			},
//			backgroundColor: "white",
//			borderRadius: 5,
//			color: "black",
//			font: {
//				weight: "bold",
//			},
//			padding: 10,
//		},
//	},
//};

const drawChart = (canvas, type, asset, options) => {
	var dataChart = JSON.parse(JSON.stringify(data));
	dataChart.labels = asset.labels;
	dataChart.datasets[0].data = asset.data;

	return new Chart(canvas, {
		type: type,
		data: dataChart,
		plugins: [ChartDataLabels],
		options: options,
	});
};

const updateProductStatistic = () => {
	var now = new Date(Date.now());
	$("product-data").innerText = assets[PRODUCT_ASSET_INDEX].count;
	$("product-updated-time").innerText = `${now.toTimeString()}
											${now.toDateString()} updated.`;
	var config = {
		type: BAR_CHART_TYPE,
		data: {
			labels: assets[PRODUCT_ASSET_INDEX].labels,
			datasets: [
				{
					label: "quantity of product",
					data: assets[PRODUCT_ASSET_INDEX].data,
					borderColor: "#a2d2ff",
					backgroundColor: COLORS,
					datalabels: {
						anchor: "center",
						borderWidth: 0,
					},
				},
			],
		},
		plugins: [ChartDataLabels],
		options: {
			scales: {
				y: {
					ticks: {
						stepSize: 1,
					},
				},
			},
			plugins: {
				datalabels: {
					formatter: (value, context) => {
						var data = context.chart.data.datasets[0].data;
						var sum = data.reduce((a, b) => {
							return a + b;
						});
						return Math.round((value / sum) * 100) + "%";
					},
					backgroundColor: "white",
					borderRadius: 5,
					color: "black",
					font: {
						weight: "bold",
					},
					padding: 10,
				},
			},
		},
	};
	new Chart($("product-canvas"), config);
};
const updateCustomerStatistic = () => {
	var now = new Date(Date.now());
	$("customer-data").innerText = assets[CUSTOMER_ASSET_INDEX].count;
	$("customer-updated-time").innerText = `${now.toTimeString()}
											${now.toDateString()} updated.`;
	drawChart(
		$("customer-canvas"),
		BAR_CHART_TYPE,
		assets[PRODUCT_ASSET_INDEX]
	);
};
//const updateDataStatistic = async () => {
//	const showDataProduct = async (cateArr) => {
//		for (var cate of cateArr) {
//			assets[PRODUCT_ASSET_INDEX].labels.push(cate.name);
//			var url = `${URL_API}${CATEGORIES}${cate.id}${PRODUCTS}`;
//			await callBackAPI(url).then((res) => {
//				assets[PRODUCT_ASSET_INDEX].count += res.data.length;
//				assets[PRODUCT_ASSET_INDEX].data.push(res.data.length);
//			});
//		}
//		$("product-data").innerText = assets[PRODUCT_ASSET_INDEX].count;
//		$("product-updated-time").innerText = `${today.toTimeString()}
//            ${today.toDateString()} updated.`;
//		drawChart(
//			$("product-canvas"),
//			BAR_CHART_TYPE,
//			assets[PRODUCT_ASSET_INDEX]
//		);
//	};
//	var url = `${URL_API}${CATEGORIES}`;
//	await callBackAPI(url, GET_METHOD, null, showDataProduct);
//};

//updateDataStatistic();
