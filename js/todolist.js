$(function() {

    // ----------------------------------------------数据本地化
    // 整个列表：[]
    // 一条数据：{}
    var arr = [];

    load();

    function load() {
        var str = localStorage.getItem("todos");
        if (str != null) {
            arr = JSON.parse(str);
        }

        // 清空
        $.each(arr, function(i, item) {

            // 新建li
            var li = $("<li></li>");

            // 已经完成
            if (item.zhuangtai == false) {

                li.html(`<input type='checkbox' > 
                 <p>${item.info}</p> 
                 <a href='javascript:;' sf=${item.sf}></a>`);

                $("#todolist").append(li);
            }
            // 没有完成
            else {
                li.html(`<input type='checkbox'  checked> 
                     <p>${item.info}</p> 
                     <a href='javascript:;' sf=${item.sf}></a>`);

                $("#donelist").append(li);
            };

        });
        $("#todocount").text($("#todolist li").length);
        $("#donecount").text($("#donelist li").length);
    };



    // ------------------------------------------------修改
    // 1.发布的时候：新计划；新增属性zhuangtai：
    // 2.页面刷新后，根据新属性zhuangtai  ,区分数据要去哪个列表？
    // 3.修改？哪里可以修改？ 两个列表都可以修改
    //    3.1 点击之后拿到id
    //    3.2 把档案里的数据重新修改
    //    3.3 修改之后重新存回去
    //    3.4 再次读取数据，渲染列表，封装；
    // ck 注册点击事件？事件委托？找个父级注册事件
    $("section").on("click", "input", function() {

        // ------------------------------------------数据操作；
        // 点击之后？修改状态
        //   1.1 拿到修改是哪条数据？
        // 找唯一标识
        var sf = $(this).siblings("a").attr("sf");

        // 找档案
        for (var i = 0; i < arr.length; i++) {

            if (arr[i].sf == sf) {

                //-----------------------取反
                arr[i].zhuangtai = !arr[i].zhuangtai;

                // 拿到的数据 状态是 false :没有完成
                // if (arr[i].zhuangtai == false) {
                //     arr[i].zhuangtai = true;
                // } 
                // 拿到的数据 状态是 true :已经完成
                //else {
                //     arr[i].zhuangtai = false;
                // };

                break;
            };

        };

        //  1.2 修改后arr再次存入U盘 存回去
        var str = JSON.stringify(arr);
        localStorage.setItem("todos", str);

        // ------------------------------------------DOM操作；
        // 面对DOM：从没有完成的列表如何跳到已经完成的列表！非常复杂！不用关心到底是怎么排的！
        // 1. 把 ol  ul 两个列表清空！
        $("#todolist").empty();
        $("#donelist").empty();
        // 2. 用 arr 数组 重新全部渲染列表

        load(); // 页面重新加载
    });



    //-------------------------------------------------新增

    // 1.1 #title注册键盘事件
    $("#title").on("keydown", function(e) {
        // 1.2 判断按下是回车 keyCode
        if (e.keyCode == 13) {

            // 唯一标识
            var sf = Date.now() + "_" + Math.random();

            // ------------------------------------DOM操作
            // 1.3 新建li
            var li = $("<li></li>");

            // 1.4 添加内容
            var val = $(this).val();

            li.html(`<input type='checkbox' > 
            <p>${val}</p> 
            <a href='javascript:;' sf=${sf}></a>`);

            // 1.5 添加到哪里？
            $("#todolist").prepend(li);

            // 1.6 清空输入框
            $(this).val("");

            // 1.7 显示条数
            $("#todocount").text($("#todolist li").length);


            //-----------------------------数据操作
            // 1.1 一条数据的建立
            var one = {};
            one.info = val;
            one.sf = sf;
            //标识计划没有完成属性名和值false
            one.zhuangtai = false;

            // 1.2 放入整个列表的数组里面：
            arr.unshift(one);

            // 1.3 存入本地U盘
            var str = JSON.stringify(arr);
            localStorage.setItem("todos", str);
        };
    });



    //------------------------------------------删除
    // 事件委托:不是给每个a 注册事件
    $("section").on("click", "a", function() {

        // ------------------------------------------DOM操作
        // 找父级删除
        $(this).parent().remove();

        // 显示条数
        $("#todocount").text($("#todolist li").length);
        $("#donecount").text($("#donelist li").length);


        //---------------------------数据操作
        var sf = $(this).attr("sf");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].sf == sf) {
                arr.splice(i, 1);
                break;
            };

        };
        var str = JSON.stringify(arr);
        localStorage.setItem("todos", str);
    });





});