const{carpenter_Name,shopsName,arcitecsName,mobileNo,address,
    userName,architectureId,carpenterId,shopId}=require('../App/middlware/validation')
exports.validate = function (method) {

    switch (method) {
        case 'carpentercreate':
            return [
                carpenter_Name,
                mobileNo,
                address
            ];
        case 'carpenterupdate':
            return[
                carpenter_Name,
                mobileNo,
                address
            ];
        case 'architacecreate':
            return [
                arcitecsName,
                mobileNo,
                address
            ];
        case 'architaceupdate':
            return [
                arcitecsName,
                mobileNo,
                address
            ]; 
        case 'shopcreate':
            return[
                shopsName,
                mobileNo,
                address
            ];
        case 'shopupdate':
            return[
            shopsName,
            mobileNo,
            address
        ];
        case 'usercreate':
            return[
                userName,
                mobileNo,
                address,
                architectureId,
                carpenterId,
                shopId
            ];
        case 'userupdate':
            return[
                userName,
                mobileNo,
                address,
                architectureId,
                carpenterId,
                shopId
            ];
    }
} 