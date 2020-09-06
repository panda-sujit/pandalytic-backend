'use strict';
const Validator = require('validator');
const isEmpty = require('./isEmpty.helper');
// const PhoneNumber = require('awesome-phonenumber');

const commonHelper = {};

commonHelper.mongoIdExistInArray = (mongodbIdArray, mongoDbId) => {
  for (let i = 0; i < mongodbIdArray.length; i++) {
    if (mongodbIdArray[i].toString() === mongoDbId.toString()) return true;
  }
  return false;
};

commonHelper.generateRandomNumberString = len => {
  return Math.floor(Math.random() * 8999 + 1000);
};
// commonHelper.parsePhoneNo = (phone, RegionCode) => {
//   try {
//     var pn = new PhoneNumber(phone, RegionCode);
//     if (!pn.isValid()) {
//       return {
//         status: false,
//         data: 'Provided no is invalid mobile no.',
//       };
//     } else if (!pn.isMobile()) {
//       return {
//         status: false,
//         data: 'Provided no should be mobile no.',
//       };
//     } else if (pn.isValid()) {
//       return {
//         status: true,
//         data: pn.getNumber('e164'),
//       };
//     } else {
//       return {
//         status: true,
//         data: pn.getNumber('e164'),
//       };
//     }
//   } catch (err) {
//     return err;
//   }
// };

commonHelper.parseFilters = (req, defaults, isDeleted) => {
  const limit_default = defaults ? defaults : 10;
  let page;
  let limit;
  let sortQuery = { _id: -1 };
  let searchQuery = {};
  let populate = [];
  let selectQuery = { __v: 0 };
  if (isDeleted === undefined) {
  } else if (isDeleted === null) {
  } else {
    if (!isNaN(isDeleted)) {
      searchQuery = { ...searchQuery, isDeleted: isDeleted };
      selectQuery = { ...selectQuery, isDeleted: 0, deletedAt: 0, deletedBy: 0 };
    }
  }
  if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
    page = Math.abs(req.query.page);
  } else {
    page = 1;
  }
  if (req.query.limit && !isNaN(req.query.limit) && req.query.limit != 0) {
    limit = Math.abs(req.query.limit);
  } else {
    limit = limit_default;
  }
  if (req.query.sort) {
    let sortfield = req.query.sort.slice(1);
    let sortby = req.query.sort.charAt(0);
    if (sortby == 1 && !isNaN(sortby) && sortfield) {
      //one is ascending
      sortQuery = sortfield;
    } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
      //zero is descending
      sortQuery = '-' + sortfield;
    } else {
      sortQuery = '';
    }
  }
  return { page, limit, sortQuery, searchQuery, selectQuery, populate };
};

commonHelper.sendResponse = (res, status, success, data, errors, msg, token) => {
  const response = {};
  if (success !== null) response.success = success;
  if (data !== null) {
    response.data = data;
  } else {
    response.data = [];
  }
  if (errors !== null) response.errors = errors;
  if (msg !== null) response.msg = msg;
  if (token !== null) response.token = token;
  return res.status(status).json(response);
};

commonHelper.paginationSendResponse = (res, status, success, data, msg, pageno, pagelimit, totalData, totalPages) => {
  const response = {};
  if (data) response.data = data;
  if (success !== null) response.success = success;
  if (msg) response.msg = msg;
  if (pageno) response.currentPage = pageno;
  if (pagelimit) response.limit = pagelimit;
  if (totalPages) response.totalPages = totalPages;
  if (typeof totalData === 'number') response.totalData = totalData;
  return res.status(status).json(response);
};

