//安卓版本高于Android 9
log("我的引擎" + engines.myEngine())
engines.all().forEach(item => {
    if (item.id != engines.myEngine().id) {
        log("停止引擎" + item)
        item.forceStop()
    }

})
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


var chessWindow = floaty.rawWindow(
    <linear padding="20">
        <grid id="chessGrid" spanCount="9" h="200" w="*" weight="1">
            <card w="15" h="15" cardCornerRadius="7" gravity="center">
                <text text="{{this.name}}" color="{{this.color}}" textSize="10" w="15" h="15" gravity="center"></text>
            </card>

        </grid>
        <text padding="20" id="bestMove" text="最佳:" textColor="green" textSize="16" weight="1"></text>
    </linear>

);
function readChessPieces() {
    var dirPath = files.cwd() + "/qqxq";
    var fileList = files.listDir(dirPath);

    var imageMap = new Map();

    for (var i = 0; i < fileList.length; i++) {
        var fileName = fileList[i];
        if (fileName.endsWith(".png")) {
            var filePath = dirPath + "/" + fileName;
            var image = images.read(filePath);
            if (image) {
                imageMap.set(fileName.charAt(1), image);
            } else {
                console.log("无法读取图片：" + filePath);
            }
        }
    }

    return imageMap;
}

function compareImageWithChessPieces(image) {
    for (var [key, chessImage] of chessPiecesMap) {
        var result = images.matchTemplate(image, chessImage, {
            threshold: 0.9
        });
        if (result.matches.length > 0) {
            let isBlack = calculateColorRatio("#3C3C3A", image, 0.9)
            if (isBlack) {
                return key.toLowerCase()
            }
            return key.toUpperCase()
        }
    }

    return "O"

}

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


function checkLetterCase(letter) {
    if (/^[A-Z]$/.test(letter)) {
        return 'R';
    } else if (/^[a-z]$/.test(letter)) {
        return 'B';
    } else {
        return '0';
    }
}

// 打印二维数组
function printChessboard(chessboard) {
    for (var i = 0; i < chessboard.length; i++) {
        var row = chessboard[i].join(" ");
        log(row);
    }
}


function calculateColorRatio(color, image, similarity) {
    var allPos = images.findAllPointsForColor(image, color, {
        similarity: similarity
    })
    //log("找到点位"+allPos.length)
    if (allPos && allPos.length > 200) {
        //log("allPos.length"+allPos.length)
        return true
    }
    return false;
}

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
var map = {
    "r": "车", "n": "马", "b": "象", "a": "士", "k": "将", "c": "炮", "p": "卒",
    "R": "车", "N": "马", "B": "相", "A": "仕", "K": "帅", "C": "炮", "P": "兵", "O": "●"
}
var chessPiecesMap = readChessPieces();
var storage = storages.create("chessStorage");
var chess_piece_width = storage.get("chess_piece_width", 115) //棋子宽度
var threadCount = storage.get("threadCount", 6)  //皮卡鱼线程数
var deep = storage.get("deep", 20) //深度
var freq = storage.get("freq", 1000) //freq
var serverIp = storage.get("serverIp", "127.0.0.1")  //服务器IP
var chess_piece_radius = chess_piece_width / 2 //棋子半径
var count = 0
var fen = ""
isRed = null
var lastFen = ""
//计算出(0,0) 点坐标
var startX = device.width / 2 - 4 * chess_piece_width //起始坐标  
var startY = device.height / 2 - 4.5 * chess_piece_width //起始Y坐标
var lastBoard = []
function convertToFEN() {
    var fen = "";
    board = circleBoard

    // 转换棋盘状态
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        var emptyCount = 0;

        for (var j = 0; j < row.length; j++) {
            var piece = row[j];

            if (piece === "O") {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }

                fen += piece;
            }
        }

        if (emptyCount > 0) {
            fen += emptyCount;
        }

        if (i < board.length - 1) {
            fen += "/";
        }
    }
    var key = "w"
    // 添加额外信息
    fen += " " + key // 添加轮到下棋的一方（w代表红方，b代表黑方）
    //fen += "- - 0 "+setpCount+" "
    //fen += " "; // 添加步数
    fen += ' - - 0 1';

    // if (moves.length > 0) {
    //     fen += " moves " + moves.join(" "); // 添加本次移动
    // }


    return fen;
}

//将字母转成 [row,col]
function algebraicToCoordinates(algebraic) {
    var col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
    var row = 9 - parseInt(algebraic.substring(1));
    return [row, col];
}

