const REGISTER_SUCCESSFULL_NOTIFICATION = "Đăng ký thành công!";
const OTP_SUBJECT = "[Coffee House][Mã OTP]";
const REGISTER_SUBJECT = "[Coffee House][Chúc mừng bạn đã đăng Ký thành công!]";
//const regLogModal = new bootstrap.Modal($("sign-in-up-form__modal"));
//const OTPModal = new bootstrap.Modal($("OTP__modal"));
var OTP, cusName, email;

const nextToOTP = () => {
	const sendOTP = async () => {
		OTP = generateOTP().toString();
		var subject = OTP_SUBJECT;
		var message = `Xin chào <b>${cusName}</b>!<br>
				Chào mừng bạn đã đăng kí tài khoản tại Coffee House!<br>
				Mã OTP của bạn là: <b>${OTP}.</b>
			`;
		await sendEmail(subject, message, email);
		OTP = CryptoJS.SHA256(OTP).toString();
	};

	hideEle($("blank-start-error"));
	cusName = $("new-cusName").value;
	email = $("new-email").value;
	if (!(cusName && email)) {
		showEle($("blank-start-error"));
		return;
	}
	var url = `${URL_API}${CUSTOMERS}`;
	callBackAPI(url).then((res) => {
		var cusArr = res.data;
		for (var cus of cusArr) {
			if (email == cus.info.email) {
				showEle($("email-registered-error"));
				return;
			}
		}
		sendOTP();
		aniStart.play();
	});
};

const enterOTP = () => {
	if ($("OTP-code").value.length == 6) {
		var inpOTP = CryptoJS.SHA256($("OTP-code").value).toString();
		if (inpOTP == OTP) {
			aniOTP.play();
			return;
		}
		showEle($("OTP-wrong-error"));
	}
};

const register = async () => {
	var userName = $("new-username").value;
	var phoneNumber = $("new-phoneNumber").value;
	var address = $("new-address").value;
	var password = $("new-password").value;
	var repeatedPassword = $("repeated-password").value;

	if (!(phoneNumber && userName && address && password && repeatedPassword)) {
		showEle($("blank-error"));
		return;
	}
	// check repeat password
	if (password.length < 6) {
		showEle($("password-length-error"));
		return;
	}
	if (password != repeatedPassword) {
		showEle($("password-repeated-error"));
		return;
	}

	var url = `${URL_API}${CUSTOMERS}`;
	await callBackAPI(url)
		.then((res) => {
			var cusArr = res.data;
			for (var cus of cusArr) {
				if (phoneNumber == cus.info.phoneNumber) {
					showEle($("phoneNumber-registered-error"));
					return false;
				}
				hideEle($("phoneNumber-registered-error"));
				if (userName == cus.account.userName) {
					showEle($("username-registered-error"));
					return false;
				}
				hideEle($("username-registered-error"));
			}
			return true;
		})
		.then((status) => {
			if (status) {
				password = CryptoJS.SHA256(password).toString();
				return callBackAPI(
					url,
					POST_METHOD,
					new Customer(
						new Info(cusName, phoneNumber, email, address),
						new Account(userName, password)
					)
				);
			}
		})
		.then(async (res) => {
			if (res.statusText == "Created") {
				var cus = res.data;
				var message = `Chào mừng bạn đến với Coffee House.<br>
					Tài khoản của bạn là <b>${cus.account.userName}</b>.<br>
					Mật khẩu của bạn là <b>${repeatedPassword}</b>.
				`;
				await sendEmail(REGISTER_SUBJECT, message, cus.info.email);
				alert(REGISTER_SUCCESSFULL_NOTIFICATION);
				window.location.href = "index.html";
			}
		});
};
//------------------------orther functions-----------------------
const generateOTP = () => {
	return Math.floor(Math.random() * (1000000 - 100000) + 100000); // random OTP is ranged from 1000000 to 999999
};

//##########################################################################

$("new-password").addEventListener(DBCLICK_EVENT, convertPasswordText);
$("repeated-password").addEventListener(DBCLICK_EVENT, convertPasswordText);
var textWrapper = document.querySelector("#notification .letters");
textWrapper.innerHTML = textWrapper.textContent.replace(
	/\S/g,
	"<span class='letter'>$&</span>"
);
var aniStart = anime
	.timeline({ loop: false })
	.add({
		duration: 1000,
		delay: 1000,
		easing: "easeOutExpo",
		complete: () => {
			showEle($("OTP-section"));
			hideEle($("start-section"));
		},
	})
	.add({
		targets: "#notification .letter",
		translateY: ["1.3em", 0],
		translateZ: 0,
		duration: 1000,
		delay: (el, i) => 60 * i,
	})
	.add({
		targets: "#notification",
		opacity: 0,
		duration: 500,
		easing: "easeOutExpo",
		delay: 200,
		complete: () => {
			document.getElementById("notification").style.display = "none";
		},
	})
	.add({
		targets: ".entering-OTP",
		opacity: 1,
		duration: 1000,
		easing: "easeOutExpo",
		delay: 0,
	});
aniStart.pause();
var aniOTP = anime({
	targets: "#OTP-section",
	duration: 1000,
	delay: 2000,
	easing: "easeOutExpo",
	complete: () => {
		hideEle($("OTP-section"));
		showEle($("end-section"));
	},
});
aniOTP.pause();
