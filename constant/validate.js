const{carpenter_Name,shopsName,arcitecsname,mobileNo,address,
    userName,serialNumber,rate,quantity,description}=require('../App/middlware/validation')
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
                arcitecsname,
                mobileNo,
                address
            ];
        case 'architaceupdate':
            return [
                arcitecsname,
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
                serialNumber,
                rate,
                quantity,
                description
            ];
        case 'userupdate':
            return[
                userName,
                mobileNo,
                address,
                serialNumber,
                rate,
                quantity,
                description
            ];
    }
} 