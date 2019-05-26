var table;//桌面面板
var head;//顶部区域
var cardTypeEnum = {CARD_SITE: "card_site", CARD: "card"};//卡片类型-卡牌位、卡牌
var cardCacheX = [0, 120, 240, 360];//卡片暂存区横坐标
var cardCacheY = 20;//卡片暂存区纵坐标
var cardCache = [];//卡片暂存区域对象集合
var cardFinishX = [700, 820, 940, 1060];//卡牌收集取横坐标
var cardFinishY = 20;//卡牌收集区纵坐标
var cardFinish = [];//卡牌收集区域集合
var cardFlowerColor = ["a", "b", "c", "d"];//花色 a:方块 b:草花 c:红桃 d:黑桃
var cardCount = 13;//每个花色多少张牌
var card = [];//卡牌集合
var cardLine;//卡牌摆放区域集合
var cardWidth = 80;//卡片宽度（不可修改）
var movingCard = null;//移动中的卡牌
var movingFrom = null;//移动的卡牌来源

function isFinish() {
    for (var i = 0 ; i < cardFinish.length ; i ++) {
        if (cardFinish[i].num < cardCount) {
            return false;
        }
    }
    return true;
}

function autoReceive() {
    var flag = true;
    var numCount = 0;
    while(flag) {
        flag = false;
        for (var i = 0 ; i < cardLine.length ; i ++) {
            if (cardLine[i].lastCard && cardLine[i].lastCard.num - cardFinish[cardLine[i].lastCard.flowerValue].num == 1){
                flag = true;
                var card = cardLine[i].lastCard;
                cardLine[i].remove(card);
                console.log("花色:" + card.flowerValue + ", 数值:" + card.num);
                cardFinish[card.flowerValue].push(card, 0.1 * numCount);
                numCount += 1;
            }
        }
        for (var i = 0 ; i < cardCache.length ; i ++) {
            if (cardCache[i].card && cardCache[i].card.num - cardFinish[cardCache[i].card.flowerValue].num == 1){
                flag = true;
                var card = cardCache[i].card;
                cardCache[i].remove(card);
                console.log("花色:" + card.flowerValue + ", 数值:" + card.num);
                cardFinish[card.flowerValue].push(card, 0.1 * numCount);
                numCount += 1;
            }
        }
    }
    if (isFinish()) {
        setTimeout(function () {
            alert("恭喜获胜");
        }, numCount * 100 + 200);
    }
}

function createCard(cardTypeEnum, left, top) {
    var card = document.createElement("div");
    card.classList.add(cardTypeEnum);
    card.style.left = left + "px";
    card.style.top = top + "px";
    return card;
}

function moveCard(card, x, y, zIndex, delay, parent) {
    card.style.transition = "left 0.2s " + delay + "s, top 0.2s " + delay + "s";
    card.style.left = x + "px";
    card.style.top = y + "px";
    card.selfCount = zIndex;
    card.parent = parent;
    card.addEventListener("transitionend", function(){
        this.style.zIndex = this.selfCount;
        this.style.transition = null;
    });
}

function linkedToArr(card) {
    var result = [];
    var pointer = card;
    while(pointer){
        result.push(pointer);
        pointer = pointer.next;
    }
    return result;
}

function goBack() {
    var cardArr = linkedToArr(movingCard);
    for (var j = 0 ; j < cardArr.length ; j ++) {
        movingFrom.push(cardArr[j], 0.1);
    }
    movingCard = null;
    movingFrom = null;
}

function checkPutDownRule(cardLine) {
    if (cardLine.lastCard == null || (cardLine.lastCard.flowerValue + movingCard.flowerValue) % 2 == 1 && cardLine.lastCard.num - movingCard.num == 1) {
        return true;
    }
}

function checkPickUpRule(card) {
    var pointer = card;
    while(pointer.next) {
        if ((pointer.flowerValue + pointer.next.flowerValue) % 2 == 1 && pointer.num - pointer.next.num == 1) {
            pointer = pointer.next;
            continue;
        } else {
            return false;
        }
    }
    return true;
}

function sendCard() {
    for (var i = 0 ; i < card.length ; i ++) {
        cardLine[i % cardLine.length].push(card[i], 0.1 * i);
        card[i].onmousedown = function (e) {
            if (!checkPickUpRule(this)) {
                return;
            }
            movingCard = this;
            movingFrom = this.parent;
            this.parent.remove(this);
            e.stopPropagation();
        }
    }
    setTimeout(function () {
        autoReceive();
    }, 55 * 100);
}

