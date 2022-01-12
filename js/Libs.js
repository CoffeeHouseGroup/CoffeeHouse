class Category {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

class Product {
	/**
	 * @param {number} categoryId
	 * @param {number} id
	 * @param {String} name
	 * @param {String} img
	 * @param {number} price
	 * @param {String} description
	 * @param {number} votes
	 * @param {String} brand
	 */
	constructor(categoryId, id, name, img, price, description, votes, brand) {
		this.CategoryId = categoryId;
		this.id = id;
		this.name = name;
		this.img = img;
		this.price = price;
		this.description = description;
		this.votes = votes; // 0, 1, 2, 3, 4 or 5 star
		this.brand = brand;
	}
}
class Info {
	/**
	 * @param {String} name
	 * @param {String} phoneNumber
	 * @param {String} email
	 * @param {String} address
	 */
	constructor(name, phoneNumber, email, address) {
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.address = address;
	}
}
class Account {
	/**
	 * @param {String} userName
	 * @param {String} password
	 * @param {boolean} status
	 */
	constructor(userName, password) {
		this.userName = userName;
		this.password = password;
		this.status = true; //true is active and false is banned
	}
}

class Customer {
	/**
	 * @param {Info} info
	 * @param {Account} account
	 */
	constructor(info, account) {
		this.info = info;
		this.account = account;
		this.date = new Date(Date.now()).toString();
	}
}

class BillDetailTemp {
	/**
	 * @param {Product} product
	 * @param {number} qty
	 */
	constructor(product, qty) {
		this.product = product;
		this.qty = qty;
	}
	amount = () => {
		return this.product.price * this.qty;
	};
}

class BillDetail {
	/**
	 * @param {BillDetailTemp} billDetailTemp
	 */
	constructor(billDetailTemp) {
		this.url = `${URL_API}${CATEGORIES}${billDetailTemp.product.CategoryId}${PRODUCTS}${billDetailTemp.product.id}`;
		this.qty = billDetailTemp.qty;
	}
}

class StatusBill {
	constructor() {
		this.isMaking = true;
		this.isDelivering = false;
		this.isReceived = false;
		this.isPayed = false;
	}
}

class Bill {
	constructor(cusId) {
		this.cusId = cusId;
		this.coupon = null; // Object coupon
		this.details = [];
		this.status = new StatusBill();
		this.notes = "";
		this.payMethod = 0;
		this.address = "";
		this.amount = 0;
		this.date = null;
	}
	/**
	 * @param {BillDetail} billDetail
	 */
	addDetail = (billDetail) => {
		this.details.push(billDetail);
	};
	/**
	 * @param {String} coupon
	 */
	addCoupon = (coupon) => {
		this.coupon = coupon;
	};
	/**
	 * @param {String} notes
	 */
	addNotes = (notes) => {
		this.notes = notes;
	};
	/**
	 * @param {number} payMethod
	 */
	addPayMethod = (payMethod) => {
		this.payMethod = payMethod;
	};
	addAmount = (amount) => {
		this.amount = amount;
	};
	addAddress = (address) => {
		this.address = address;
	};
	addDate = (date) => {
		this.date = date;
	};
	getDiscount = () => {
		return this.coupon != null ? this.amount * this.coupon.value : 0;
	};
	getTotal = () => {
		return this.coupon != null
			? this.amount * (1 - this.coupon.value)
			: this.amount;
	};
}

class Coupon {
	constructor(code, value) {
		this.code = code;
		this.value = value;
	}
}

class Asset {
	constructor() {
		this.count = 0;
		this.labels = [];
		this.data = [];
	}
}

// Const
const ONCLICK_ATTR = "onclick";
const CHECKED_ATTR = "checked";
const DISABLED_ATTR = "disabled";
const CLICK_EVENT = "click";
const DBCLICK_EVENT = "dblclick";
const MOUSELEAVE_EVENT = "mouseleave";
const MODAL_SHOW_EVENT = "show.bs.modal";
const MODAL_HIDE_EVENT = "hide.bs.modal";
const PASSWORD_TYPE = "password";
const TEXT_TYPE = "text";
const DELIVERING = "delivering";
const RECEIVED = "received";
const PAYED = "payed";
const CUSTOMER_INFO_KEY = "customerInfo";
const VND = " đ";
const EMPTY = "";
const MYGMAIL = "Dangkyqt2509@gmail.com";
const MYPASSWORD = "vxczaxtmwfxfjzod";

//Functions
const $ = (id) => {
	return document.getElementById(id);
};
const hideEle = (ele) => {
	ele.classList.add("visually-hidden");
};
const showEle = (ele) => {
	ele.classList.remove("visually-hidden");
};
const convertPasswordText = (e) => {
	e.target.type = e.target.type == PASSWORD_TYPE ? TEXT_TYPE : PASSWORD_TYPE;
};
const sendEmail = (subject, message, mailTo, attachments = null) => {
	return Email.send({
		Host: "smtp.gmail.com",
		Username: MYGMAIL,
		Password: MYPASSWORD,
		To: mailTo,
		From: MYGMAIL,
		Subject: subject,
		Body: message,
		Attachments: attachments,
	});
};
