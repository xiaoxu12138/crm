$(function(){
    //console.log(2333);
    $(".submit").click(async function(e){
        //console.log(6666);
        let account=$(".userName").val().trim();
        let password=$(".userPass").val().trim();
        if(account===""||password===""){
            alert("密码或账号不能为空")
            return
        }
        password=md5(password);
        let res=await axios.post("/user/login",{account,password})
        console.log(res);
        if(parseInt(res.code)===0){
            alert("登录成功")
            window.location.href="index.html"
            return;
        }
        alert("用户名和密码出错了")
        // axios.post("/user/login",{
        //     account,
        //     password
        // }).then(value=>{
        //     console.log(value);
        // }).catch(err=>{
        //     console.log(err);
        // })
    })
})