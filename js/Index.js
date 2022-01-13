const CONFIRM_BILL_NOTIFICATION = "Đơn hàng đã được xác nhận!";
const DOESNT_EXIST_COUPON_NOTIFICATION = "Mã giảm giá không tồn tại!";
const LOGIN_WARNING = "Bạn cần phải đăng nhập trước!";
const ADD_TO_CART_NOTIFICATION = "Bạn đã thêm vào giỏ thành công";
const CHANGE_PASWORD_WARNING = "Bạn có chắc muốn đổi mật khẩu?";
const CHANGED_PASSWORD_NOTIFICATION = "Đổi mật khẩu thành công!";
const LOGOUT_NOTIFICATION = "Đăng xuất thành công!";
const EDIT_INFO_NOTIFICATION = "Chỉnh sửa thành công!";
const NULL_COUPON = "Mã giảm giá trống!";
const DELIVERING_STATUS_TEXT =
	"Đang giao hàng.<br>Dự kiến sẽ tới trong 15 phút.";
const PAYED_STATUS_TEXT = "Đã thanh toán.";
const MAKING_STATUS_TEXT = "Đang pha chế.";
const RECEIVED_NOTIFICATION =
	"Chúc quý khách đã nhận hàng. Hãy thưởng thức cà phê với tâm trạng tốt nhất nhé!";
const CHANGE_INFO_SUBJECT =
	"[Coffee House][Chúc mừng bạn đã thay đổi thông tin cá nhân thành công!]";
const BILL_CONFIRM_SUBJECT = "[Coffee House][Đơn hàng thành công!]";
const tblBody = $("tbl-body");
const tblBodyDBill = $("tbl-body-dBill");
const productDetailModal = new bootstrap.Modal($("product-detail__modal"));
const cartTableModal = new bootstrap.Modal($("cart-table__modal"));
const billInfoModal = new bootstrap.Modal($("bill-info__modal"));
const displayModal = new bootstrap.Modal($("display-bill__modal"));
const changePasswordModal = new bootstrap.Modal($("change-password__modal"));
const editInfoModal = new bootstrap.Modal($("edit-info__modal"));
const qtyEl = $("mQty");
const numPro = $("num-products-in-cart");
const menuList = document.querySelectorAll(".menu");
var billDetailArr = [];
var cusId;
var bill;

const add_qty = () => {
	qtyEl.value < 20 ? qtyEl.value++ : (qtyEl.value = 20);
	qty = qtyEl.value;
};
const minus_qty = () => {
	qtyEl.value > 0 ? qtyEl.value-- : (qtyEl.value = 0);
	qty = qtyEl.value;
};

//Number of votes with yellow stars
const vote = (n) => {
	const voted = (n) => {
		$("star-" + n).style.color = "#fda71c";
	};
	const unvoted = (n) => {
		$("star-" + n).style.color = "#000";
	};
	for (let i = 1; i <= n; i++) {
		voted(i);
	}
	for (let i = n + 1; i <= 5; i++) {
		unvoted(i);
	}
	//change the vote value (n) into DB
};

const getAmount = (billDetailArr) => {
	var sum = 0;
	for (var detail of billDetailArr) {
		sum += detail.amount();
	}
	return sum;
};

const total = (billDetailArr) => {
	return this.getAmount(billDetailArr) - this.getDiscount();
};

