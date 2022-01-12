const CREATE_PRODUCT_TITLE = "Thêm sản phẩm";
const EDIT_PRODUCT_TITLE = "Chỉnh Sửa Thông Tin Sản Phẩm";
const EDIT_PRODUCT_NOTIFICATION = "Chỉnh sửa sản phẩm thành công!";
const DELETE_PRODUCT_NOTIFICATION = "Xoá sản phẩm thành công!";
const DELETE_CUSTOMER_NOTIFICATION = "Xóa khách hàng thành công!";
const DELETE_BILL_NOTIFICATION = "Xoá đơn hàng thành công!";
const CREATE_COUPON_NOTIFICATION = "Tạo mới mã giảm giá thành công!";
const COUPON_MATCHED_WARNING = "Mã giảm giá bị trùng! Vui lòng nhập mã khác!";
const COUPON_VALUE_RANGE_WARNING = "Giá trị của mã phải trong khoảng 0 và 1!";
const DELETE_COUPON_NOTIFICATION = "Xóa mã giảm giá thành công!";
const DELETE_WARNING = "Bạn có chắc chắn muốn xóa?";
const UPDATE_BILL_STATUS_NOTIFICATION = "Cập nhật trạng thái thành công!";
const BANNED_ACCOUNT_NOTIFICATION = "Đã khóa tài khoản";
const UNBANNED_ACCOUNT_NOTIFICATION = "Đã khóa tài khoản";
const productModal = new bootstrap.Modal($("product__modal"));
const customerModal = new bootstrap.Modal($("customer__modal"));
const couponModal = new bootstrap.Modal($("coupon__modal"));


//Product section
//-----------------------------------------------

const showAllProduct = async (cateId = 0) => { // {0: all, 1: cà phê thế giới, 2: cà phê pha việt, 3: cà phê cẩm hứng, 4: đồ uống có cồn }
	const show = (productArr) => {
		for (var pro of productArr) {
			addEleProTbl(pro);
		}
	};
	if (cateId == 0) {
		var url = `${URL_API}${CATEGORIES}`;
		await callBackAPI(url).then(async (res) => {
			var cateArr = res.data;
			assets[PRODUCT_ASSET_INDEX].labels = cateArr.map((cate) => {
				return cate.name;
			});
			for (var cate of cateArr) {
				var urlP = `${URL_API}${CATEGORIES}${cate.id}${PRODUCTS}`;
				await callBackAPI(urlP).then(res => {
					var productArr = res.data;
					assets[PRODUCT_ASSET_INDEX].data.push(productArr.length);
					assets[PRODUCT_ASSET_INDEX].count += productArr.length;
					for (var pro of productArr) {
						addEleProTbl(pro);
					}
				});
			}
			updateProductStatistic();
		});
	}
	else {
		var url =  `${URL_API}${CATEGORIES}${cateId}${PRODUCTS}`
		await callBackAPI(url, GET_METHOD, null, show);
	}
	
};

const resetProduct = () => {
	$("new-productName").value = EMPTY;
	$("new-productImgLink").value = EMPTY;
	$("new-productPrice").value = EMPTY;
	$("new-productDes").value = EMPTY;
	$("new-productVotes").value = 5;
	$("new-productBrand").value = EMPTY;
};

const createProduct = () => {
	resetProduct();
	$("product-title").innerText = CREATE_PRODUCT_TITLE;
	$("save-product__btn").setAttribute(ONCLICK_ATTR, "saveCreateProduct()");
};

const saveCreateProduct = () => {
	hideEle($("blank-error-createProduct"));
	var name = $("new-productName").value;
	var cateId = $("new-productCate").value;
	var img = $("new-productImgLink").value;
	var price = $("new-productPrice").value;
	var description = $("new-productDes").value;
	var votes = $("new-productVotes").value;
	var brand = $("new-productBrand").value;

	if (!(name && cateId && img && price && description && votes && brand)) {
		showEle($("blank-error-createProduct"));
		return;
	}
	productModal.hide();
	callBackAPI(
		`${URL_API}${CATEGORIES}${cateId}${PRODUCTS}`,
		POST_METHOD,
		new Product(
			cateId.toString(),
			null,
			name,
			img,
			price,
			description,
			votes,
			brand
		),
		addEleProTbl
	).then(() => {
		alert(CREATE_PRODUCT_NOTIFICATION);
	});
};

