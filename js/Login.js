const CUSTOMER_INFO_KEY = "customerInfo";
const LOGIN_SUCCESSFUL_NOTIFICATION = "Đăng nhập thành công!";
const ADMIN_LOGIN_NOTIFICATION = "Admin Successfully login!";
const BANNED_ACCOUNT_WARNING =
	"Tài khoản của bạn đã bị khóa!\nLiên hệ với admin để mở khóa!";
const LOGOUT_NOTIFICATION = "Đăng xuất thành công!";
const EDIT_INFO_NOTIFICATION = "Chỉnh sửa thành công!";
const editInfoModal = new bootstrap.Modal($("edit-info__modal"));
var isAdmin;
const resetLogin = () => {
	$("lg-username").value = EMPTY;
	$("lg-password").value = EMPTY;
};
//const checkLoginInfo = (cusArr) => {
//	var userName = $("lg-username").value;
//	var password = $("lg-password").value;
//	// check blank
//	if (!(userName && password)) {
//		showEle($("blank-login-error"));
//		return false;
//	}
//	// check account
//	for (var cus of cusArr) {
//		if (
//			userName == cus.account.userName &&
//			CryptoJS.SHA256(password).toString() == cus.account.password
//		) {
//			if (!cus.account.status && !isAdmin) {
//				alert(BANNED_ACCOUNT_WARNING);
//				return false;
//			}
//			window.localStorage.setItem(
//				CUSTOMER_INFO_KEY,
//				JSON.stringify(cus.id)
//			);
//			return true;
//		}
//	}
//	showEle($("login-error"));
//	return false;
//};

const setAccount = async () => {
	hideEle($("link-login"));
	cusId = JSON.parse(window.localStorage.getItem(CUSTOMER_INFO_KEY));
	bill = new Bill(cusId);
	var url = `${URL_API}${CUSTOMERS}${cusId}`;
	await callBackAPI(url).then((res) => {
		$("accDropdown").innerText = res.data.info.name;
	});
	showEle($("manage-account"));
};

const login = () => {
	const resetLoginError = () => {
		hideEle($("login-error"));
		hideEle($("blank-login-error"));
	};

	resetLoginError();
	var isAdmin = $("loginAdmin__cb").checked;
	var url = isAdmin ? `${URL_API2}${ADMINS}` : `${URL_API}${CUSTOMERS}`;
	callBackAPI(url).then(res => {
		var cusArr = res.data;
		var userName = $("lg-username").value;
		var password = $("lg-password").value;
		// check blank
		if (!(userName && password)) {
			showEle($("blank-login-error"));
			return false;
		}
		// check account
		for (var cus of cusArr) {
			if (
				userName == cus.account.userName &&
				CryptoJS.SHA256(password).toString() == cus.account.password
			) {
				if (!cus.account.status && !isAdmin) {
					alert(BANNED_ACCOUNT_WARNING);
					return false;
				}
				window.localStorage.setItem(
					CUSTOMER_INFO_KEY,
					JSON.stringify(cus.id)
				);
				return true;
			}
		}
		showEle($("login-error"));
		return false;
	}).then((status) => {
		if (status) {
			if (isAdmin) {
				// Redirect to admin page
				alert(ADMIN_LOGIN_NOTIFICATION);
				window.location.href = "admin.html";
				window.localStorage.setItem(CUSTOMER_INFO_KEY, EMPTY);
				return;
			}
			alert(LOGIN_SUCCESSFUL_NOTIFICATION);
			regLogModal.hide();
			setAccount();
		}
	});
};

const logout = () => {
	showEle($("link-login"));
	hideEle($("manage-account"));
	window.localStorage.setItem(CUSTOMER_INFO_KEY, EMPTY);
	alert(LOGOUT_NOTIFICATION);
};

//-------------------------------------------------------------

if (window.localStorage.getItem(CUSTOMER_INFO_KEY) != EMPTY) {
	setAccount();
}
$("lg-password").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("sign-in-up-form__modal").addEventListener(MODAL_SHOW_EVENT, () => {
	$("lg-password").type = PASSWORD_TYPE;
	$("new-password").type = PASSWORD_TYPE;
	$("repeated-password").type = PASSWORD_TYPE;
	resetLogin();
	resetReg();
});