function convertChessBoard(chessBoard) {
    var convertedBoard = [];

    for (var i = 0; i < chessBoard.length; i++) {
        var row = chessBoard[i];
        var convertedRow = [];

        for (var j = 0; j < row.length; j++) {
            var piece = row[j];
            if (piece === 'O') {
                convertedRow.push(piece);
            } else if (/[A-Z]/.test(piece)) {
                convertedRow.push(piece.toLowerCase());
            } else if (/[a-z]/.test(piece)) {
                convertedRow.push(piece.toUpperCase());
            }
        }

        convertedBoard.push(convertedRow);
    }

    return convertedBoard;
}
const redColNames = '九八七六五四三二一';
const blackColNames = '１２３４５６７８９';

const redDigits = '零一二三四五六七八九';
const blackDigits = '０１２３４５６７８９';
//
const noPiece = ' ';
//
const redRook = 'R';
const redKnight = 'N';
const redBishop = 'B';
const redAdvisor = 'A';
const redKing = 'K';
const redCanon = 'C';
const redPawn = 'P';
//
const blackRook = 'r';
const blackKnight = 'n';
const blackBishop = 'b';
const blackAdvisor = 'a';
const blackKing = 'k';
const blackCanon = 'c';
const blackPawn = 'p';
//找到同一列相同的棋子
function findPieceSameCol(row, col, piece) {
    let sameChess = []
    for (var i = 0; i < circleBoard.length; i++) {
        var rows = circleBoard[i];
        for (var j = 0; j < rows.length; j++) {
            let chess = circleBoard[i][j]
            if (col == j && chess == piece && row !== i) {
                sameChess.push({ "chess": chess, "row": i })
            }
        }
    }
    return sameChess

}

function nameOf(pos, sideIndex) {
    let colNames = [redColNames, blackColNames];
    let digits = [redDigits, blackDigits];
    let row = pos[0]
    let col = pos[1]
    let piece = circleBoard[row][col]
    let pieceColor = checkLetterCase(piece)
    let pieceName = map[piece];
    // 士相由于行动行动路径有限，不会出现同一列两个士相都可以进或退的情况
    // 所以一般不说「前士、前相」之类的，根据「进、退」动作即可判断是前一个还是后一个
    if (piece == redAdvisor ||
        piece == redBishop ||
        piece == blackAdvisor ||
        piece == blackBishop) {
        //
        return pieceName + colNames[sideIndex][col];
    }
    // 此 Map 的 Key 为「列」， Value 为此列上出现所查寻棋子的 y 坐标（row）列表
    // 返回结果中进行了过滤，如果某一列包含所查寻棋子的数量 < 2，此列不包含在返回结果中
    let samePieces = findPieceSameCol(col, piece);
    // 正在动棋的这一列不包含多个同类棋子
    if (samePieces.length == 0) {
        return pieceName + colNames[sideIndex][col];
    }

    if (samePieces.length == 1) {
        let chessRow = samePieces[0].row
        let tip = ""
        if (chessRow < row) {
            if (pieceColor == "R") {
                tip = "后" + pieceName
            } else {
                tip = "前" + pieceName
            }
        }
    }

    if (samePieces.length == 2) {
        let chessRow1 = samePieces[0].row
        let chessRow2 = samePieces[1].row
        let tip = ""
        if (pieceColor == "R") {
            if (row > chessRow1 && row < chessRow2) {
                tip = "中" + pieceName
            } else if (row < chessRow1) {
                tip = "前" + pieceName
            } else {
                tip = "后" + pieceName
            }

        } else {
            if (row > chessRow1 && row < chessRow2) {
                tip = "中" + pieceName
            } else if (row < chessRow1) {
                tip = "后" + pieceName
            } else {
                tip = "前" + pieceName
            }

        }
        return tip

    }

    return "****"
}