const delProduct = (cateId, id) => {
	var check = confirm(DELETE_WARNING);
	if (!check) return;
	var url = `${URL_API}${CATEGORIES}${cateId}${PRODUCTS}${id}`;
	callBackAPI(url, DELETE_METHOD).then(() => {
		$(`product-${cateId}-${id}`).remove();
		alert(DELETE_PRODUCT_NOTIFICATION);
	});
};

const showInfoProduct = (cateId, id) => {
	const show = (product) => {
		$("product-title").innerText = EDIT_PRODUCT_TITLE;
		$("new-productName").value = product.name;
		$("new-productCate").value = product.CategoryId;
		$("new-productImgLink").value = product.img;
		$("new-productPrice").value = product.price;
		$("new-productDes").value = product.description;
		$("new-productVotes").value = product.votes;
		$("new-productBrand").value = product.brand;
		$("save-product__btn").setAttribute(
			ONCLICK_ATTR,
			`saveEditProduct(${cateId},${id})`
		);
	};

	var url = `${URL_API}${CATEGORIES}${cateId}${PRODUCTS}${id}`;
	callBackAPI(url, GET_METHOD, null, show);
};

const saveEditProduct = (cateId, id) => {
	var name = $("new-productName").value;
	var newCateId = $("new-productCate").value.toString();
	var img = $("new-productImgLink").value;
	var price = $("new-productPrice").value;
	var description = $("new-productDes").value;
	var votes = $("new-productVotes").value;
	var brand = $("new-productBrand").value;

	var url = `${URL_API}${CATEGORIES}${cateId}${PRODUCTS}${id}`;
	callBackAPI(
		url,
		PUT_METHOD,
		new Product(
			newCateId,
			null,
			name,
			img,
			price,
			description,
			votes,
			brand
		)
	).then(() => {
		alert(EDIT_PRODUCT_NOTIFICATION);
		window.location.reload();
	});
};
/**
 * @param {Product} product
 */
const addEleProTbl = (product) => {
	$("product-tbl-body").innerHTML += `
		<tr class="text-center align-content-center"
			id="product-${product.CategoryId}-${product.id}">
			<th scope='row'>${product.CategoryId}-${product.id}</th>
			<td>${product.name}</td>
			<td><img class="img-fluid" style="height:100px" src="${product.img}"></td>
			<td>${product.price}</td>
			<td>
				<button class="btn btn-danger text-light" onclick="delProduct(${product.CategoryId},${product.id})">
					<i class="fa fa-trash" aria-hidden="true"></i>
				</button>
				<button class="btn btn-danger text-light" data-bs-toggle="modal" 
					data-bs-target="#product__modal" onclick="showInfoProduct(${product.CategoryId},${product.id})">
					<i class="fa fa-pencil" aria-hidden="true"></i>
				</button>
			</td>
		</tr>
	`;
};

//Customer section
//---------------------------------------------------
const showAllCustomer = async () => {
	const show = (customerArr) => {
		for (var cus of customerArr) {
			addEleCusTbl(cus);
		}
	};

	var url = `${URL_API}${CUSTOMERS}`;
	await callBackAPI(url, GET_METHOD, null, show);
};

const showInfoCustomer = (id) => {
	const show = (customer) => {
		$("shown-cusName").value = customer.info.name;
		$("shown-email").value = customer.info.email;
		$("shown-phoneNumber").value = customer.info.phoneNumber;
		$("shown-address").value = customer.info.address;
		$("shown-userName").value = customer.account.userName;
		$("shown-date").value = customer.date;
	};

	var url = `${URL_API}${CUSTOMERS}${id}`;
	callBackAPI(url, GET_METHOD, null, show);
};

const delCustomer = (id) => {
	var check = confirm(DELETE_WARNING);
	if (!check) return;
	var url = `${URL_API}${CUSTOMERS}${id}`;
	callBackAPI(url, DELETE_METHOD).then(() => {
		$(`customer-${id}`).remove();
		alert(DELETE_CUSTOMER_NOTIFICATION);
	});
};

const ban = (id) => {
	var url = `${URL_API}${CUSTOMERS}${id}`;
	callBackAPI(url)
		.then((res) => {
			var cus = res.data;
			cus.account.status = !cus.account.status;
			callBackAPI(url, PUT_METHOD, cus);
			return cus;
		})
		.then((cus) => {
			if (!cus.account.status) {
				alert(
					`${BANNED_ACCOUNT_NOTIFICATION} ${cus.account.userName}!`
				);
				return;
			}
			alert(`${UNBANNED_ACCOUNT_NOTIFICATION} ${cus.account.userName}!`);
		});
};
/**
 * @param {Customer} customer
 */
