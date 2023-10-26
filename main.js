"ui";
importClass(android.view.WindowManager);
importClass(android.view.View);
importClass(android.graphics.Color)
var storage = storages.create("chessStorage");
var chess_piece_width = storage.get("chess_piece_width", 115) //棋子宽度
var serverIp = storage.get("serverIp", "127.0.0.1")  //服务器IP
var threadCount = storage.get("threadCount", 6)  //皮卡鱼线程数
var deep = storage.get("deep", 20) //深度
var hashSize = storage.get("hashSize", 16) //hash
var level = storage.get("level", 20) //level
var freq = storage.get("freq", 1000) //freq
var window = activity.getWindow();
var decorView = window.getDecorView();
var option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
decorView.setSystemUiVisibility(option);
decorView.getChildAt(0).getChildAt(1).getLayoutParams().height = device.height
//fd.setLayoutParams(lp)
window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
window.setStatusBarColor(Color.TRANSPARENT);
var width = device.width
var height = device.height
var deviceInfo = width + "*" + height
ui.layout(
    <vertical bg="#000000" fitsSystemWindows="true">
        <text text="象棋助手(体验版)" w="*" h="100" textColor="green" gravity="center" textSize="28" />
        <text text="最佳分辨率1080*2400 本机({{deviceInfo}})" w="*" h="20" textColor="white" gravity="center" textSize="14" />
        <horizontal  >
            <text text="服务器ip:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="serverIp" text="{{serverIp}}" inputType="text" singleLine="true" textColor="white" w="80" h="*" />
        </horizontal>
        <horizontal  >
            <text text="棋子大小:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="chess_piece_width" text="{{chess_piece_width}}" inputType="number" singleLine="true" textColor="white" w="80" h="*" />
        </horizontal>
        <horizontal>
            <text text="识别频率ms:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="freq" text="{{freq}}" inputType="number" singleLine="true" textColor="white" w="80" h="*" />
        </horizontal>
        <horizontal>
            <text text="线程数:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="threadCount" text="{{threadCount}}" inputType="number" singleLine="true" textColor="white" w="80" h="*" />
        </horizontal>
        <horizontal>
            <text text="hashSize:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="hashSize" text="{{hashSize}}" inputType="number" singleLine="true" textColor="white" w="80" h="*" />
        </horizontal>
        <horizontal>
            <text text="技能等级:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="level" text="{{level}}" inputType="number" singleLine="true" hint="1-20" hintColor="white" textColor="white" w="80" h="*" />
        </horizontal>
        <horizontal>
            <text text="皮卡鱼深度:" w="80" h="*" gravity="center|right" textColor="red" />
            <input id="deep" text="{{deep}}" inputType="number" singleLine="true" textColor="white" w="80" h="*" />
        </horizontal>
        <Switch id="无障碍服务" text="无障碍服务" checked="{{auto.service != null}}" padding="8 8 8 8" textSize="15sp" textColor="white" />
        <Switch id="悬浮窗权限" text="悬浮窗权限" checked="{{floaty.checkPermission() != false}}" padding="8 8 8 8" textSize="15sp" textColor="white" />
        <button id="saveBtn" style="Widget.AppCompat.Button.Colored" text="保存" />
        <button id="startBtn" style="Widget.AppCompat.Button.Colored" text="开始" />
    </vertical>
);
//安卓版本高于Android 9
log("我的引擎" + engines.myEngine())
engines.all().forEach(item => {
    if (item.id != engines.myEngine().id) {
        log("停止引擎" + item)
        item.forceStop()
    }

})
ui.无障碍服务.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});
ui.悬浮窗权限.on("check", function (checked) {
    //申请悬浮窗
    importClass(android.content.Intent);
    importClass(android.net.Uri);
    importClass(android.provider.Settings);
    var intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:" + context.getPackageName()));
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    app.startActivity(intent);
});
// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.无障碍服务.checked = auto.service != null;
    ui.悬浮窗权限.checked = floaty.checkPermission() != false
});


ui.saveBtn.on("click", () => {
    chess_piece_width = parseInt(ui.chess_piece_width.text())
    threadCount = parseInt(ui.threadCount.text())
    deep = parseInt(ui.deep.text())
    storage.put("chess_piece_width", chess_piece_width)
    storage.put("threadCount", threadCount)
    storage.put("deep", deep)
    storage.put("hashSize", hashSize)
    storage.put("level", level)
    storage.put("freq", freq)
    storage.put("serverIp", serverIp)
    log("chess_piece_width " + chess_piece_width)
    log("threadCount " + threadCount)
    log("deep " + deep)
    log("hashSize " + hashSize)
    log("level " + level)
    log("freq " + freq)
    log("serverIp " + serverIp)

});

function excCmd(cmd) {
    try {
        // 发送 POST 请求上报数据
        var response = http.post('http://' + serverIp + ':5000/user/excCmd', {
            "cmd": cmd,
        });
        if (response.statusCode === 200) {
            let res = response.body.json()
            let move = res.data
            if (move != "0") {
                toastLog("设置失败！请检查引擎是否正常运行")
            } else {
                return true
            }
        } else {
            toastLog("设置失败！请检查引擎是否正常运行")
        }

    } catch (e) {
        toastLog("设置失败！请检查引擎是否正常运行")

    }
    return false

}
ui.startBtn.on("click", () => {
    if (floaty.checkPermission() == false) {
        toast("请先开启悬浮窗权限！")
        return;
    }
    //程序开始运行之前判断无障碍服务
    if (auto.service == null) {
        toast("请先开启无障碍服务！");
        return;
    }
    threads.start(function () {
        let status1 = excCmd("setoption name Threads value " + threadCount)
        if (!status1) return
        let status2 = excCmd("setoption name Hash value " + hashSize)
        if (!status2) return
        let status3 = excCmd("setoption name Skill Level value " + level)
        if (!status3) return
        engines.execScriptFile("tt.js");
    });

})
