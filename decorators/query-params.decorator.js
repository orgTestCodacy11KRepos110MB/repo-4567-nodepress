"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = exports.QueryParamsField = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const forbidden_error_1 = require("../errors/forbidden.error");
const bad_request_error_1 = require("../errors/bad-request.error");
const biz_interface_1 = require("../interfaces/biz.interface");
const paginate_1 = require("../utils/paginate");
var QueryParamsField;
(function (QueryParamsField) {
    QueryParamsField["Page"] = "page";
    QueryParamsField["PerPage"] = "per_page";
    QueryParamsField["Sort"] = "sort";
    QueryParamsField["Date"] = "date";
    QueryParamsField["Keyword"] = "keyword";
    QueryParamsField["State"] = "state";
    QueryParamsField["Public"] = "public";
    QueryParamsField["Origin"] = "origin";
    QueryParamsField["ParamsId"] = "paramsId";
    QueryParamsField["CommentState"] = "commentState";
})(QueryParamsField = exports.QueryParamsField || (exports.QueryParamsField = {}));
exports.QueryParams = (0, common_1.createParamDecorator)((customConfig, context) => {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();
    const transformConfig = {
        [QueryParamsField.Page]: 1,
        [QueryParamsField.PerPage]: true,
        [QueryParamsField.ParamsId]: 'id',
        [QueryParamsField.Sort]: true,
    };
    if (customConfig) {
        customConfig.forEach((field) => {
            if (lodash_1.default.isString(field)) {
                transformConfig[field] = true;
            }
            if (lodash_1.default.isObject(field)) {
                Object.assign(transformConfig, field);
            }
        });
    }
    const querys = {};
    const options = {};
    const params = lodash_1.default.merge({ url: request.url }, request.params);
    const date = request.query.date;
    const paramsId = request.params[transformConfig.paramsId];
    const [page, per_page, sort, state, ppublic, origin] = [
        request.query.page || transformConfig.page,
        request.query.per_page,
        request.query.sort,
        request.query.state,
        request.query.public,
        request.query.origin,
    ].map((item) => (item != null ? Number(item) : item));
    const validates = [
        {
            name: '路由/ID',
            field: QueryParamsField.ParamsId,
            isAllowed: true,
            isIllegal: paramsId != null && !isAuthenticated && isNaN(paramsId),
            setValue() {
                if (paramsId != null) {
                    params[transformConfig.paramsId] = isNaN(paramsId)
                        ? new mongoose_1.Types.ObjectId(paramsId)
                        : Number(paramsId);
                }
            },
        },
        {
            name: '排序/sort',
            field: QueryParamsField.Sort,
            isAllowed: lodash_1.default.isUndefined(sort) || [biz_interface_1.SortType.Asc, biz_interface_1.SortType.Desc, biz_interface_1.SortType.Hot].includes(sort),
            isIllegal: false,
            setValue() {
                options.sort = {
                    _id: sort != null ? sort : biz_interface_1.SortType.Desc,
                };
            },
        },
        {
            name: '目标页/page',
            field: QueryParamsField.Page,
            isAllowed: lodash_1.default.isUndefined(page) || (lodash_1.default.isInteger(page) && Number(page) > 0),
            isIllegal: false,
            setValue() {
                if (page != null) {
                    options.page = page;
                }
            },
        },
        {
            name: '每页数量/per_page',
            field: QueryParamsField.PerPage,
            isAllowed: lodash_1.default.isUndefined(per_page) ||
                (lodash_1.default.isInteger(per_page) && Number(per_page) > 0 && Number(per_page) <= 50),
            isIllegal: false,
            setValue() {
                if (per_page != null) {
                    options.perPage = per_page;
                }
            },
        },
        {
            name: '日期查询/date',
            field: QueryParamsField.Date,
            isAllowed: lodash_1.default.isUndefined(date) || new Date(date).toString() !== 'Invalid Date',
            isIllegal: false,
            setValue() {
                if (date != null) {
                    const queryDate = new Date(date);
                    querys.create_at = {
                        $gte: new Date((queryDate / 1000 - 60 * 60 * 8) * 1000),
                        $lt: new Date((queryDate / 1000 + 60 * 60 * 16) * 1000),
                    };
                }
            },
        },
        {
            name: '发布状态/state',
            field: QueryParamsField.State,
            isAllowed: lodash_1.default.isUndefined(state) ||
                (transformConfig[QueryParamsField.CommentState]
                    ? [biz_interface_1.CommentState.Auditing, biz_interface_1.CommentState.Deleted, biz_interface_1.CommentState.Published, biz_interface_1.CommentState.Spam].includes(state)
                    : [biz_interface_1.PublishState.Published, biz_interface_1.PublishState.Draft, biz_interface_1.PublishState.Recycle].includes(state)),
            isIllegal: !isAuthenticated &&
                state != null &&
                state !==
                    (transformConfig[QueryParamsField.CommentState] ? biz_interface_1.CommentState.Published : biz_interface_1.PublishState.Published),
            setValue() {
                if (state != null) {
                    querys.state = state;
                    return false;
                }
                if (!isAuthenticated) {
                    querys.state = transformConfig[QueryParamsField.CommentState]
                        ? biz_interface_1.CommentState.Published
                        : biz_interface_1.PublishState.Published;
                }
            },
        },
        {
            name: '公开状态/public',
            field: QueryParamsField.Public,
            isAllowed: lodash_1.default.isUndefined(ppublic) ||
                [biz_interface_1.PublicState.Public, biz_interface_1.PublicState.Password, biz_interface_1.PublicState.Secret].includes(ppublic),
            isIllegal: ppublic != null && !isAuthenticated && ppublic !== biz_interface_1.PublicState.Public,
            setValue() {
                if (ppublic != null) {
                    querys.public = ppublic;
                    return false;
                }
                if (!isAuthenticated) {
                    querys.public = biz_interface_1.PublicState.Public;
                }
            },
        },
        {
            name: '来源状态/origin',
            field: QueryParamsField.Origin,
            isAllowed: lodash_1.default.isUndefined(origin) ||
                [biz_interface_1.OriginState.Original, biz_interface_1.OriginState.Hybrid, biz_interface_1.OriginState.Reprint].includes(origin),
            isIllegal: false,
            setValue() {
                if (origin != null) {
                    querys.origin = origin;
                }
            },
        },
    ];
    const isEnableField = (field) => field != null && field !== false;
    validates.forEach((validate) => {
        if (!isEnableField(transformConfig[validate.field])) {
            return false;
        }
        if (!validate.isAllowed) {
            throw new bad_request_error_1.HttpBadRequestError('参数不合法：' + validate.name);
        }
        if (validate.isIllegal) {
            throw new forbidden_error_1.HttpForbiddenError('权限与参数匹配不合法：' + validate.name);
        }
        validate.setValue();
    });
    const isProcessedFields = validates.map((validate) => validate.field);
    const allAllowFields = Object.keys(transformConfig);
    const todoFields = lodash_1.default.difference(allAllowFields, isProcessedFields);
    todoFields.forEach((field) => {
        const targetValue = request.query[field];
        if (targetValue != null)
            querys[field] = targetValue;
    });
    request.queryParams = { querys, options, params, isAuthenticated };
    const ip = (request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress ||
        request.ip ||
        request.ips[0]).replace('::ffff:', '');
    const ua = request.headers['user-agent'];
    const result = {
        querys,
        options,
        params,
        request,
        origin: request.query,
        visitors: { ip, ua, referer: request.referer },
        isAuthenticated,
    };
    return result;
});
//# sourceMappingURL=query-params.decorator.js.map