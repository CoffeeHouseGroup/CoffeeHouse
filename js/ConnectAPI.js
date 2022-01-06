const URL_API = "https://61bc10bed8542f0017824528.mockapi.io/";
const URL_API2 = "https://61c3a7399cfb8f0017a3ec6b.mockapi.io/";
const COUPONS = "Coupons/";
const ADMINS = "Admins/"
const CATEGORIES = "Categories/";
const PRODUCTS = "/Products/";
const CUSTOMERS = "Customers/";
const BILLS = "Bills/";
const GET_METHOD = "get";
const POST_METHOD = "post";
const PUT_METHOD = "put";
const DELETE_METHOD = "delete";

/**
 * @param {callBack} callBack
 */
const callBackAPI = (url, method = GET_METHOD, data = null, callBack = null) => {
	return axios({
			method: method,
			url: url,
			data: data,
		})
		.then((res) => {
			if (callBack != null) {
				return callBack(res.data);
			}
			return res;
		})
		.catch((err) => console.log(err));
};