function initCardArea() {
    cardLine = document.getElementsByClassName("card_line");
    for (var i = 0 ; i < cardLine.length ; i ++) {
        cardLine[i].count = 0;
        cardLine[i].index = i;
        cardLine[i].push = function (card, delay) {
            moveCard(card, this.getBoundingClientRect().left + cardWidth / 2, this.getBoundingClientRect().top + this.count * 25, this.count, delay, this)
            card.style.backgroundImage = "url(./pic/" + card.flowerColor + "_" + card.num.toString(16) + ".png)";
            card.next = null;
            this.count += 1;
            if (this.lastCard) {
                this.lastCard.next = card;
            } else {
                this.firstCard = card;
            }
            this.lastCard = card;
        };
        cardLine[i].remove = function(card) {
            var pointer = this.firstCard;
            if (pointer == card) {
                this.firstCard = null;
                this.lastCard = null;
            } else {
                while(pointer.next != card) {
                    pointer = pointer.next;
                }
                pointer.next = null;
                this.lastCard = pointer;
            }
            pointer = card;
            while(pointer) {
                this.count -= 1;
                pointer.count = 0;
                pointer.parent = null;
                pointer = pointer.next;
            }
            console.log("card:" + card.num + "已脱离cardLine:" + this.index + ",当前count:" + this.count);
        };
    }
}

function initCard() {
    for (var i = 0 ; i < cardFlowerColor.length ; i ++) {
        for (var j = 0 ; j < cardCount ; j ++) {
            var tempCard = createCard(cardTypeEnum.CARD, head.getBoundingClientRect().left + head.getBoundingClientRect().width / 2 - 40, 20);
            tempCard.flowerColor = cardFlowerColor[i];
            tempCard.flowerValue = i;
            tempCard.num = j + 1;
            card.push(tempCard);
            table.appendChild(tempCard);
        }
    }
    card.sort(function() {
        return Math.random() >=  0.5 ? 1 : -1;
    });
    for (var i = 0 ; i < card.length ; i ++) {
        card[i].style.zIndex = 100 - i;
    }
}

function initCardFinish() {
    for (var i = 0 ; i < cardFinishX.length ; i ++) {
        var tempCardFinish = createCard(cardTypeEnum.CARD_SITE, cardFinishX[i], cardFinishY);
        tempCardFinish.num = 0;
        tempCardFinish.push = function(card, delay) {
            moveCard(card, this.getBoundingClientRect().left, this.getBoundingClientRect().top, this.num, delay, this);
            this.num += 1;
        }
        head.appendChild(tempCardFinish);
        cardFinish.push(tempCardFinish);
    }
}

function initCardCache() {
    for (var i = 0 ; i < cardCacheX.length ; i ++) {
        var tempCardCache = createCard(cardTypeEnum.CARD_SITE, cardCacheX[i], cardCacheY);
        tempCardCache.push = function(card) {
            if (this.card) {
                goBack();
                return;
            }
            this.card = card;
            moveCard(card, this.getBoundingClientRect().left, this.getBoundingClientRect().top, 0, 0, this);
        }
        tempCardCache.remove = function() {
            this.card = null;
        }
        head.appendChild(tempCardCache);
        cardCache.push(tempCardCache);
    }
}

function begin(dom) {
    sendCard();
    dom.remove();

    document.onmouseup = function(e) {
        if (movingCard == null) {
            return;
        }
        for (var i = 0 ; i < cardLine.length ; i ++) {
            if (e.clientX > cardLine[i].getBoundingClientRect().left && e.clientX < cardLine[i].getBoundingClientRect().width + cardLine[i].getBoundingClientRect().left && e.clientY > cardLine[i].getBoundingClientRect().top) {
                if (!checkPutDownRule(cardLine[i])) {
                    goBack();
                }
                console.log("放入cardLine:" + i + ", count:" + cardLine[i].count);
                var cardArr = linkedToArr(movingCard);
                for (var j = 0 ; j < cardArr.length ; j ++) {
                    cardLine[i].push(cardArr[j], 0.1);
                }
                movingCard = null;
                autoReceive();
                return;
            }
        }
        for (var i = 0 ; i < cardCache.length ; i ++) {
            if (e.clientX > cardCache[i].getBoundingClientRect().left && e.clientX < cardCache[i].getBoundingClientRect().left + cardCache[i].getBoundingClientRect().width && e.clientY > cardCache[i].getBoundingClientRect().top && e.clientY < cardCache[i].getBoundingClientRect().top + cardCache[i].getBoundingClientRect().height) {
                if (movingCard.next) {
                    goBack();
                    return;
                }
                cardCache[i].push(movingCard);
                movingCard = null;
                movingFrom = null;
                autoReceive();
                return;
            }
        }
        goBack();
        return;
    }
    document.onmousemove = function (e) {
        if (movingCard != null) {
            var pointer = movingCard;
            var num = 0;
            while(pointer) {
                pointer.style.left = (e.clientX - 20) + "px";
                pointer.style.top = (e.clientY + num * 25 - 20) + "px";
                pointer.style.zIndex = 100 + num;
                pointer = pointer.next;
                num += 1;
            }
        }
    }
}

function init() {
    table = document.getElementById("table");
    head = document.getElementById("head");
    initCardCache();
    initCardFinish();
    initCard();
    initCardArea();


}

window.onload = function () {
    init();
}