const addEleCusTbl = (customer) => {
	$("customer-tbl-body").innerHTML += `
		<tr class="text-center align-content-center" id="customer-${customer.id}">
			<th scope='col'>${customer.id}</th>
			<td>${customer.info.name}</td>
			<td>${customer.account.userName}</td>
			<td><input type="password" class="text-center" value="${
				customer.account.password
			}" disabled></td>
			<td><input type="checkbox" id="cusStatus-${customer.id}" onclick="ban(${
		customer.id
	})" 
				${customer.account.status ? "checked" : ""}>
			</td>
			<td>
				<button class="btn btn-danger text-light" onclick="delCustomer(${customer.id})">
					<i class="fa fa-trash" aria-hidden="true"></i>
				</button>
				<button class="btn btn-danger text-light" data-bs-toggle="modal"
					data-bs-target="#customer__modal" onclick="showInfoCustomer(${customer.id})">
					<i class="fa fa-eye" aria-hidden="true"></i>
				</button>
			</td>
		</tr>
	`;
};
//Bill section
//--------------------------------------------

const showAllBill = async () => {
	const show = (billArr) => {
		for (var bill of billArr) {
			addEleBillTbl(bill);
		}
	};

	var url = `${URL_API}${BILLS}`;
	await callBackAPI(url, GET_METHOD, null, show);
};
const showInfoBill = (id) => {
	const showCusInfo = (customer) => {
		$("bill-cusName").value = customer.info.name;
		$("bill-userName").value = customer.account.userName;
		$("bill-phoneNumber").value = customer.info.phoneNumber;
		$("bill-email").value = customer.info.email;
	};
	const showInfo = (bill) => {
		$("bill-address").value = bill.address;
		$("bill-date").value = bill.date;
		$("bill-coupon").value =
			bill.coupon != null
				? `${bill.coupon.code} - ${bill.coupon.value * 100}%`
				: 0;
		$("bill-total").value =
			bill.coupon != null
				? bill.amount * (1 - bill.coupon.value) + VND
				: bill.amount + VND;
	};
	const showAllDetail = (detailArr) => {
		detailArr.forEach((detail, index) => {
			callBackAPI(detail.url).then((res) => {
				var product = res.data;
				$("detailBill-tbl-body").innerHTML += `
					<tr>
						<th scope="row">${index + 1}</th>
						<td>${product.name}</td>
						<td>${detail.qty}</td>
						<td>${product.price}</td>
						<td>${detail.qty * product.price} đ</td>
					</tr>
				`;
			});
		});
	};
	const showStatus = (status) => {
		if (status.isDelivering) {
			$("isDelivering").setAttribute(DISABLED_ATTR, EMPTY);
			$("isDelivering").setAttribute(CHECKED_ATTR, EMPTY);
		} else {
			$("isDelivering").setAttribute(
				ONCLICK_ATTR,
				`updateStatus(${id}, "${DELIVERING}")`
			);
		}
		if (status.isReceived) {
			$("isReceived").setAttribute(CHECKED_ATTR, EMPTY);
		}
		if (status.isPayed) {
			$("isPayed").setAttribute(DISABLED_ATTR, EMPTY);
			$("isPayed").setAttribute(CHECKED_ATTR, EMPTY);
		} else {
			$("isPayed").setAttribute(
				ONCLICK_ATTR,
				`updateStatus(${id}, "${PAYED}")`
			);
		}
	};

	var url = `${URL_API}${BILLS}${id}`;
	callBackAPI(url).then((res) => {
		var bill = res.data;
		var detailArr = bill.details;
		var status = bill.status;
		var url = `${URL_API}${CUSTOMERS}${bill.cusId}`;
		callBackAPI(url, GET_METHOD, null, showCusInfo);
		showInfo(bill);
		showAllDetail(detailArr);
		showStatus(status);
	});
};
const delBill = (id) => {
	var check = confirm(DELETE_WARNING);
	if (!check) return;
	var url = `${URL_API}${BILLS}${id}`;
	callBackAPI(url, DELETE_METHOD).then(() => {
		$(`bill-${id}`).remove();
		alert(DELETE_BILL_NOTIFICATION);
	});
};
const addEleBillTbl = (bill) => {
	var discount = bill.coupon != null ? bill.amount * bill.coupon.value : 0;
	$("bill-tbl-body").innerHTML += `
		<tr id="bill-${bill.id}">
			<td>${bill.id}</td>
			<td>${bill.cusId}</td>
			<td>${
				bill.coupon != null
					? bill.coupon.code + " - " + bill.coupon.value * 100 + "%"
					: 0 + "%"
			}</td>
			<td>${discount}</td>
			<td>${bill.amount - discount}</td>
			<td>
				<button class="btn btn-danger text-light" onclick="delBill(${bill.id})">
					<i class="fa fa-trash" aria-hidden="true"></i>
				</button>
				<button class="btn btn-danger text-light" data-bs-toggle="modal"
					data-bs-target="#bill__modal" onclick="showInfoBill(${bill.id})">
					<i class="fa fa-eye" aria-hidden="true"></i>
				</button>
			</td>
		</tr>
	`;
};

