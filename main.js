auto()
//安卓版本高于Android 9
if (device.sdkInt > 28) {
    //等待截屏权限申请并同意
    threads.start(function () {
        packageName('com.android.systemui').text('立即开始').waitFor()
        text('立即开始').click()
    });
}
//申请截屏权限
if (!requestScreenCapture()) {
    toast("请求截图失败")
    exit()
}
http.__okhttp__.setTimeout(40 * 1000)//低版本需要加这个
// 创建空的棋盘
// 创建空的棋盘
function createEmptyChessboard() {
    var temp = [];
    // 创建一个大小为 10x9 的二维数组，并用空字符串初始化
    for (var i = 0; i < 10; i++) {
        temp[i] = Array(9).fill("O");
    }

    return temp;
}


// 打印二维数组
function printChessboard(chessboard) {
    for (var i = 0; i < chessboard.length; i++) {
        var row = chessboard[i].join(" ");
        log(row);
    }
}


//复制一份新的数组
function copyArray(array) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        var innerArray = array[i];
        var newInnerArray = innerArray.slice(); // 复制内部数组
        newArray.push(newInnerArray);
    }

    return newArray;
}

//将[row,col] 转成字母
function coordinatesToAlgebraic(coordinates) {
    var row = coordinates[0]
    var col = coordinates[1]
    if (isRed) {
        row = 9 - row;
        col = col + 'a'.charCodeAt(0);
        return String.fromCharCode(col) + row.toString();
    } else {
        col = 8 - col + 'a'.charCodeAt(0);
        return String.fromCharCode(col) + row.toString();
    }


}


//将字母转成 [row,col]
function algebraicToCoordinates(algebraic) {
    var col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
    var row = 9 - parseInt(algebraic.substring(1));
    if (isRed) {
        //b9 c7 (0,1) (2,2)
        return [row, col];
    } else {
        //b9 c7  (9,7) (7,6)
        row = 9 - row
        col = 8 - col
        return [row, col];
    }
}


//二维数组旋转180度
function rotateArray180(array) {
    var rotated = [];
    for (var i = array.length - 1; i >= 0; i--) {
        var row = array[i];
        var rotatedRow = row.slice().reverse();
        rotated.push(rotatedRow);
    }
    return rotated;
}

//大小写翻转
function transformString(str) {
    let transformedString = "";

    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char === char.toUpperCase()) {
            transformedString += char.toLowerCase();
        } else {
            transformedString += char.toUpperCase();
        }
    }

    return transformedString;
}



//释放图片资源
function releaseSouce() {
    // if (img != null) {
    //     img.recycle()
    //     img = null
    // }
    if (board_img != null) {
        board_img.recycle()
        img = null
    }
}


//通过row col去点击相应的坐标
function clickChess(row, col) {
    var clickStartX = (2 * col + 1) * chess_piece_radius + boardLeft;
    var clickStartY = (2 * row + 1) * chess_piece_radius + boardTop;
    //log("点击位置clickStartX " + clickStartX + " clickStartY " + clickStartY)
    click(clickStartX, clickStartY);
}




