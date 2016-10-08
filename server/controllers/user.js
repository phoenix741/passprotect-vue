'use strict';

const config = require('config');
const _ = require('underscore');
const router = require('express-promise-router')();
const i18n = require('i18next');
const authenticate = require('../utils/passport').authenticate;
const permission = require('../utils/passport').permission;

module.exports = function (app, services) {
	/**
	 * @apiDefine ParamsUpdate
	 *
	 * @apiParam {String} _id User name
	 * @apiParam {String} password Password of the user
	 *
	 * @apiParamExample {json} User:
	 *   {
	 *     "_id": "myusername",
	 *     "password": "mypassword"
	 *   }
	 */

	/**
	 * @apiDefine ResponseUpdateComplete
	 *
	 * @apiSuccess {String} _id User name
	 * @apiSuccess {String} role Role of the user
	 *
	 * @apiSuccessExample {json} Success:
	 *   HTTP/1.1 200 OK
	 *   {
	 *     "_id": "myusername",
	 *     "role": "user"
	 *   }
	 */
	router.route('')
	/**
	 * @api {get} /api/users Request all users

	 * @apiDescription Request the list of users from the database. Only non-sensitive informations are available. Only
	 * the adminstrator can access to this API.
	 *
	 * @apiName GetUsers
	 * @apiGroup User
	 * @apiPermission ROLE_ADMIN
	 *
	 * @apiSuccess {String} _id User name.
	 * @apiSuccess {String="user","admin"} role Role of the user.
	 *
	 * @apiSuccessExample Success:
	 *     HTTP/1.1 200 OK
	 *     [
	 *       {
	 *         "_id": "test",
	 *         "role": "user"
	 *       },
	 *       {
	 *         "_id": "test2",
	 *         "role": "user"
	 *       },
	 *     ]
	 *
	 * @apiError Unauthorized Only a connected admin can see informations
	 * @apiError Forbidden Only the admin role can access to this informations
	 *
	 * @apiErrorExample {json} Unauthorized:
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "code": 401,
	 *       "message": "Unauthorized"
	 *     }
	 *
	 * @apiErrorExample {json} Forbidden:
	 *     HTTP/1.1 403 Forbidden
	 *     {
	 *       "code": 403,
	 *       "message": "Forbidden"
	 *     }
	 */
		.get(authenticate(), permission(['admin']), (req, res) => {
			const offset = req.query.offset || 0;
			const limit = req.query.limit || 10;

			return services.user.getUsers({offset, limit}).map(filterUser).then(res.json.bind(res));
		})
		/**
		 * @api {post} /api/users Register a new user
		 * @apiName PostUsers
		 * @apiGroup User
		 *
		 * @apiUse ParamsUpdate
		 * @apiUse ResponseUpdateComplete
		 */
		.post((req, res) => {
			const data = _.pick(req.body, '_id', 'password', 'encryption');

			const validationError = new Error();
			validationError.status = 400;
			if (!_.isString(data._id) || _.isEmpty(data._id)) {
				validationError.message = i18n.t('error:user.400._id');
				return Promise.reject(validationError);
			}

			if (!_.isString(data.password) || _.isEmpty(data.password) || data.password.length < 8) {
				validationError.message = i18n.t('error:user.400.password');
				return Promise.reject(validationError);
			}

			if (!_.isObject(data.encryption)) {
				validationError.message = i18n.t('error:user.400.encryption');
				return Promise.reject(validationError);
			}

			return services.user.registerUser(data).then(function (user) {
				res.json(filterUser(user));
			});
		});

	/**
	 * @api {get} /api/users/:userId Request a user
	 * @apiName GetUser
	 * @apiGroup User
	 * @apiPermission ROLE_USER
	 *
	 * @apiParam {String} userId The user id
	 *
	 * @apiUse ResponseUpdateComplete
	 *
	 * @apiError Unauthorized Only a connected user can call this method
	 * @apiError Forbidden Only the user connected can access to it's information
	 *
	 * @apiErrorExample {json} Unauthorized:
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "code": 401,
	 *       "message": "Unauthorized"
	 *     }
	 *
	 * @apiErrorExample {json} Forbidden:
	 *     HTTP/1.1 403 Forbidden
	 *     {
	 *       "code": 403,
	 *       "message": "Forbidden"
	 *     }
	 */
	router.route('/:userId')
		.get(authenticate(), permission(), function (req, res) {
			if (req.params.userId !== req.user._id) {
				const error = new Error('Forbidden');
				error.status = 403;
				return Promise.reject(error);
			}

			return res.json(filterUser(req.user));
		});

	app.use('/api/users', router);

	function filterUser(user) {
		return _.omit(user, 'password', 'confirmationToken');
	}
};
