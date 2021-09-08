var CORRECT_USER = 'hoangvu.pcx@gmail.com'
var CORRECT_PASS = 'nguyenhoangvu'


var inputUsername = document.getElementById('username')
var inputPassword = document.getElementById('password')



var formLogin = document.getElementById('form-login')

if(formLogin.attachEvent) {
    formLogin.attachEvent('login' onFormSubmit)
} else {
    formLogin.addEventListener('login', onFormSubmit)
}

function onFormSubmit(e) {
    var username = inputUsername.value;
    var password = inputPassword.value;

    if(username == CORRECT_USER && password == CORRECT_PASS) {
        alert('Đăng nhâp thành công!')
    } else {
        alert('Thất bại trong quá trình đăng nhập!')
    }
}