//所有的操作都用这个控制
//初始的象棋布局
var defaultChessBoard = [
    ['r', 'n', 'b', 'a', 'k', 'a', 'b', 'n', 'r'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'c', 'O', 'O', 'O', 'O', 'O', 'c', 'O'],
    ['p', 'O', 'p', 'O', 'p', 'O', 'p', 'O', 'p'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['P', 'O', 'P', 'O', 'P', 'O', 'P', 'O', 'P'],
    ['O', 'C', 'O', 'O', 'O', 'O', 'O', 'C', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['R', 'N', 'B', 'A', 'K', 'A', 'B', 'N', 'R']
]

//初始化圆的位置
var defaultCircleBoard = [
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'B', 'O', 'O', 'O', 'O', 'O', 'B', 'O'],
    ['B', 'O', 'B', 'O', 'B', 'O', 'B', 'O', 'B'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['R', 'O', 'R', 'O', 'R', 'O', 'R', 'O', 'R'],
    ['O', 'R', 'O', 'O', 'O', 'O', 'O', 'R', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']
]

var defaultBlackCircleBoard = [
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'R', 'O', 'O', 'O', 'O', 'O', 'R', 'O'],
    ['R', 'O', 'R', 'O', 'R', 'O', 'R', 'O', 'R'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['B', 'O', 'B', 'O', 'B', 'O', 'B', 'O', 'B'],
    ['O', 'B', 'O', 'O', 'O', 'O', 'O', 'B', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B']
]

var isRed = null
var isSart = true
var isMyStep = false //标志是否我方下棋
var stepCount = 0 //累计步数
var fen = ""
var img = null //每次的截图
var board_img = null //裁剪出来的棋盘
var storage = storages.create("chessStorage");
var boardWidth = 1010 //棋 盘宽度
var boardHeight = 1140  //棋盘高度
var boardTop = 626 //棋盘上边距
var boardLeft = 34 //棋盘左边距
var speekOn = false //棋盘左边距
var chess_piece_radius = 0 //棋子半径
var chess_piece_width = 0 //棋子宽度
var moves = [] //当前移动的fen码
var chessBoard = null
var circleBoard = []
var intervalId = 0
var 开始 = images.read("开始.png")
var 关闭 = images.read("关闭.png")
var 确定 = images.read("确定.png")
var 叉叉 = images.read("叉叉.jpg")
var 对战助手 = images.read("对战助手.jpg")
var 确定退出 = images.read("确定退出.jpg")

//删除截图
var imgDir = "img";
files.removeDir(imgDir)
files.create(imgDir + "/")

function main() {
    initStart()
    isSart = true
    log('开始新的对局')
    while (isSart) {
        try {
            sleep(2000)
            findChess()
        } catch (e) {
            log("发生异常" + e)
        }
        //isSart = false
    }

}

function initStart() {
    chessBoard = copyArray(defaultChessBoard)
    circleBoard = copyArray(defaultCircleBoard)
    isRed = null
    isSart = true
    isMyStep = false //标志是否我方下棋
    stepCount = 0 //累计步数
    fen = ""
    moves = []
    lastMove = ""
    if (intervalId != 0) {
        clearInterval(intervalId)
        intervalId = 0
    }
}


function findChess() {
    img = images.captureScreen()
    if (!img) {
        toastLog('截图失败')
        return
    }
    var pos4 = images.findImage(img, 对战助手)
    if (pos4) {
        speek("发现对战助手按钮")
        click(pos4.x, pos4.y)
        //重新初始化
        initStart()
        return
    }
    //log("开始findChess")
    var pos = images.findImage(img, 关闭)
    if (pos) {
        speek("发现关闭对局结束")
        click(pos.x, pos.y)
        sleep(1000)
        click(device.width / 2, device.height / 2)
        //重新初始化
        initStart()
        return
    }

    var pos1 = images.findImage(img, 开始)
    if (pos1) {
        speek("发现开始按钮")
        click(pos1.x, pos1.y)
        //重新初始化
        initStart()
        return
    }

    var pos2 = images.findImage(img, 确定)
    if (pos2) {
        speek("发现确定按钮")
        click(pos2.x, pos2.y)
        //重新初始化
        initStart()
        return
    }

    var pos3 = images.findImage(img, 叉叉)
    if (pos3) {
        speek("发现叉叉按钮")
        click(pos3.x, pos3.y)
        //重新初始化
        initStart()
        return
    }

    chess_piece_width = boardWidth / 9
    chess_piece_radius = chess_piece_width / 2
    board_img = images.clip(img, boardLeft, boardTop, boardWidth, boardHeight)

    if (isRed == null) {
        var col = 4
        var row = 0
        var centerX = (2 * col + 1) * chess_piece_radius;
        var centerY = (2 * row + 1) * chess_piece_radius;
        var left = centerX - chess_piece_radius
        var top = centerY - chess_piece_radius
        let cutImg = images.clip(board_img, left, top, chess_piece_radius * 2, chess_piece_radius * 2)

        let containRed = images.findColor(cutImg, "#953c28", {
            threshold: 4
        })
        let containBlack = images.findColor(cutImg, "#3a3938", {
            threshold: 4
        })

        if (containRed) {
            circleBoard = null
            circleBoard = copyArray(defaultBlackCircleBoard)
            isRed = false
        } else if (containBlack) {
            circleBoard = null
            circleBoard = copyArray(defaultCircleBoard)
            isRed = true
        } else {
            log("没找到帅啥也没有")
        }
        speek("我方为" + (isRed ? "红方" : "黑方"))


    }

    var tempchessboard = createEmptyChessboard()
    var count = 0;
    // 找圆
    min_radius = chess_piece_width / 4
    max_radius = chess_piece_width / 3
    // 灰度化图片
    let gray = images.grayscale(board_img);
    // 找圆
    let arr = images.findCircles(gray, {
        dp: 1,
        minDst: 30,
        param1: 50,
        param2: 30,
        minRadius: parseInt(min_radius),
        maxRadius: parseInt(max_radius),
    });
    gray.recycle()
    for (let i = 0; i < arr.length; i++) {
        let circle = arr[i];
        let x = circle.x; // 圆心 x 坐标
        let y = circle.y; // 圆心 y 坐标
        let radius = circle.radius; // 圆的半径
        // 裁剪图像
        let row = parseInt(y / chess_piece_width)
        let col = parseInt(x / chess_piece_width)
        var left = x - radius;
        var top = y - radius;
        let cutImg = images.clip(board_img, left, top, radius * 2, radius * 2)
        let containRed = images.findColor(cutImg, "#953c28", {
            threshold: 4
        })
        let containBlack = images.findColor(cutImg, "#3a3938", {
            threshold: 4
        })
        if (containRed) {
            count++
            tempchessboard[row][col] = "R"
        } else if (containBlack) {
            count++
            tempchessboard[row][col] = "B"
        } else {
            tempchessboard[row][col] = "O"
        }
        cutImg.recycle()

    }

    //log('总共找到圆' + count)
    if (stepCount == 0 && count != 32) {
        log(arr.length + '数量不够' + count)
        initStart()
        printChessboard(tempchessboard)
        releaseSouce()
        return
    }

    if (stepCount < 999) {
        var pao1start = tempchessboard[7][1]
        var pao1Mid = tempchessboard[2][1]
        var pao1end = tempchessboard[0][1]

        var pao2start = tempchessboard[7][7]
        var pao2Mid = tempchessboard[2][7]
        var pao2end = tempchessboard[0][7]
        if (pao1start != "O" && pao1end != "O" && pao1Mid != "O") {
            speek("发现炮1")
            clickChess(7, 1)
            sleep(50)
            clickChess(0, 1)
            speek("你马没了")
            sleep(2000)
            stepCount++
            return
        }
        if (pao2start != "O" && pao2end != "O" && pao2Mid != "O") {
            speek("发现炮2")
            clickChess(7, 7)
            sleep(50)
            clickChess(0, 7)
            speek("你马没了")
            sleep(2000)
            stepCount++
            return
        }
        return
    }
}

function speek(str) {
    if (true) {
        TTS.speak(str, TextToSpeech.QUEUE_ADD, null);//自定义语音合成内容
    } else {
        log(str)
    }

}

//调用系统语音合成
importPackage(android.speech.tts);
importClass(java.util.Locale);
if (TTS != undefined) { TTS.stop(); TTS.shutdown(); }
var TTS = new TextToSpeech(context, function (status) {
    if (status != TextToSpeech.SUCCESS) {
        toast("初始化TTS失败");
    }
    var r = TTS.setLanguage(Locale.CHINA);
    if (r < 0) {
        toast("不支持该语言: " + r);
        exit();
    }
    log("TTS初始化成功");
});
sleep(500);
speek("开始辅助")
// 创建悬浮窗
var window = floaty.window(
    <vertical>
        <text text="在棋力评测或者积分场快速按钮界面点击开始运行，需要辅助功能模拟点击" textColor="red" w="auto" ></text>
        <button id="toggleButton" text="展开" w="auto" h="auto" />
        <vertical id="menu" visibility="gone">
            <button id="startButton" text="开始" w="auto" h="auto" />
            <button id="stopButton" text="结束" w="auto" h="auto" />
        </vertical>
    </vertical>
);
var isOpen = false
// 设置悬浮窗位置
window.setPosition(0, device.height / 20);

log("我的引擎" + engines.myEngine())
engines.all().forEach(item => {
    if (item.id != engines.myEngine().id) {
        log("停止引擎" + item)
        item.forceStop()
    }

})
function hideMenu() {
    isOpen = false
    window.menu.setVisibility(8);
    window.toggleButton.setText("展开");
}
function expandOrHideMenu() {
    isOpen = !isOpen
    if (isOpen) {
        window.menu.setVisibility(0);
        window.toggleButton.setText("收起");
    } else {
        window.menu.setVisibility(8);
        window.toggleButton.setText("展开");
    }
}
// 切换按钮点击事件
window.toggleButton.click(() => {
    expandOrHideMenu()

});

// 开始按钮点击事件
window.startButton.click(() => {
    hideMenu()
    threads.start(function () {
        isSart = false
        speek("开始")
        main()
    });

});

// 结束按钮点击事件
window.stopButton.click(() => {
    isSart = false
    threads.shutDownAll()
    toastLog("已停止");
    hideMenu()
});

//保持脚本运行
setInterval(() => { }, 1000);