commonHelper.getQueryRequest = async (model, page, limit, sortQuery, findquery, selectQueryuery, populate) => {
  let datas = {};
  try {
    datas.data = await model
      .find(findquery)
      .select(selectQueryuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .populate(populate);
    datas.totalData = await model.countDocuments(findquery);
    datas.totalPages = Math.ceil(datas.totalData / limit);
    return datas;
  } catch (err) {
    throw err;
  }
};

commonHelper.sanitize = (req, sanitizeArray) => {
  sanitizeArray.forEach(sanitizeObj => {
    let sanitizefield = req.body[sanitizeObj.field];
    sanitizefield = !isEmpty(sanitizefield) ? sanitizefield + '' : '';
    const sanitization = sanitizeObj.sanitize;
    if (sanitization.rtrim) {
      sanitizefield = Validator.rtrim(sanitizefield);
    }
    if (sanitization.ltrim) {
      sanitizefield = Validator.ltrim(sanitizefield);
    }
    if (sanitization.blacklist) {
      sanitizefield = Validator.blacklist(sanitizefield);
    }
    if (sanitization.whitelist) {
      sanitizefield = Validator.whitelist(sanitizefield);
    }
    if (sanitization.trim) {
      sanitizefield = Validator.trim(sanitizefield);
    }
    if (sanitization.escape) {
      sanitizefield = Validator.escape(sanitizefield);
    }
    if (sanitization.unescape) {
      sanitizefield = Validator.unescape(sanitizefield);
    }
    if (sanitization.toBoolean) {
      sanitizefield = Validator.toBoolean(sanitizefield);
    }
    if (sanitization.toInt) {
      sanitizefield = Validator.toInt(sanitizefield);
    }
    if (sanitization.toFloat) {
      sanitizefield = Validator.toFloat(sanitizefield);
    }
    if (sanitization.toDate) {
      sanitizefield = Validator.toDate(sanitizefield);
    }
  });
  return true;
};
commonHelper.validation = (data, validationArray) => {
  let errors = {};
  validationArray.forEach(validationObj => {
    let value = data[validationObj.field];
    value = !isEmpty(value) ? value + '' : '';
    const validation = validationObj.validate;
    for (let i = 0; i < validation.length; i++) {
      const val = validation[i];
      switch (val.condition) {
        case 'IsEmpty':
          if (Validator.isEmpty(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case 'IsLength':
          if (val.option) {
            if (!Validator.isLength(value, val.option)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case 'IsInt':
          if (val.option) {
            if (!Validator.isInt(value, val.option)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case 'IsEqual':
          if (val.option) {
            if (!Validator.equals(val.option.one, val.option.two)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case 'IsMongoId':
          if (!Validator.isMongoId(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case 'IsIn':
          if (val.option) {
            if (!Validator.isIn(value, val.option)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case 'IsDate':
          if (!Validator.isISO8601(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case 'IsEmail':
          if (!Validator.isEmail(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case 'IsBoolean':
          if (!Validator.isBoolean(value.toString())) {
            errors[validationObj.field] = val.msg;
          }
          break;
        case 'IsAfter':
          if (val.option) {
            if (!Validator.isAfter(value, val.option.date)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case 'IsURL':
          if (val.option) {
            if (!Validator.isURL(value, val.option.protocols)) {
              errors[validationObj.field] = val.msg;
            }
          }
          break;
        case 'IsUppercase':
          if (!Validator.isUppercase(value)) {
            errors[validationObj.field] = val.msg;
          }
          break;
        // case 'IsPhone':
        //   let pn = new PhoneNumber(value);
        //   if (pn.isValid()) {
        //     if (val.option) {
        //       if (val.option.isMobile) {
        //         if (!pn.isMobile()) {
        //           errors[validationObj.field] = 'Enter mobile number';
        //         }
        //       } else {
        //         if (!pn.isFixedLine()) {
        //           errors[validationObj.field] = 'Enter landline number';
        //         }
        //       }
        //     }
        //   } else {
        //     errors[validationObj.field] = val.msg;
        //   }
        //   break;
        default:
          break;
      }
      if (errors[validationObj.field]) {
        i = validation.length;
      }
    }
  });
  return errors;
};
commonHelper.slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};
module.exports = commonHelper;
