// Đối tượng `Validator`
function Validator(options) {
    function getParent(element, selector) {  
        while (element.parentElement) { // Vòng lặp kiểm tra để lấy thằng cha của thẻ input
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector); // Từ input --> Lấy thẻ cha --> Lấy thẻ form-message, erroSelector, formGroupSelector: đc định nghĩa ở Validator, 
        var errorMessage; // Trả về undefined khi không có lỗi, trả về erroMessage khi có lỗi

        // Lấy ra các rules của 1 selector
        var rules = selectorRules[rule.selector];
        
        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) { // .type để lấy đc type của thẻ input
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i]( 
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value); // Lỗi đầu tiên tìm đc
            }
            if (errorMessage) break; //Nếu có lỗi thì thoát khỏi vòng lặp
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage; // Nếu có lỗi --> Báo message lỗi
            getParent(inputElement, options.formGroupSelector).classList.add('invalid'); // Có chữ màu đỏ
        } else {
            errorElement.innerText = ''; // Không có lỗi thì báo erroMessage rỗng
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid'); 
        }
        return !errorMessage; //Ngược lại với message lỗi để xử lý onclick submit
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ..)
        options.rules.forEach(function (rule) {

        //Trường hợp 1 Element có nhiều rules    
        // Lưu lại các rules cho mỗi input
        if (Array.isArray(selectorRules[rule.selector])) { // Nếu các rules là mảng thì tất cả các rule đều có tác dụng
            selectorRules[rule.selector].push(rule.test);
        } else { // Ngược lại thì gán cho form-group đó là rule đầu tiên
            selectorRules[rule.selector] = [rule.test];
        }

        var inputElements = formElement.querySelectorAll(rule.selector); // rule.selector: id của thẻ form-group

        Array.from(inputElements).forEach(function (inputElement) {
            // Xử lý trường hợp blur khỏi input (Blur khỏi input thì báo lỗi)
            inputElement.onblur = function () {
                // Lấy đc value qua inputElement.value
                // Lấy đc hàm keierm tra test qua rule.test --> Viết hàm rule.test trở thành function nhận value người dùng nhập vào --> Kiểm tra người dùng nhập gì chưa
                validate(inputElement, rule);
            }

            // Xử lý mỗi khi người dùng nhập vào input (Khi nhập input thì hết báo lỗi)
            inputElement.oninput = function () { // Bắt sự kiện 
                var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                errorElement.innerText = ''; //Bỏ đi message lỗi
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid'); // Xóa class message lỗi
            } 
        });
        });




        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault(); // Bỏ sự kiện mặc định của nút submit

            var isFormValid = true;

            // Lặp qua từng rules và validate (để báo lỗi)
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector); // Lấy input các form-group
                var isValid = validate(inputElement, rule);
                if (!isValid) { // Nếu có 1 rule báo lỗi thì khi submit sẽ báo lỗi cả form
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]'); // Lấy tất cả các thẻ input có thẻ name
                    var formValues = Array.from(enableInputs).reduce(function (values, input) { // Lấy tất cả value của các thẻ đc lấy
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value; // Nếu input ko đc check thì báo lỗi
                                break;
                            case 'checkbox': // Xử lý trường hợp checkbox chọn nhiều lựa chọn thì trả về đúng 
                                if (!input.matches(':checked')) { // Nếu input ko đc check thì báo lỗi
                                    values[input.name] = ''; // Không nhập gì vẫn trả về giá trị rỗng
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file': // File - upload ảnh
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }
    }

}



// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
// Đối số thứ 3 message: trả về biến message trước khi trả về erroMessage, nếu message rỗng --> trả về biến erroMessage
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined :  message || 'Please enter this form' // Nếu người dùng có nhập (value) --> Không có gì cả, Ngược lại trả về erroMessage
        }//.trim(): Loại bỏ các khoảng trắng
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  message || 'Please enter a valid email address.';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined :  message || `Please enter at least ${min} characters`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Does not match information';
        }// Nếu value người dùng nhập vào giống với điều kiện của Validator đã định nghĩa thì message lỗi rỗng, ngược lại.....
    }
}