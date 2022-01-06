const REGISTER_SUCCESSFULL_NOTIFICATION = "Đăng ký thành công!";
const REGISTER_SUBJECT_EMAIL =
	"[Coffee House][Chúc mừng bạn đã đăng Ký thành công!]";
const regLogModal = new bootstrap.Modal($("sign-in-up-form__modal"));

const resetError = () => {
	hideEle($("email-registered-error"));
	hideEle($("phoneNumber-registered-error"));
	hideEle($("username-registered-error"));
	hideEle($("password-repeated-error"));
	hideEle($("blank-error"));
};

const resetReg = () => {
	$("new-email").value = EMPTY;
	$("new-phoneNumber").value = EMPTY;
	$("new-username").value = EMPTY;
	$("new-cusName").value = EMPTY;
	$("new-address").value = EMPTY;
	$("new-password").value = EMPTY;
	$("repeated-password").value = EMPTY;
};
const checkRegisterInfo = async (cusArr) => {
	var email = $("new-email").value;
	var phoneNumber = $("new-phoneNumber").value;
	var userName = $("new-username").value;
	// check email, phone number and user name are registered?
	for (var cus of cusArr) {
		if (cus.info.email == email) {
			showEle($("email-registered-error"));
			return false;
		}
		if (cus.info.phoneNumber == phoneNumber) {
			showEle($("phoneNumber-registered-error"));
			return false;
		}
		if (cus.account.userName == userName) {
			showEle($("username-registered-error"));
			return false;
		}
	}
	var cusName = $("new-cusName").value;
	var address = $("new-address").value;
	var password = $("new-password").value;
	var repeatedPassword = $("repeated-password").value;
	// check blank
	if (
		!(
			email &&
			phoneNumber &&
			userName &&
			cusName &&
			address &&
			password &&
			repeatedPassword
		)
	) {
		showEle($("blank-error"));
		return false;
	}
	// check repeat password
	if (password != repeatedPassword) {
		showEle($("password-repeated-error"));
		return false;
	}
	password = CryptoJS.SHA256(password).toString();
	// add account into API
	var url = `${URL_API}${CUSTOMERS}`;
	await callBackAPI(
		url,
		POST_METHOD,
		new Customer(
			new Info(cusName, phoneNumber, email, address),
			new Account(userName, password)
		)
	).then((res) => {
		var cus = res.data;
		var message = `Chào mừng bạn đến với Coffee House.<br>
			Tài khoản của bạn là <b>${cus.account.userName}</b>.<br>
			Mật khẩu của bạn là <b>${repeatedPassword}</b>.
		`;
		sendEmail(REGISTER_SUBJECT_EMAIL, message, cus.info.email);
	});
	return true;
};

const register = () => {
	resetError();
	var url = `${URL_API}${CUSTOMERS}`;
	callBackAPI(url, GET_METHOD, null, checkRegisterInfo).then((status) => {
		if (status) {
			regLogModal.hide();
			alert(REGISTER_SUCCESSFULL_NOTIFICATION);
		}
	});
};

$("new-password").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("repeated-password").addEventListener(DBCLICK_EVENT, convertPasswordText);
