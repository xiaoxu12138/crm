$(function () {

    let $itemBoxList=null;

    init();

    let $plan = $.Callbacks();

    $plan.add((_, baseInfo) => {
        $(".baseBox>span").html(`你好，${baseInfo.name || ''} `);
        $(".baseBox>a").click(async function () {
            let result = await axios.get("/user/signout");
            if (result.code == 0) {
                window.location.href = "login.html"
                return;
            }
            alert("退出有问题~")
        })
    })
    function handGroup(index){
        console.log(66666);
        let $group1=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr("text");
            return text ==="客户管理"
        })
        let $group2=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr("text");
            return /^(员工管理|部门管理|职务管理)/.test(text);
        })
        //console.log($group2);
        if(index===0){
            $group1.css("display","block");
            $group2.css("display","none");
        }
        if(index===1){
            $group1.css("display","none");
            $group2.css("display","block");
        }
    }
    
    $plan.add((power) => {
        console.log("渲染菜单", power);
        let str = ``;
        if(power.includes("userhandle")){
            str += `
            <div class="itemBox" text="员工管理">
                <h3><i class=""></i>员工管理</h3>
                <div class="item"><a href="javascript:;">员工列表</a></div>
                <div class="item"><a href="javascript:;">新增员工</a></div>
            </div>
        `;
        }
        if(power.includes("departhandle")){
            str += `
            <div class="itemBox" text="部门管理">
                <h3><i class=""></i>部门管理</h3>
                <div class="item"><a href="javascript:;">部门列表</a></div>
                <div class="item"><a href="javascript:;">新增部门</a></div>
            </div>
        `;
        }
        if(power.includes("jobhandle")){
            str += `
            <div class="itemBox" text="职务管理">
                <h3><i class=""></i>职务管理</h3>
                <div class="item"><a href="javascript:;">职务列表</a></div>
                <div class="item"><a href="javascript:;">新增职务</a></div>
            </div>
        `;
        }
        if (power.includes("customerall")) {
            str += `
            <div class="itemBox" text="客户管理">
                <h3><i class=""></i>客户管理</h3>
                <div class="item"><a href="javascript:;">我的客户</a></div>
                <div class="item"><a href="javascript:;">全部客户</a></div>
                <div class="item"><a href="javascript:;">新增客户</a></div>
            </div>
        `;
        }
        $(".menuBox").html(str);
        
        $itemBoxList=$(".menuBox").find(".itemBox");
    })
    $plan.add((power)=>{
        let initIndex=power.includes("customerall")? 0:1;
        $(".navBox>a").eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex);
        $(".navBox>a").click(function(){
            let text=$(this).html().trim();
            let index=$(this).index();
            if((text==="客户管理")&&!/customerall/.test(power)||(text==="组织结构")&&!/(userhandle|departhandle|jobhandle)/.test(power)){
                alert("没有访问权限")
                return;
            }
            if(index===initIndex) return;
            $(this).addClass("active").siblings().removeClass("active");
            handGroup(index);
            initIndex=index;
        })
    })
    $plan.add(power=>{
        let url="page/customerlist.html";
        
        if(power.includes("customerall")){
            $(".iframeBox").attr("src",url);
        }
    })
    async function init() {
        let result = await axios.get("/user/login");
        if (result.code !== 0) {
            alert("还未登录，请先登录")
            window.location.href = "login.html";
            return;
        }
        let [power, baseInfo] = await axios.all([
            axios.get("/user/power"),
            axios.get("/user/info")
        ])
        power.code === 0 ? power = power.power : null;
        baseInfo.code === 0 ? baseInfo = baseInfo.data : null;
        $plan.fire(power, baseInfo);
    }
})