const showMenu = () => {
	menuList.forEach((menu, index) => {
		var url = `${URL_API}${CATEGORIES}${index + 1}${PRODUCTS}`;
		callBackAPI(url).then((res) => {
			var proArr = res.data;
			for (var ele of proArr) {
				menu.innerHTML += `
					<div class="row text-start align-items-center" id="product-${ele.CategoryId}-${ele.id}">
						<img src="${ele.img}" class="col rounded-circle img-fluid"
							style="max-width: 100px; max-height: 100px;">
						<div class="col-10">
							<div class="row">
								<a class="col-8 coffee-title float-start text-nowrap overflow-hidden"
									role="button" onclick="showDetail(${ele.CategoryId},${ele.id})"
									data-bs-toggle="modal" data-bs-target="#product-detail__modal">
									${ele.name}
								</a>
								<span class="col-4 float-end overflow-hidden">
									<span class="price">${ele.price}</span>
									<i class="fa fa-dong-sign"></i>
								</span>
							</div>
							<div class="description">
								${ele.description}
							</div>
						</div>
					</div>
				`;
			}
		});
	});
};

//show all detail in modal 'product-detail'
var qty = 1;
const showDetail = (cateId, id) => {
	var url = `${URL_API}${CATEGORIES}${cateId}${PRODUCTS}${id}`;
	callBackAPI(url).then((res) => {
		const productEl = res.data;
		$("mDetail-img").src = productEl.img;
		$("mBrand").innerText = productEl.brand;
		$("mProduct-name").innerText = productEl.name;
		$("mPrice").innerText = productEl.price;
		qtyEl.value = 1;
		qty = parseInt(qtyEl.value);
		vote(productEl.voted);
		$("btn-order").setAttribute("onclick", `buy(${cateId}, ${id})`);
	});
};

//---------------------------------------

//Thuy Ky
var countRow = 0;

const buy = (cateId, id) => {
	if (window.localStorage.getItem(CUSTOMER_INFO_KEY) == "") {
		alert(LOGIN_WARNING);
		productDetailModal.hide();
		window.location.href = "login.html";
		return;
	}
	alert(ADD_TO_CART_NOTIFICATION);
	countRow++;
	productDetailModal.hide();
	cartTableModal.show();
	var url = `${URL_API}${CATEGORIES}${cateId}${PRODUCTS}${id}`;
	callBackAPI(url).then((res) => {
		var pro = res.data;
		tblBody.innerHTML += `
			<tr class="text-center align-content-center">
				<th scope='row'>${countRow}</th>
				<td><img class="img-fluid" src="${pro.img}" 
					style="max-width: 100px; max-height: 100px;">
				</td>
				<td>${pro.name}</td>
				<td>${pro.price}</td>
				<td><input type="number" min="0" max="20" class="text-center" id="tQty-${countRow}" 
					value="${qty}" oninput="changeTQty(${countRow}, ${pro.price})">
				</td>
				<td id='amount-${countRow}'>${pro.price * qty}</td>
			</tr>
		`;
		billDetailArr.push(new BillDetailTemp(pro, qty));
		numPro.innerText = billDetailArr.length;
		update();
	});
};

const changeTQty = (id, price) => {
	var qty = parseInt($("tQty-" + id).value);
	$("amount-" + id).innerText = qty * price;
	billDetailArr[id - 1].qty = qty;
	$("tQty-" + id).setAttribute("value", qty);
	update();
};

const update = () => {
	bill.addAmount(getAmount(billDetailArr));
	$("amount").innerText = bill.amount + VND;
	$("discount").innerText = bill.getDiscount() + VND;
	$("total").innerText = bill.getTotal() + VND;
};

const applyCoupon = () => {
	var coupon = $("coupon").value;
	if (coupon == "") {
		bill.addCoupon(null);
		alert(NULL_COUPON);
		return;
	}
	var url = `${URL_API2}${COUPONS}`;
	callBackAPI(url).then((res) => {
		var couponArr = res.data;
		for (var couponEle of couponArr) {
			if (coupon == couponEle.code) {
				bill.addCoupon(couponEle);
				$("discount").innerText = bill.getDiscount() + VND;
				$("total").innerText = bill.getTotal() + VND;
				alert(`Mã giảm ${couponEle.value * 100}%!`);
				return;
			}
		}
		alert(DOESNT_EXIST_COUPON_NOTIFICATION);
	});
};

// --------------------------------------
//Luyen

