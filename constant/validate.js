const{carpenter_Name,shopsName,arcitecsname,mobileNo,address,
    userName,serialNumber,rate,quantity,description,password,login_id}=require('../App/middlware/validation')
exports.validate = function (method) {

    switch (method) {
        case 'carpentercreate':
            return [
                carpenter_Name,
                mobileNo
            ];
        case 'carpenterupdate':
            return[
                carpenter_Name,
                mobileNo  
            ];
        case 'architacecreate':
            return [
                arcitecsname,
                mobileNo
            ];
        case 'architaceupdate':
            return [
                arcitecsname,
                mobileNo
            ]; 
        case 'shopcreate':
            return[
                shopsName,
                mobileNo
            ];
        case 'shopupdate':
            return[
            shopsName,
            mobileNo
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
                serialNumber,
                address,
                rate,
                quantity,
                description
            ];
        case 'login':return[
            login_id,
            password
        ]
    }
} 