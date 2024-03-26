const Controller = loadCore('controller');
module.exports = class user extends Controller {

	constructor() {
		super();
	}
	async userRegistration(Req, Res) {
		let RequestData = loadValidator(Req, Res);
		let receiveData = {
			first_name: RequestData.post('first_name', true, 'First Name').val(),
			last_name: RequestData.post('last_name', true, 'Last Name').val(),
			email: RequestData.post('email', true, 'Email').type('email').val(),
			password: RequestData.post('password', true, 'Password').sameAs('confirm_password').val()
		}

		if (!RequestData.validate()) return false;

		let UserModel = loadModel('UserModel');

		try {
			let user = await UserModel.userRegistration(receiveData);
			return ApiResponse(Res, 'SUCCESS')
		}
		catch (error) {
			if (error.code == 'ER_DUP_ENTRY') return ApiErrorResponse(Res, 'DUPLICATE_ENTRY', 'This email address is already registered');
			else {
				console.log(error);
				ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
			}
		}

	}
	async checkUser(Req, Res) {
		let RequestData = loadValidator(Req, Res);
		let receiveData = {
			email: RequestData.post('email', true).val()
		}
		if (!RequestData.validate()) return false;


		try {
			let UserModel = loadModel('UserModel');
			let user = await UserModel.find(receiveData);
			// console.log(json_data)
			if (user) ApiResponse(Res, { hasUser: true, message: "User Found" });
			else ApiResponse(Res, { hasUser: false, message: "User Not Found" });
		} catch (error) {
			if (error.error_code) return ApiErrorResponse(Res, error.error_code, error.message);
			else {
				console.log(error)
				return ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
			}
		}
	}

	async userLogin(Req, Res) {
		let RequestData = loadValidator(Req, Res);
		let receiveData = {
			email: RequestData.post('email', true).type('email').val(),
			password: RequestData.post('password', true, 'Password').val()
		}
		let uuid = RequestData.post('uuid', false).val();

		if (!RequestData.validate()) return false;

		let UserModel = loadModel('UserModel');

		try {
			let dataFromDb = await UserModel.userPasswordCheck(receiveData);
			let {
				JWT_ACCESS_TOKEN_SECRET,
				JWT_REFRESH_TOKEN_SECRET,
				JWT_ACCESS_TOKEN_EXPIRES,
				JWT_REFRESH_TOKEN_EXPIRES,
			} = process.env;

			let payLoadFiled = ['id', 'email', 'name'];
			let accessToken = await UserModel.generateAccessToken(dataFromDb, JWT_ACCESS_TOKEN_SECRET, payLoadFiled, JWT_ACCESS_TOKEN_EXPIRES);
			let refreshToken = await UserModel.generateAccessToken(dataFromDb, JWT_REFRESH_TOKEN_SECRET, payLoadFiled, JWT_REFRESH_TOKEN_EXPIRES);
			let tokenSavingData = {
				"access_token": accessToken,
				"refresh_token": refreshToken,
				"user_id": dataFromDb.id,
				ip: Req.headers['x-forwarded-for'] || Req.socket.remoteAddress,
				"user_agent": Req.get('user-agent')
			};
			if (tokenSavingData.ip == "::1") tokenSavingData.ip = 'localhost';

			let isTokenSaved = await UserModel.saveToken(tokenSavingData);
			if (!isTokenSaved) {
				return ApiErrorResponse(res, 'AUTH_FAILURE', 'login Failed');
			}
			let responseBody = {
				access_token: accessToken,
				refresh_token: refreshToken,
				access_token_expiary_in: JWT_ACCESS_TOKEN_EXPIRES,
				userInfo: {
					user_id: dataFromDb.id,
					email: dataFromDb.email,
					first_name: dataFromDb.first_name,
					last_name: dataFromDb.last_name
				}
			};
			ApiResponse(Res, responseBody)

		} catch (error) {
			if (error.error_code) return ApiErrorResponse(Res, error.error_code, error.message);
			console.log(error)
			return ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
		}
	}

	async refreshToken(req, Res) {
		let UserModel = loadModel('UserModel');

		let token = req.refreshToken;
		let payload = req.payload;
		delete req.refreshToken;
		delete req.payload;
		try {
			let isRefreshTokenAvaiableOnDb = await UserModel.
				refreshTokenCheckAndValidate(token, payload);

			if (!isRefreshTokenAvaiableOnDb) {
				return ApiErrorResponse(Res, 'AUTH_FAILURE', 'refresh token is not valid');
			}
			let {
				JWT_ACCESS_TOKEN_SECRET: tokenSecret,
				JWT_REFRESH_TOKEN_SECRET: refreshTokenSecret,
				JWT_ACCESS_TOKEN_EXPIRES: accessTokenExpiries
			} = process.env;
			let payLoadFiled = ['id', 'email', 'name'];
			let accessToken = await UserModel.
				generateAccessToken(payload, tokenSecret, payLoadFiled, accessTokenExpiries);
			let updateToken = await UserModel.
				updateToken({ refresh_token: token }, { access_token: accessToken });

			let responseBody = {
				message: 'save the refresh token for regenerate access token after the expriries of access token',
				access_token: accessToken,
				refresh_token: token,
				access_token_expiary_in: accessTokenExpiries
			};
			Res.header('auth-token', accessToken);
			return ApiResponse(Res, responseBody);
		}
		catch (err) {
			console.log(err);
			return ApiErrorResponse(Res, err.error_code || 'SOMETHING_WENT_WRONG');
		}
	}

	async checkAuthToken(Req, Res) {
		let RequestData = loadValidator(Req, Res);
		let receiveData = {
			token: RequestData.post('token', true).val(),
		}
		let type = RequestData.post('type', true).allow(['password-reset']).val() // password-reset
		if (!RequestData.validate()) return false;

		let UserModel = loadModel('UserModel');
		try {
			let status;
			if (type == 'password-reset') status = await UserModel.resetTokenCheck(receiveData);
			return ApiResponse(Res, status)
		}
		catch (error) {
			if (error.error_code) return ApiErrorResponse(Res, error.error_code, error.message);
			else {
				console.log(error);
				ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
			}
		}

	}

	async logout(Req, Res) {
		try {
			let UserModel = loadModel('UserModel');

			let logout = await UserModel.deleteToken({ user_id: Req.user.id, id: Req.user.token_id });
			if (logout) {
				return ApiResponse(Res, "log out successfully")
			}
			return ApiErrorResponse(Res, 'OPP_FAILURE', 'Logout failure');
		}
		catch (error) {
			console.log(error);
			return ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
		}
	}

	async updatePassword(Req, Res) {
		let RequestData = loadValidator(Req, Res),
			email = Req.user.email,
			old_password = RequestData.post('old_password', true).val(),
			password = RequestData.post('new_password', true).sameAs('confirm_password').val();

		if (!RequestData.validate()) return false;

		let UserModel = loadModel('UserModel');

		try {
			let exist = await UserModel.userPasswordCheck({ email, password: old_password });
			if (!exist) return ApiErrorResponse(Res, 'INVALID_PASS');
			let user = await UserModel.resetPassword(email, password);
			return ApiResponse(Res, 'SUCCESS')
		}
		catch (err) {
			ApiErrorResponse(Res, err.error_code || 'SOMETHING_WENT_WRONG');
		}

	}
	async updateUserInfo(Req, Res) {
		try {
			let { id } = Req.user;
			let RequestData = loadValidator(Req, Res),
				update_data = {
					first_name: RequestData.post('first_name', true, 'First Name').type('string').val(),
					last_name: RequestData.post('last_name', true, 'Last Name').type('string').val()
				}
			if (!RequestData.validate()) return false;

			let UserModel = loadModel('UserModel');
			let updated_res = await UserModel.update({ id }, update_data)

			if (updated_res) return ApiResponse(Res, { message: 'SUCCESS', id })
			else ApiErrorResponse(Res, 'DATA_NOT_FOUND');
		} catch (err) {
			console.log(err)
			ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
		}
	}

	async getPasswordResetToken(Req, Res) {
		let RequestData = loadValidator(Req, Res)
		let email = RequestData.post('email', true).type('email').val();

		if (!RequestData.validate()) return false;

		let Random = require('randomstring');
		let token = Random.generate({
			length: 8,
			charset: 'numeric'
		});

		let UserModel = loadModel('UserModel');
		let user = await UserModel.find({ email });
		if (user) {
			try {
				let token_hash = await UserModel.generateHash({ reset_password: token }, 'reset_password');
				let updated_res = await UserModel.update({ id: user.id }, { ...token_hash, reset_password_at: UserModel.db.raw('now()') })
				let res = await UserModel.sendEmailForPasswordReset({ token, email });
				ApiResponse(Res, "SUCCESS")
			} catch (err) {
				console.log(err)
				ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
			}
		} else ApiErrorResponse(Res, 'USER_NOT_FOUND');
	}
	async resetPassword(Req, Res) {
		let RequestData = loadValidator(Req, Res),
			email = RequestData.post('email', true).type('email').val(),
			otp = RequestData.post('otp', true).val(),
			password = RequestData.post('new_password', true).sameAs('confirm_password').val();

		if (!RequestData.validate()) return false;

		let UserModel = loadModel('UserModel');

		try {
			let exist = await UserModel.userResetTokenCheck({ email, reset_password: otp });
			if (!exist) return ApiErrorResponse(Res, 'INVALID_OTP');
			let user = await UserModel.resetPassword(email, password, { reset_password: null });
			return ApiResponse(Res, 'SUCCESS')
		}
		catch (err) {
			console.log(err)
			ApiErrorResponse(Res, err.error_code || 'SOMETHING_WENT_WRONG');
		}

	}
}