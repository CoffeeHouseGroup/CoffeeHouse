const CONFIRM_BILL_NOTIFICATION = "Đơn hàng đã được xác nhận!";
const DOESNT_EXIST_COUPON_NOTIFICATION = "Mã giảm giá không tồn tại!";
const LOGIN_WARNING = "Bạn cần phải đăng nhập trước!";
const ADD_TO_CART_NOTIFICATION = "Bạn đã thêm vào giỏ thành công";
const CHANGE_PASWORD_WARNING = "Bạn có chắc muốn đổi mật khẩu?";
const CHANGED_PASSWORD_NOTIFICATION = "Đổi mật khẩu thành công!";
const NULL_COUPON = "Mã giảm giá trống!";
const CHANGE_INFO_SUBJECT_EMAIL =
	"[Coffee House][Chúc mừng bạn đã thay đổi thông tin cá nhân thành công!]";
const BILL_CONFIRM_SUBJECT_EMAIL = "[Coffee House][Đơn hàng thành công!]";
const tblBody = $("tbl-body");
const tblBodyDBill = $("tbl-body-dBill");
const productDetailModal = new bootstrap.Modal($("product-detail__modal"));
const cartTableModal = new bootstrap.Modal($("cart-table__modal"));
const billInfoModal = new bootstrap.Modal($("bill-info__modal"));
const displayModal = new bootstrap.Modal($("display-bill__modal"));
const changePasswordModal = new bootstrap.Modal($("change-password__modal"));
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
		regLogModal.show();
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
		margin: [2, 0]
	}
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
	sendEmail(BILL_CONFIRM_SUBJECT_EMAIL, message, cusEmail, attachments);
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
	var email = $("edit-email").value;
	var phone = $("edit-phoneNumber").value;
	var address = $("edit-address").value;
	if (!(name && email && phone && address)) {
		showEle($("blank-error-editInfo"));
		return;
	}
	editInfoModal.hide();
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	callBackAPI(url).then(async (res) => {
		var cus = res.data;
		cus.info = new Info(name, phone, email, address);
		await callBackAPI(url, PUT_METHOD, cus).then((res) => {
			var cus = res.data;
			var message = `Bạn đã thay đổi thông tin cá nhân.<br>
				Họ và tên: <b>${cus.info.name}</b>.<br>
				Địa chỉ: <b>${cus.info.address}</b>.<br>
				Số điện thoại: <b>${cus.info.phoneNumber}</b>.
			`;
			sendEmail(CHANGE_INFO_SUBJECT_EMAIL, message, cus.info.email);
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
	hideEle($("edit-repeatPasword-error"));
	hideEle($("edit-blank-error"));
	var password = $("edit-newPassword").value;
	var repeatedPassword = $("edit-repeatedPassword").value;

	if (!(password && repeatedPassword)) {
		showEle($("edit-blank-error"));
		return;
	}
	if (password != repeatedPassword) {
		showEle($("edit-repeatPasword-error"));
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
			var message = `Bạn đã thay đổi thông tin cá nhân.<br>
				Mật khẩu mới của bạn là: <b>${repeatedPassword}</b>.
			`;
			sendEmail(CHANGE_INFO_SUBJECT_EMAIL, message, cus.info.email);
		});
		alert(CHANGED_PASSWORD_NOTIFICATION);
	});
};

//--------------------------------------
showMenu();
$("edit-oldPassword").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("edit-newPassword").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("edit-repeatedPassword").addEventListener(DBCLICK_EVENT, convertPasswordText);
$('display-bill__modal').addEventListener(MODAL_HIDE_EVENT, (e) => {
	tblBodyDBill.innerHTML = EMPTY;
});