const showCusInfo = () => {
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	callBackAPI(url).then((res) => {
		var customer = res.data;
		$("cusName").value = customer.info.name;
		$("phone").value = customer.info.phoneNumber;
		$("email").value = customer.info.email;
		$("address").value = customer.info.address;
	});
};

const confirmBill = async () => {
	const convertTemp = () => {
		for (var temp of billDetailArr) {
			bill.addDetail(new BillDetail(temp));
		}
	};
	if (!billDetailArr.length) {
		alert("Giỏ hàng đang trống!\nVui lòng mua ít nhất một sản phẩm!");
		billInfoModal.hide();
		return;
	}
	var notes = $("notes").value;
	var pMethod = document.querySelector(
		'input[name="payMethod"]:checked'
	).value;
	alert(CONFIRM_BILL_NOTIFICATION);
	billInfoModal.hide();
	displayModal.show();
	bill.addNotes(notes);
	bill.addPayMethod(pMethod);
	bill.addAddress($("address").value);
	bill.addDate(new Date(Date.now()).toString());
	convertTemp();

	var message = "";
	var billId = "";
	var url = `${URL_API}${BILLS}`;
	await callBackAPI(url, POST_METHOD, bill).then((res) => {
		billId = res.data.id;
		message = `Nhâm nhi và thưởng thức cà phê bên bạn bè là điều tuyệt vời nhất!<br>
			Mã đơn hàng: <b>#${billId}</b><br>
			Tổng cộng: <b>${bill.amount} đ</b>.<br>
			Giảm giá: <b>-${bill.getDiscount()} đ</b>.<br>
			<b>Thành tiền: ${bill.getTotal()} đ</b>.<br><br><br>
			Have a nice day!
		`;
	});

	var cusEmail = "";
	//Hieu Show bill at the end
	url = `${URL_API}${CUSTOMERS}${cusId}`;
	await callBackAPI(url).then((res) => {
		var customer = res.data;
		$("dName").value = customer.info.name;
		$("dPhoneNumber").value = customer.info.phoneNumber;
		$("dAddress").value = bill.address;
		$("dCoupon").value =
			bill.coupon != null
				? bill.coupon.code + ` - giảm ${bill.coupon.value * 100}%`
				: `giảm 0%`;
		cusEmail = customer.info.email;
	});

	billDetailArr.forEach((detail, index) => {
		tblBodyDBill.innerHTML += `
			<tr>
				<th scope="row">${index + 1}</th>
				<td>${detail.product.name}</td>
				<td>${detail.qty}</td>
				<td>${detail.product.price}</td>
				<td>${detail.amount()}</td>
			</tr>
		`;
	});
	$("dDiscount").innerText = bill.getDiscount() + VND;
	$("dTotal").innerText = bill.getTotal() + VND;
	var opt = {
		margin: [2, 0],
	};
	var pdf = await html2pdf()
		.set(opt)
		.from($("display-bill__modal-body"))
		.output("datauri");
	var attachments = [
		{
			name: `[CoffeeHouse_#${billId}].pdf`,
			data: pdf,
		},
	];
	sendEmail(BILL_CONFIRM_SUBJECT, message, cusEmail, attachments);
	reset();
};
const reset = () => {
	tblBody.innerHTML = EMPTY;
	coupon.innerText = EMPTY;
	billDetailArr = [];
	bill = new Bill(cusId);
	$("amount").innerText = 0 + VND;
	$("discount").innerText = 0 + VND;
	$("total").innerText = 0 + VND;
	countRow = 0;
	numPro.innerText = 0;
};

