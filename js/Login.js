const LOGIN_SUCCESSFUL_NOTIFICATION = "Đăng nhập thành công!";
const ADMIN_LOGIN_NOTIFICATION = "Admin Successfully login!";
const BANNED_ACCOUNT_WARNING =
	"Tài khoản của bạn đã bị khóa!\nLiên hệ với admin để mở khóa!";
var isAdmin;
const resetLogin = () => {
	$("lg-username").value = EMPTY;
	$("lg-password").value = EMPTY;
};

const login = () => {
	const resetLoginError = () => {
		hideEle($("login-error"));
		hideEle($("blank-login-error"));
	};

	resetLoginError();
	var isAdmin = $("loginAdmin__cb").checked;
	var url = isAdmin ? `${URL_API2}${ADMINS}` : `${URL_API}${CUSTOMERS}`;
	callBackAPI(url)
		.then((res) => {
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
		})
		.then((status) => {
			if (status) {
				if (isAdmin) {
					// Redirect to admin page
					alert(ADMIN_LOGIN_NOTIFICATION);
					window.location.href = "admin.html";
					window.localStorage.setItem(CUSTOMER_INFO_KEY, EMPTY);
					return;
				}
				window.location.href = "index.html";
				alert(LOGIN_SUCCESSFUL_NOTIFICATION);
				regLogModal.hide();
				setAccount();
			}
		});
};

//-------------------------------------------------------------

$("lg-password").addEventListener(DBCLICK_EVENT, convertPasswordText);