//Coupon section
//--------------------------------------------------

const showAllCoupon = async () => {
	const show = (couponArr) => {
		for (var coupon of couponArr) {
			addEleCouponTbl(coupon);
		}
	};

	var url = `${URL_API2}${COUPONS}`;
	await callBackAPI(url, GET_METHOD, null, show);
};
const createCoupon = () => {
	hideEle($("blank-error-createCoupon"));
	var code = $("new-code").value;
	var value = $("new-value").value;
	if (!(code && value)) {
		showEle($("blank-error-createCoupon"));
		return;
	}
	if (value <= 0 || value > 1) {
		alert(COUPON_VALUE_RANGE_WARNING);
		return;
	}
	couponModal.hide();
	var url = `${URL_API2}${COUPONS}`;
	callBackAPI(url).then((res) => {
		var couponArr = res.data;
		for (var coupon of couponArr) {
			if (code == coupon.code) {
				alert(COUPON_MATCHED_WARNING);
				return;
			}
		}
		callBackAPI(
			`${URL_API2}${COUPONS}`,
			POST_METHOD,
			new Coupon(code, parseFloat(value)),
			addEleCouponTbl
		).then(() => {
			alert(CREATE_COUPON_NOTIFICATION);
		});
	});
};
const delCoupon = (id) => {
	var check = confirm(DELETE_WARNING);
	if (!check) return;
	var url = `${URL_API2}${COUPONS}${id}`;
	callBackAPI(url, DELETE_METHOD).then(() => {
		$(`coupon-${id}`).remove();
		alert(DELETE_COUPON_NOTIFICATION);
	});
};
const addEleCouponTbl = (coupon) => {
	$("coupon-tbl-body").innerHTML += `
		<tr id="coupon-${coupon.id}">
			<td>${coupon.code}</td>
			<td>${coupon.value}</td>
			<td>
				<button class="btn btn-danger text-light" onclick="delCoupon(${coupon.id})">
					<i class="fa fa-trash" aria-hidden="true"></i>
				</button>
			</td>
		</tr>
  `;
};
// Other functions
//---------------------------
const preview = () => {
	$("preview").classList.remove("visually-hidden");
	$("preview-img").src = $("new-productImgLink").value;
};
const updateStatus = (id, key) => {
	var url = `${URL_API}${BILLS}${id}`;
	callBackAPI(url).then((res) => {
		var bill = res.data;
		switch (key) {
			case DELIVERING: {
				bill.status.isDelivering = true;
				$("isDelivering").setAttribute(DISABLED_ATTR, EMPTY);
				break;
			}
			case PAYED: {
				$("isPayed").setAttribute(DISABLED_ATTR, EMPTY);
				bill.status.isPayed = true;
			}
		}
		callBackAPI(url, PUT_METHOD, bill).then(() => {
			alert(UPDATE_BILL_STATUS_NOTIFICATION);
		});
	});
};
//---------------------filter--------------------------
const filter = () => {
	var cateId = $('filter-category').value
	$("product-tbl-body").innerHTML = EMPTY;
	showAllProduct(cateId)
}
//-----------------------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++
const startShow = async () => {
	await showAllProduct();
	await showAllCustomer();
	await showAllBill();
	await showAllCoupon();
};

startShow();
$("bill__modal").addEventListener(MODAL_HIDE_EVENT, () => {
	$("detailBill-tbl-body").innerHTML = EMPTY;
	$("isDelivering").removeAttribute(DISABLED_ATTR);
	$("isDelivering").removeAttribute(CHECKED_ATTR);
	$("isReceived").removeAttribute(CHECKED_ATTR);
	$("isPayed").removeAttribute(DISABLED_ATTR);
	$("isPayed").removeAttribute(CHECKED_ATTR);
})
