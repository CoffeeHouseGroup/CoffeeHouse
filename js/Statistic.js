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
					label: "Số Lượng sản phẩm",
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
				title: {
					display: true,
					position: "bottom",
					font: {
						weight: "bold",
						size: 20,
					},
					text: `Số lượng sản phẩm mỗi danh mục`,
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
	var config = {
		type: BAR_CHART_TYPE,
		data: {
			labels: MONTHS,
			datasets: [
				{
					label: "Số lượng khách hàng",
					data: assets[CUSTOMER_ASSET_INDEX].data,
					borderColor: "#a2d2ff",
					backgroundColor: COLORS,
				},
			],
		},
		options: {
			scales: {
				y: {
					ticks: {
						stepSize: 1,
					},
				},
			},
			plugins: {
				title: {
					display: true,
					position: "bottom",
					font: {
						weight: "bold",
						size: 20,
					},
					text: `Số khách hàng hằng tháng - ${new Date().getFullYear()}`,
				},
			},
		},
	};
	new Chart($("customer-canvas"), config);
};
const updateBillStatistic = () => {
	var now = new Date(Date.now());
	$("bill-data").innerText = assets[BILL_ASSET_INDEX].count;
	$("bill-month").innerText = now.getMonth() + 1 + "/" + now.getFullYear();
	$("bill-updated-time").innerText = `${now.toTimeString()}
											${now.toDateString()} updated.`;
	var config = {
		type: LINE_CHART_TYPE,
		data: {
			labels: MONTHS,
			datasets: [
				{
					label: "Số lượng đơn hàng",
					data: assets[BILL_ASSET_INDEX].data,
					borderColor: "#a2d2ff",
					backgroundColor: COLORS,
				},
			],
		},
		options: {
			scales: {
				y: {
					ticks: {
						stepSize: 1,
					},
				},
			},
			plugins: {
				title: {
					display: true,
					position: "bottom",
					font: {
						weight: "bold",
						size: 20,
					},
					text: `Số đơn hàng mỗi tháng - ${new Date().getFullYear()}`,
				},
			},
		},
	};
	new Chart($("bill-canvas"), config);
};
const updateCouponStatistic = () => {
	var now = new Date(Date.now());
	$("coupon-data").innerText = assets[COUPON_ASSET_INDEX].count;
	$("coupon-updated-time").innerText = `${now.toTimeString()}
											${now.toDateString()} updated.`;
};
const updateRevenueStatistic = () => {
	var now = new Date(Date.now());
	$("revenue-data").innerText = assets[BILL_ASSET_INDEX].revenue;
	$("revenue-month").innerText = now.getMonth() + 1 + "/" + now.getFullYear();
	$("revenue-updated-time").innerText = `${now.toTimeString()}
											${now.toDateString()} updated.`;
};