//---------------------Show history--------------------------
const showHistory = () => {
	$("history__modal-body").innerHTML = EMPTY;
	var url = `${URL_API}${BILLS}`;
	callBackAPI(url).then((res) => {
		var billArr = res.data;
		for (var i = billArr.length - 1; i >= 0; i--) {
			var bill = billArr[i];
			if (bill.cusId == cusId) {
				$("history__modal-body").innerHTML += `
					<div class="history-item">
						<div class="row bg-dark text-warning">
							<div class="col-6">Mã đơn hàng: #${bill.id}</div>
							<div class="col-6">Ngày mua: ${new Date(bill.date).toDateString()}</div>
						</div>
						<div>
							Trạng thái đơn hàng: 
							<span class="text-muted">
								${
									bill.status.isDelivering
										? bill.status.isPayed
											? PAYED_STATUS_TEXT
											: DELIVERING_STATUS_TEXT
										: MAKING_STATUS_TEXT
								}
							</span>
						</div>
						<div class="text-end">
							<a role="button" class="text-end" data-bs-toggle="modal" data-bs-target="#history-detail__modal"
							 onclick="showDetailHistory(${bill.id})">
								Xem chi tiết
								<i class="fa fa-angle-double-right" aria-hidden="true"></i>
							</a>
						</div>
					</div>
				`;
			}
		}
	});
};

