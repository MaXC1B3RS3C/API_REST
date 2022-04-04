function validateForm(){
    console.log("Comprovant el formulari...");
    if(document.getElementById('name').value != '' &&
        document.getElementById('email').value != '' &&
        document.getElementById('password').value != '') {
        if (document.getElementById('password').value == document.getElementById('password').value){
            alert('Les contrasenyes no coincideixen')
            return false
        }
        return true
    }
    else{
        alert('Has d\'omplir tots els camps')
        return false
    }

    //alert(document.getElementById('name').value)
    //var userForm = (document.forms['user_form']['name'].value)
    //var emailForm = (document.forms['user_form']['email'].value)
    //var passForm = (document.forms['user_form']['password'].value)
    //if (userForm == ""){
    //    alert("Introduce un usuario correctamente")
    //}else{}
    //if (emailForm == ""){
    //    alert("Introduce un email correctamente")
    //}else{}
    //if (passForm == ""){
    //    alert("Introduce un password correctamente")
    //}else{}
    //alert(document.getElementById('name').value)
    //alert(document.forms['user_form']['name'].value)
    //alert(document.forms['user_form']['email'].value)
    //alert(document.forms['user_form']['password'].value)
}