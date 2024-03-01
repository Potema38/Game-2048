var gameObj = {
    points: {
        score: 0,
        history: [],
        status: 1
    },//// Score 
    stage: [], //// Матрица с ячейками
    intiStage: function () { /////////  задаём матрицу, где ячейки - объекты со свойствами: позиция и число(цифра)
        for (var cell = 0; cell < 4; cell++) {
            this.stage[cell] = [];
            for (var row = 0; row < 4; row++) {
                this.stage[cell][row] = {
                    boxObj: null,
                    position: [cell, row]
                };
            }
        }
    },
    
        empty: function () {//// свойство - функция, которая создаёт массив из количества пустых элементов матрицы
        var emptyList = [];
        for (var row = 0; row < 4; row++) {
            for (var cell = 0; cell < 4; cell++) {
                if (this.stage[cell][row].boxObj == null) {
                    emptyList.push(this.stage[cell][row]);
                }
            }
        }
        return emptyList;////// возвращает массив из  пустых элементов матрицы 
    },
		whole: function () {
        var wholeList = [];
        for (var row = 0; row < 4; row++) {
            for (var cell = 0; cell < 4; cell++) {
                if (this.stage[cell][row].boxObj != null) {
                    wholeList.push(this.stage[cell][row]);
                }
            }
        }
        return wholeList;//// возвращает все не пустые элементы 

    },
	

    newBox: function () {///////// заполняет пустую ячейку
       // var _this = this;
        var box = function (obj) {
            var num = Math.random() > 0.9 ? 4 : 2;	
            this.value = num;
            this.parent = obj; ///////////// родитель boxObj
            this.domObj = function () {
                var domBox = document.createElement('span');
                domBox.innerText = num;	
                domBox.textContent = num;			//row                           //cell
                domBox.className = 'row' + obj.position[0] + ' ' + 'cell' + obj.position[1] + ' ' + 'num' + num;
                var root = document.getElementById('stage');// добавляем новый box на поле
                root.appendChild(domBox);
                return  domBox;
            }();
            obj.boxObj = this; // obj.boxObj  obj.boxObj.value       <- this.value 
        }
        var emptyList = this.empty();
        if (emptyList.length){
            var randomIndex = Math.floor(Math.random() * emptyList.length);
            new box(emptyList[randomIndex]);////// возращает в качестве аргумента в функцию box ячейку, которая пустая, на рандомное место
            return true;
        }
    },
    isEnd:function(){///// Просматриваем матрицу на наличие 2х одинаковых значений рядом
        var emptyList = this.empty();
        if (!emptyList.length) {
            for(var i=0;i<4;i++){
                for(var j=0;j<4;j++){
                    var obj=this.stage[i][j];
                    var objLeft=(j==0)?{boxObj:{value:0}}:this.stage[i][j-1];
					console.log(objLeft)
                    var objRight=(j==3)?{boxObj:{value:0}}:this.stage[i][j+1];
					console.log(objRight)
                    var objUp=(i==0)?{boxObj:{value:0}}:this.stage[i-1][j];
					console.log(objUp)
                    var objDown=(i==3)?{boxObj:{value:0}}:this.stage[i+1][j];
					console.log(objDown)
                    if(obj.boxObj.value==objLeft.boxObj.value
                        ||obj.boxObj.value==objDown.boxObj.value
                        ||obj.boxObj.value==objRight.boxObj.value
                        ||obj.boxObj.value==objUp.boxObj.value){
                        return false
                    }
                }
            }
            return true;
        }
        return false;
    },
	
    isWin:function(){
        var wholeList = this.whole();
        if (wholeList.length) {
            for(var i=0;i< wholeList.length;i++){
            if(wholeList[i].boxObj.value == 2048){ //// button.value = 1024 ( for example)
                return true
            };
            }
        }
    },
    gameOver:function(){
        alert('GAME OVER!');
		window.location.reload();
    },
	gameWin:function(){
        alert('YOU WIN!');
		window.location.reload();
    },
	///////////////// (objInThisWay,fstEmpty)
    moveTo :function (obj1, obj2) {
            obj2.boxObj = obj1.boxObj;
            obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
            obj1.boxObj = null;
        },         // крайний складывается с другим
    addTo : function (obj1, obj2) {
            obj2.boxObj.domObj.parentNode.removeChild(obj2.boxObj.domObj);
            obj2.boxObj = obj1.boxObj;
            obj1.boxObj = null;
            obj2.boxObj.value = obj2.boxObj.value * 2;
            obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
            obj2.boxObj.domObj.innerText = obj2.boxObj.value;
            obj2.boxObj.domObj.textContent = obj2.boxObj.value;
            this.points.score+=obj2.boxObj.value;
        var scoreBar= document.getElementById('score');
        scoreBar.innerText=this.points.score;
        scoreBar.textContent=this.points.score;
        return obj2.boxObj.value;
    },
    clear:function(x,y){
        var can=0;
      for(var i=0;i<4;i++){
          var fstEmpty=null;
          for(var j=0;j<4;j++){
              var objInThisWay=null;
              switch (""+x+y){
                  case '10': objInThisWay=this.stage[i][j];break; //Влево
                  case '11':objInThisWay=this.stage[j][i];break; // Вверх
                  case '00':objInThisWay=this.stage[3-j][i];break; // Вниз
                  case '01':objInThisWay=this.stage[i][3-j];break; // Вправо
              }
              if(objInThisWay.boxObj!=null){
                 if(fstEmpty){
                   this.moveTo(objInThisWay,fstEmpty)
                    fstEmpty=null;
                    j=0;
                     can=1;
                 }
              }else if(!fstEmpty){
                   fstEmpty=objInThisWay;
              }
          }
      }
        return can;
    },
    
    move: function (x,y) {
        var can=0;
        can=this.clear(x,y)?1:0;
        var add=0;
        for(var i=0;i<4;i++){
            for(var j=0;j<3;j++){
                var objInThisWay=null;
                var objInThisWay2=null;
                switch (""+x+y){
                    case '10':{ // Влево
                        objInThisWay=this.stage[i][j];// то , что сложилось
                        objInThisWay2=this.stage[i][j+1];break;
                    }
                    case '11':{ // Вверх
                        objInThisWay=this.stage[j][i];// то , что сложилось
                        objInThisWay2=this.stage[j+1][i];break;
                    }

                    case '00':{ // Вниз
                        objInThisWay=this.stage[3-j][i];// то , что сложилось
                        objInThisWay2=this.stage[2-j][i];break;
                    }
                    case '01':{ // Вправо
                        objInThisWay=this.stage[i][3-j];// то , что сложилось
                        objInThisWay2=this.stage[i][2-j];break;
                    }
                } 
                if(objInThisWay2.boxObj&&objInThisWay.boxObj.value==objInThisWay2.boxObj.value){
                  add+=this.addTo(objInThisWay2,objInThisWay);
                    this.clear(x,y);
//                    j++;
                    can=1;
				 //console.log(objInThisWay2.boxObj.value);
                }
//                console.log(this.stage);
            }
        }
        if(add){
            var addscore=document.getElementById('addScore');
            addscore.innerText="+"+add;
            addscore.textContent="+"+add;
            addscore.className="show";
            setTimeout(function(){
                addscore.className="hide";
            },500);
        }
        if(can){
            this.newBox();
        }
        if(this.isEnd()){
            this.gameOver();
        }
		if(this.isWin()){
            this.gameWin();
        }
    },

    inti: null
}
///// три кнопки в html, задаются на javascript'e 3 разные функции идентефицируют на какую конпку нажали, и надо менять значение в gameWin, в зависимости от той кнопки(функции), которую нажали(запустили);
window.onload = function () {
    gameObj.intiStage();
    gameObj.newBox();
    function keyUp(e) {
        var currKey=0;
        currKey=e.keyCode;
        var keyName = String.fromCharCode(currKey);
        switch (currKey){
            case 37:gameObj.move(1, 0);break;// Влево
            case 38:gameObj.move(1, 1);break;// Вверх
            case 39:gameObj.move(0, 1);break;// Вправо
            case 40:gameObj.move(0, 0);break;// Вниз
        }
//        alert("key code: " + currKey + " Character: " + keyName);
    }
    onkeyup = keyUp;
}