const showDetailHistory = (billId) => {
	const showInfo = (bill) => {
		$("bill-id").value = bill.id;
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
		if (bill.status.isReceived) {
			$("isReceived").setAttribute(CHECKED_ATTR, EMPTY);
			$("isReceived").setAttribute(DISABLED_ATTR, EMPTY);
		} else {
			$("isReceived").setAttribute(
				ONCLICK_ATTR,
				`updateReceivedStatus(${billId})`
			);
		}
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
	var url = `${URL_API}${BILLS}${billId}`;
	callBackAPI(url).then((res) => {
		var bill = res.data;
		var detailArr = bill.details;
		showInfo(bill);
		showAllDetail(detailArr);
	});
};
//--------------check box isReceived------------
const updateReceivedStatus = (id) => {
	var url = `${URL_API}${BILLS}${id}`;
	callBackAPI(url).then((res) => {
		var bill = res.data;
		bill.status.isReceived = true;
		bill.status.isPayed = true;
		$("isReceived").setAttribute(DISABLED_ATTR, EMPTY);
		callBackAPI(url, PUT_METHOD, bill).then(() => {
			alert(RECEIVED_NOTIFICATION);
		});
	});
};
//--------------------edit info and password-----------------
//----------info---------
const showInfo = () => {
	const show = (customer) => {
		$("edit-cusName").value = customer.info.name;
		$("edit-email").value = customer.info.email;
		$("edit-phoneNumber").value = customer.info.phoneNumber;
		$("edit-address").value = customer.info.address;
	};

	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	callBackAPI(url, GET_METHOD, null, show);
};
const saveEditInfo = () => {
	hideEle($("blank-error-editInfo"));
	var name = $("edit-cusName").value;
	var phone = $("edit-phoneNumber").value;
	var address = $("edit-address").value;
	if (!(name && phone && address)) {
		showEle($("blank-error-editInfo"));
		return;
	}
	editInfoModal.hide();
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	callBackAPI(url).then(async (res) => {
		var cus = res.data;
		cus.info.name = name;
		cus.info.phoneNumber = phone;
		cus.info.address = address;
		await callBackAPI(url, PUT_METHOD, cus).then((res) => {
			var cus = res.data;
			var message = `Bạn đã thay đổi thông tin cá nhân.<br>
				Họ và tên: <b>${cus.info.name}</b>.<br>
				Địa chỉ: <b>${cus.info.address}</b>.<br>
				Số điện thoại: <b>${cus.info.phoneNumber}</b>.
			`;
			sendEmail(CHANGE_INFO_SUBJECT, message, cus.info.email);
		});
		alert(EDIT_INFO_NOTIFICATION);
	});
};
//---------------password---------------
const checkOldPassword = () => {
	const disableInput = () => {
		$("edit-newPassword").setAttribute("disabled", "");
		$("edit-repeatedPassword").setAttribute("disabled", "");
	};
	const enableInput = () => {
		$("edit-newPassword").removeAttribute("disabled");
		$("edit-repeatedPassword").removeAttribute("disabled");
	};

	hideEle($("edit-oldPassword-error"));
	enableInput();
	var password = $("edit-oldPassword").value;
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	callBackAPI(url).then((res) => {
		if (CryptoJS.SHA256(password).toString() != res.data.account.password) {
			showEle($("edit-oldPassword-error"));
			disableInput();
		}
	});
};

const saveEditPassword = () => {
	hideEle($("edit-password-length-error"));
	hideEle($("edit-repeatPassword-error"));
	hideEle($("edit-blank-error"));
	var password = $("edit-newPassword").value;
	var repeatedPassword = $("edit-repeatedPassword").value;

	if (!(password && repeatedPassword)) {
		showEle($("edit-blank-error"));
		return;
	}
	if (password.length < 6) {
		showEle($("edit-password-length-error"));
		return;
	}
	if (password != repeatedPassword) {
		showEle($("edit-repeatPassword-error"));
		return;
	}
	var check = confirm(CHANGE_PASWORD_WARNING);
	if (!check) return;

	changePasswordModal.hide();
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	callBackAPI(url).then(async (res) => {
		var cus = res.data;
		cus.account.password = CryptoJS.SHA256(password).toString();
		await callBackAPI(url, PUT_METHOD, cus).then((res) => {
			var cus = res.data;
			var message = `Bạn đã thay đổi mật khẩu.<br>
				Mật khẩu mới của bạn là: <b>${repeatedPassword}</b>.
			`;
			sendEmail(CHANGE_INFO_SUBJECT, message, cus.info.email);
		});
		alert(CHANGED_PASSWORD_NOTIFICATION);
	});
};
//----------------------------------------------
const showAllCoupon = () => {
	const show = (couponArr) => {
		for (var coupon of couponArr) {
			$("list-coupons").innerHTML += `
				<div class="card">
                    <img src="img/coupon.png" class="card-img-top">
                    <span class="coupon-percenteage position-absolute" style="top:6rem;right:3.5rem"><h1>${
						coupon.value * 100
					}%</h1></span>
                    <div class="card-body text-center">
                        <h5 class="card-title">${coupon.code}</h5>
                        <p class="card-text">Mã giảm ${coupon.value * 100}%</p>
                    </div>
                </div>
			`;
		}
	};

	var url = `${URL_API2}${COUPONS}`;
	callBackAPI(url, GET_METHOD, null, show);
};
//----------------------------------------------
const setAccount = async () => {
	hideEle($("link-login"));
	cusId = JSON.parse(window.localStorage.getItem(CUSTOMER_INFO_KEY));
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	await callBackAPI(url).then((res) => {
		$("accDropdown").innerText = res.data.info.name;
	});
	showEle($("manage-account"));
};

const logout = () => {
	showEle($("link-login"));
	hideEle($("manage-account"));
	window.localStorage.setItem(CUSTOMER_INFO_KEY, EMPTY);
	alert(LOGOUT_NOTIFICATION);
};

//----------------------------------------------
if (
	window.localStorage.getItem(CUSTOMER_INFO_KEY) != EMPTY &&
	window.localStorage.getItem(CUSTOMER_INFO_KEY) != null
) {
	setAccount();
}
showAllCoupon();
showMenu();
$("edit-oldPassword").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("edit-newPassword").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("edit-repeatedPassword").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("display-bill__modal").addEventListener(MODAL_HIDE_EVENT, () => {
	tblBodyDBill.innerHTML = EMPTY;
});
$("history-detail__modal").addEventListener(MODAL_HIDE_EVENT, () => {
	$("detailBill-tbl-body").innerHTML = EMPTY;
});

bill = cusId !== undefined ? new Bill(cusId) : null;