function parseToText(move) {
    if (move == 'nobestmove' || move.length != 4) {
        return "没有最佳下法"
    }
    let colNames = [redColNames, blackColNames];
    let digits = [redDigits, blackDigits];
    //b9c7
    log("获取的move" + move)
    var startAlgebraic = move.substring(0, 2);
    var targetAlgebraic = move.substring(2, 4);
    startPos = algebraicToCoordinates(startAlgebraic)
    endPos = algebraicToCoordinates(targetAlgebraic)
    let startRow = startPos[0]
    let startCol = startPos[1]
    let endRow = endPos[0]
    let endCol = endPos[1]
    log("获取的startPos" + startPos)
    log("获取的endPos" + endPos)
    let piece = circleBoard[startPos[0]][startPos[1]]
    let pieceColor = checkLetterCase(piece)
    let sideIndex = (pieceColor == "R") ? 0 : 1;
    let pieceName = nameOf(startPos, sideIndex);
    var result = pieceName;
    //log("pieceName" + pieceName)
    if (isRed && piece == "B") {
        return ""
    }

    if (!isRed && piece == "R") {
        return ""
    }

    if (startRow == endRow) {
        //
        result += '平' + colNames[sideIndex][endCol];
        //
    } else {
        //
        let direction = (pieceColor == "R") ? -1 : 1;
        let dir = ((endRow - startRow) * direction > 0) ? '进' : '退';

        let specialPieces = [
            redKnight,
            blackKnight,
            redBishop,
            blackBishop,
            redAdvisor,
            blackAdvisor,
        ];

        let targetPos;
        let include = specialPieces.includes(piece)
        //log("index"+index+"piece"+piece)
        if (include) {
            targetPos = colNames[sideIndex][endCol];
        } else {
            targetPos = digits[sideIndex][Math.abs(endRow - startRow)];
        }

        result += dir + targetPos;
    }
    log(result)
    return result;

}


//比较数组是否相等
function checkMatricesEqual(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        return [];
    }
    var different = []
    var startPos = [];
    var endPos = [];
    var differences = [];
    for (var i = 0; i < matrix1.length; i++) {
        for (var j = 0; j < matrix1[i].length; j++) {
            if (matrix1[i][j] !== matrix2[i][j]) {
                if (matrix2[i][j] == "O") {
                    startPos = [i, j]
                } else {
                    endPos = [i, j]
                }
                different.push([i, j])
            }
        }
    }
    if (startPos.length > 0 && endPos.length > 0) {
        differences.push(startPos)
        differences.push(endPos)
    }
    log("实际的差别" + different)
    log("简化的差别" + differences)

    if (different.length > 2) {
        log("凉凉差别大于2")
        return [];
    }

    return differences;
}

function copyArray(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        var innerArray = array[i];
        var newInnerArray = innerArray.slice(); // 复制内部数组
        newArray.push(newInnerArray);
    }

    return newArray;
}

function queryBestMove(fen, deep) {
    try {
        // 发送 POST 请求上报数据
        var response = http.post('http://' + serverIp + ':5000/user/getBestMove', {
            "fen": fen,
            "speed": deep,
            "isFirst": false
        });
        if (response.statusCode === 200) {
            let res = response.body.json()
            let move = res.data
            return parseToText(move)
        } else {
            console.log("下载失败1:", response.body.string());
            throw new Error("对局结束下载失败1")
        }

    } catch (e) {
        console.log("下载失败2:", e);
    }

}
var isFirst = true
//遍历点位
while (true) {
    circleBoard = createEmptyChessboard()
    img = images.captureScreen()
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            var x = col * chess_piece_width + startX;
            var y = row * chess_piece_width + startY;
            var left = x - chess_piece_radius;
            var top = y - chess_piece_radius;
            let cutChessImg = images.clip(img, left, top, chess_piece_width, chess_piece_width)
            let key = compareImageWithChessPieces(cutChessImg)
            let color = checkLetterCase(key)
            if (key != "O") {
                count++
            }
            circleBoard[row][col] = key
            cutChessImg.recycle()
        }
    }
    //printChessboard(circleBoard)


    var items = []
    for (var i = 0; i < circleBoard.length; i++) {
        for (var j = 0; j < circleBoard[i].length; j++) {
            let key = circleBoard[i][j]
            let color;
            if (key == "O") {
                color = "#00000000"
            } else {
                color = key === key.toUpperCase() ? "red" : "black"
            }
            let item = { 'name': map[key], "color": color }
            if (key == "k") {
                isRed = i < 3
                log("我方为" + (isRed ? "红方" : "黑方"))
            }
            //log("item" + item.name)
            items.push(item)
        }
    }

    if (!isRed) {
        circleBoard = convertChessBoard(circleBoard);
    }
    fen = convertToFEN()
    log(fen)
    ui.run(function () {
        chessWindow.setTouchable(false);
        chessWindow.chessGrid.setDataSource(items);
    });
    var move = queryBestMove(fen, 5)
    lastFen = fen
    if (move !== "") {
        ui.run(function () {
            chessWindow.bestMove.setText("最佳:" + move)
        })
    }
    //频率
    sleep(freq)
}





