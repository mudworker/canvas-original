var img = new Image();
img.src = "image/bg6.jpg";
var theCanvas;  //��ǰ����
var context;    //������
var pass = 1; //����ǰ�ؿ���
var myarray = [];   //������ʱ��¼Ŀǰ�ؿ��������Ϣ
var row = 10;    //ÿ�����ɷ���10����
var cwidth = 500;  //�����Ŀ��
var cheight = 600;  //�����ĸ߶�
var srad = cwidth/(2*row); //ÿ��С��İ뾶
var colors = ['red','yellow','green','blue','purple']; //���ڴ�����ɫ��
var misslex = cwidth/2-srad;       //����ͼƬ��xλ��
var missley = cheight-82;          //����ͼƬ��yλ��
var height = Math.sqrt(3);       //����3�ı���ϵ��
var nowball; //���ڵ���
var nextball;  //��һ����
var background = new Image();       //����ͼƬ
background.src = 'image/bg1.jpg';
var missle = new Image();        //����ͼƬ
missle.src = "image/paodan.gif"
var box = new Box(150,510,90,570,'skyblue');
var ballfly = false;  //�Ƿ������ڷ�
var tid;
var velocity = 40  //����ٶ�
var vx;   //���ˮƽ�ٶ�
var vy;   //��Ĵ�ֱ�ٶ�
var piles = 0; //����
var tid2;   //���ڼ�¼����ʱ���id��
var tid3;  //�������
var begintime; //��¼��Ϸ��ʼ��ʱ��
var score;  //��¼��ǰ�ֵķ���  
var music;  //��ǰ�ı�������
var lstuselaser = begintime;   //��¼�ϴ�ʹ�ü����ʱ��
var warningline;  //������
var maxpiles = 9;
var totalscore = 0;  //��ҵ��ܷ�
var recordscore = 0; //��¼

window.addEventListener("load", eventWindowLoaded, false);	

//Point��
function Point(x,y){
	this.x = x;
	this.y = y;
}

//��Ĺ��캯��
function Box(s1x,s1y,s2x,s2y,stylestring){
	this.s1x = s1x;
	this.s1y = s1y;
	this.s2x = s2x;
	this.s2y = s2y;
	this.stylestring = stylestring;
	this.draw = drawbox;
}

//����ĺ���
function drawbox(){
	var s1x = this.s1x;
	var s1y = this.s1y;
	var s2x = this.s2x;
	var s2y = this.s2y;
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.strokeStyle = this.stylestring;
	context.lineWidth = 5;
	context.save();
	context.beginPath();
		context.moveTo(s1x,s1y);
		context.lineTo(s2x,s1y);
		context.lineTo(s2x,s2y);
		context.lineTo(s1x,s2y);
		context.quadraticCurveTo(s1x,cheight,misslex,cheight);
	context.stroke();
	context.restore();
}

//ը���Ĺ��캯��
function Bomb(sx,sy,rad,stylestring){
	this.sx = sx;
	this.sy = sy;
	this.rad = rad;
	this.draw = drawbomb;
	this.move = movesphere;
	this.fillstyle = stylestring;
}

function drawbomb(){
	var x = this.sx;
	var y = this.sy;
	var r = this.rad;
	var rgt = context.createRadialGradient(x,y,1,x,y,r);
	rgt.addColorStop("0","magenta");
	rgt.addColorStop(".25","blue");
	rgt.addColorStop(".50","green");
	rgt.addColorStop(".75","yellow");
	rgt.addColorStop("1.0","red");
	context.fillStyle = rgt;
	context.beginPath();
	context.arc(this.sx,this.sy,this.rad,0,Math.PI*2,true);
	context.fill();
}

//��Ĺ��캯��
function Sphere(sx,sy,rad,stylestring){
	this.sx = sx;
	this.sy = sy;
	this.rad = rad;
	this.draw = drawsphere;
	this.move = movesphere;
	this.fillstyle = stylestring;
}

//����ĺ���
function drawsphere(){
	context.fillStyle = this.fillstyle;
	context.beginPath();
	context.arc(this.sx,this.sy,this.rad,0,Math.PI*2,true);
	context.fill();
}

//����ƶ�����
function movesphere(dx,dy){
	this.sx += dx;
	this.sy += dy;
}

//������
function Laser(x,y){
	this.x = x;
	this.y = y;
	this.draw = drawlaser;
	this.move = movelaser;
}
	
//��������ĺ���
function drawlaser(){
	context.save();
	var lgt = context.createLinearGradient(this.x,this.y,cwidth,this.y+5);
	lgt.addColorStop("0","magenta");
	lgt.addColorStop(".25","yellow");
	lgt.addColorStop(".50","green");
	lgt.addColorStop(".75","blue");
	lgt.addColorStop("1.0","red");
	context.fillStyle = lgt;
	context.fillRect(this.x,this.y,cwidth,5);
	context.restore();
}

function movelaser(dx){
	this.y -= dx;
}
	
/* ����ÿ�ؿ�ʼǰ�ĳ�ʼ��  */
function init(){
	//������һ���Ĺ������������Ѷ�
	if(pass >= 2 && pass <5)colors = ['red','yellow','green','blue','purple','white'];
	if(pass >= 5 && pass <8 )colors = ['red','yellow','green','blue','purple','white','teal'];
	context.drawImage(background,0,0);
	context.drawImage(missle,misslex,missley);
	var line = 1+Math.round(pass/2);   //����ÿ�ظ��ݹ�����ʼ������
	var i;
	var j;
	for(var k = 0;k<20;++k){
		myarray[k] = new Array();
	}
	
	for(i = 0;i <= line; ++i){
		for(j =0;j < row-i%2; ++j){
			var num = Math.floor(Math.random()*colors.length);  //���������
			var color = colors[num];
			var sphere = new Sphere(srad+(j*2+i%2)*srad,srad+i*height*srad,srad,color);
			sphere.draw();
			myarray[i][j] = sphere;
		}
	}
	piles = line;
	begintime = new Date();
	ballfly = false;
	score = 0;
	lstuselaser = begintime;
	
	var num = Math.floor(Math.random()*colors.length);  //���������
	var color = colors[num];
	nowball = new Sphere(misslex+srad,missley-srad,srad,color);
	num = Math.floor(Math.random()*colors.length);  //���������
	color = colors[num];
	nextball = new Sphere(120,540,srad,color);
	
	theCanvas.addEventListener('mousemove',moveit,false);   //����ƶ��ļ����¼�
	theCanvas.addEventListener('mousedown',shot,false);     //������ļ����¼�
	
	var canvas = document.getElementById('canvasTwo');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,400,100)
	textDraw("Barrier:",ctx,"bold 35px comic sans ms",100,50,false);
	textDraw(pass,ctx,"bold 35px comic sans ms",250,50,true);
	
	box.draw();
	nowball.draw();
	nextball.draw();
	warningline.draw();
	
	tid2 = setInterval(calculatetime,1000);     //����ʱ��
	tid3 = setInterval(calculatescore,100);     //�������
	
	var recordscorestring = localStorage.getItem("maxscore");
	if(recordscorestring != null){
		recordscore = Number(recordscorestring);
	}
}

function eventWindowLoaded () {
	canvasApp();
}

/*��⵱ǰ��������Ƿ�֧��html5 canvas */
function canvasSupport () {
  	return Modernizr.canvas;
}

function canvasApp () {
  		
  		if (!canvasSupport()) {
			 return;
  		}
		
		theCanvas = document.getElementById("canvasOne");
		context = theCanvas.getContext("2d"); 

		ask();

		music = document.getElementById('sound1');     //��������
		
		warningline = new Laser(0,450);
}

//�ػ�ʱ�õ��ĺ���
function drawall(){
	var i;
	var j;
	context.drawImage(background,0,0);
	warningline.draw();
	box.draw();
	nextball.draw();
	for(i=0;i<=piles;++i){
		for(j=0;j<myarray[i].length;++j){
		    if(!is_undefined(myarray[i][j]) && myarray[i][j]!=null)
				myarray[i][j].draw()
		}
	}
	if(ballfly){
		context.drawImage(missle,misslex,missley);
	}
}

/*�ô��ڸ������ת���ĺ���,mx,my�����Ļ���ʱ����������*/
function moveit(ev){
	var mx;
	var my;
	if(ev.layerX || ev.layerX == 0){
		mx = ev.layerX;
		my = ev.layerY;
	}
	else if(ev.offsetX || ev.offsetX == 0){
		mx = ev.offsetX;
		my = ev.offsetY;
	}
	context.clearRect(0,0,cwidth,cheight); //��ԭ����ͼ�������»���
	drawall();
	var x_dis = mx - cwidth/2;
	var y_dis = missley+40-my;
	var angle = Math.atan(x_dis/y_dis);   //�������ƫ��Ƕ�
	
	if(Math.abs(angle) >= Math.PI/3)
		if(angle > 0 )angle = Math.PI/3;
		else angle = -Math.PI/3;
	context.save();        //���滭����״̬
	context.translate(misslex+25,missley+40);   //�ı�Բ�ģ�������ת
	context.rotate(angle);
	context.drawImage(missle,-25,-40);
	nowball.sx = 0;
	nowball.sy = -65;
	nowball.draw();
	context.restore();    //�ظ�������״̬
	nowball.sx = misslex+25;
	nowball.sy = missley-25;
}	

//��������¼�����
function shot(ev){
	if(ballfly)return;   //����������ڷɣ��������Ч
	ballfly = true;    //���ڷ�
	var mx;
	var my;
	if(ev.layerX || ev.layerX == 0){
		mx = ev.layerX;
		my = ev.layerY;
	}
	else if(ev.offsetX || ev.offsetX == 0){
		mx = ev.offsetX;
		my = ev.offsetY;
	}
	var x_dis = mx - cwidth/2;
	var y_dis = missley-srad-my;
	var hypotenuse = Math.sqrt(x_dis*x_dis+y_dis*y_dis);
	vx = (x_dis/hypotenuse)*velocity;      //�����ˮƽ������ٶ�
	vy = (y_dis/hypotenuse)*velocity;      //�������ֱ������ٶ�
	if(vy<0)vy = -vy;
	if((Math.abs(vy)*height)<Math.abs(vx)){
		vy = Math.sqrt(3)*velocity/3;
		if(vx<0){
			vx = -vy*height;
		}
		else{
			vx = vy*height;
		}
	}
	tid = setInterval(fly,10);             //�����˶��Ķ���
	theCanvas.removeEventListener('mousemove',moveit,false);      //�Ƴ�����˶���ʱ���ֹ����
}

//���ڷɵĶ�������
function fly(){
	if(!ballfly)return;
	context.clearRect(0,0,cwidth,cheight);
	drawall();
	wallcheck();
	nowball.move(vx*0.1,-vy*0.1);
	nowball.draw();
	crashcheck();
}

//�������û����ǽ
function wallcheck(){
	if(nowball.sx<=srad || nowball.sx >= (cwidth-srad))
		vx = -vx;
}

/*��ײ��⺯��*/
function crashcheck(){
	var i;
	var j;
	for(i=0;i<=piles;++i){
		for(j=0;j<myarray[i].length;++j){
			if(is_undefined(myarray[i][j]) || myarray[i][j] == null)continue;
			var dis_x = nowball.sx-myarray[i][j].sx;
			var dis_y = nowball.sy-myarray[i][j].sy;
			var dis = dis_x*dis_x + dis_y*dis_y;
			//�����������ߺ���������ͽ��м��
			if(dis <= 4*srad*srad || nowball.sy <= srad){
				var music = document.getElementById('bomb');
				music.play();
				clearInterval(tid);
				var point;
				if (nowball.sy <= srad) point = paste();
				else point = find_fit_place(i,j);   //�õ���ճ��λ��
				elimination(point);
				return;
			}
		}
	}
}

//����Ͷ�����ײ
function paste(){
	var x = Math.round((nowball.sx-srad)/(2*srad));
	var y = srad;
	nowball.sx = srad*(1+2*x);
	nowball.sy = y;
	myarray[0][x] = nowball;
	updatepiles();
	context.clearRect(0,0,cwidth,cheight);
	drawall();
	var point = new Point(0,x);
	return point;
}
	
/*��������ѡ����ӽ�����������λ��*/	
function find_fit_place(i,j){
	var x = myarray[i][j].sx;
	var y = myarray[i][j].sy;
	var m1x = x-2*srad;   //�����ε����
	var m1y = y;
	var m2x = x-srad;    //����
	var m2y = y-height*srad
	var m3x = x+srad;   //����
	var m3y = m2y;
	var m4x = x+2*srad;   //�ұ�
	var m4y = y;
	var m5x = m2x;         //����
	var m5y = y+height*srad;
	var m6x = m3x;         //����
	var m6y = m5y;
	var dis = 100000;      //Ԥ�����ñȽϴ��ֵ
	var result_x;
	var result_y;
	
	var diff = 0;
	if(i%2 == 0)diff = 1;
	
	if(check_boder(m1x,m1y) && (is_undefined(myarray[i][j-1]) || myarray[i][j-1] == null)){
		var temp = dist(nowball.sx,nowball.sy,m1x,m1y);
		if(temp < dis)dis = temp;
		x = m1x;
		y = m1y;
		result_x = i;
		result_y = j-1;
	}
	
	if(check_boder(m2x,m2y) &&(is_undefined(myarray[i-1][j-diff]) || myarray[i-1][j-diff]==null)){
		var temp = dist(nowball.sx,nowball.sy,m2x,m2y);
		if(temp < dis){
			dis = temp;
			x = m2x;
			y = m2y;
			result_x = i-1;
			result_y = j-diff;
		}
	}
	
	if(check_boder(m3x,m3y) && (is_undefined(myarray[i-1][j-diff+1]) || myarray[i-1][j-diff+1] == null)){
		var temp = dist(nowball.sx,nowball.sy,m3x,m3y);
		if(temp < dis){
			dis = temp;
			x = m3x;
			y = m3y;
			result_x = i-1;
			result_y = j-diff+1;
		}
	}
	
	if(check_boder(m4x,m4y) && (is_undefined(myarray[i][j+1]) || myarray[i][j+1]==null)){
		var temp = dist(nowball.sx,nowball.sy,m4x,m4y);
		if(temp < dis){
			dis = temp;
			x = m4x;
			y = m4y;
			result_x = i;
			result_y = j+1;
		}
	}
	
	if(check_boder(m5x,m5y) &&(is_undefined(myarray[i+1][j-diff]) || myarray[i+1][j-diff]==null)){
		var temp = dist(nowball.sx,nowball.sy,m5x,m5y);
		if(temp < dis){
			dis = temp;
			x = m5x;
			y = m5y;
			result_x = i+1;
			result_y = j-diff;
		}
	}
	
	if(check_boder(m6x,m6y) &&(is_undefined(myarray[i+1][j-diff+1]) || myarray[i+1][j-diff+1]==null)){
		var temp = dist(nowball.sx,nowball.sy,m6x,m6y);
		if(temp < dis){
			dis = temp;
			x = m6x;
			y = m6y;
			result_x = i+1;
			result_y = j-diff+1;
		}
	}
	nowball.sx = x;
	nowball.sy = y;
	//var sphere = new Sphere(nowball.sx,nowball.sy,srad,nowball.fillstyle);
	myarray[result_x][result_y] = nowball;
	updatepiles();       //���²���
	context.clearRect(0,0,cwidth,cheight);
	drawall();
	var point = new Point(result_x,result_y);
	return point;
}
	
//�����ĺ���
function elimination(point){
	var elimarray = [];   //��Ž�Ҫɾȥ���������
	var indexarray = [];  //���δ�����������
	var color = nowball.fillstyle;  //��ȡ��ɫ
	elimarray.push(point);
	indexarray.push(point);

	
	//�ڲ���������ֹ�ظ�
	function search(point){
		for(var i = 0;i < elimarray.length;++i)
			if(elimarray[i].x == point.x && elimarray[i].y == point.y)return true;
		return false;
	}
	
		
	//�����ը��,black��ʶը��
	if(color == 'black'){
		var p1 = atop(nowball.sx-2*srad,nowball.sy);
		var p2 = atop(nowball.sx-srad,nowball.sy-height*srad);
		var p3 = atop(nowball.sx+srad,nowball.sy-height*srad);
		var p4 = atop(nowball.sx+2*srad,nowball.sy);
		var p5 = atop(nowball.sx-srad,nowball.sy+height*srad);
		var p6 = atop(nowball.sx+srad,nowball.sy+height*srad);
		if(pcheck(p1))elimarray.push(p1);
		if(pcheck(p2))elimarray.push(p2);
		if(pcheck(p3))elimarray.push(p3);
		if(pcheck(p4))elimarray.push(p4);
		if(pcheck(p5))elimarray.push(p5);
		if(pcheck(p6))elimarray.push(p6);
	}else{
	//�������ը������δ������һֱѭ��
	while(indexarray.length>0){
		var p = indexarray[indexarray.length-1];
		indexarray.pop();   //ȡ�������еĵ㣬��indexarray���������
		var diff = 0;
		if(p.x%2 == 0)diff = 1;
		var p1 = new Point(p.x,p.y-1);   //��
		var p2 = new Point(p.x,p.y+1);   //��
		var p3 = new Point(p.x-1,p.y-diff);   //����
		var p4 = new Point(p.x-1,p.y-diff+1);   //����
		var p5 = new Point(p.x+1,p.y-diff);   //����
		var p6 = new Point(p.x+1,p.y-diff+1);   //����
		//�����ߵ����������Ϸ���������򣬲�����ɫһ�£�û�б��������ͷŽ�������
		if(pcheck(p1) && !is_undefined(myarray[p1.x][p1.y]) &&myarray[p1.x][p1.y]!=null){
			if((myarray[p1.x][p1.y].fillstyle == color) && !search(p1)){
				elimarray.push(p1);
				indexarray.push(p1);
			}
		}
		//����ұߵ���
		if(pcheck(p2) && !is_undefined(myarray[p2.x][p2.y]) &&myarray[p2.x][p2.y]!=null){
			if((myarray[p2.x][p2.y].fillstyle == color) && !search(p2)){
				elimarray.push(p2);
				indexarray.push(p2);
			}
		}
		//���������
		if(pcheck(p3) && !is_undefined(myarray[p3.x][p3.y])&&myarray[p3.x][p3.y]!=null){
			if((myarray[p3.x][p3.y].fillstyle == color) && !search(p3)){
				elimarray.push(p3);
				indexarray.push(p3);
			}
		}
		//���������
		if(pcheck(p4) && !is_undefined(myarray[p4.x][p4.y])&&myarray[p4.x][p4.y]!=null){
			if((myarray[p4.x][p4.y].fillstyle == color) && !search(p4)){
				elimarray.push(p4);
				indexarray.push(p4);
			}
		}
		//���������
		if(pcheck(p5) && !is_undefined(myarray[p5.x][p5.y])&&myarray[p5.x][p5.y]!=null){
			if((myarray[p5.x][p5.y].fillstyle == color) && !search(p5)){
				elimarray.push(p5);
				indexarray.push(p5);
			}
		}
		//���������
		if(pcheck(p6) && !is_undefined(myarray[p6.x][p6.y])&&myarray[p6.x][p6.y]!=null){
			if((myarray[p6.x][p6.y].fillstyle == color) && !search(p6)){
				elimarray.push(p6);
				indexarray.push(p6);
			}
		}
	}
	}
	
	//�����3����3�����ϵ���ͬ�򣬾�����
	if(elimarray.length >= 3 || color == 'black'){
		scoring(elimarray.length);
		for(var i = 0;i<elimarray.length;++i){
			var p = elimarray[i];
			myarray[p.x][p.y] = null;
		}
	}
	reelimination();    //����û�����ŵ���
	ballfly = false;
	update();    //������Ϣ,��ǰ�����һ����
	updatepiles();
	drawall();
	nowball.draw();
	context.drawImage(missle,misslex,missley);
	theCanvas.addEventListener('mousemove',moveit,false);   //����ƶ��ļ����¼�
	if(checkwin())dowin();
	else if(checklose())dolose();
}

//��ȥû��ס����
function reelimination(){
	var remainarray = []; //��Ȼ���ڵĺͶ������ŵ���
	var elimarray = [];  //Ҫɾȥ����
	var indexarray = []; //���ڼ�������
	var cloud = []; //��ʾһ����������
	
	//�ڲ��������������û����remainarray
	function search(point){
		for(var i = 0;i < remainarray.length;++i)
			if(remainarray[i].x == point.x && remainarray[i].y == point.y)return true;
		return false;
	}
	
	//����һ�Ŵ��ڵ����ȷŽ�ȥ
	for(var i = 0;i<myarray[0].length;++i){
		if(myarray[0][i] != null){
			var p = new Point(0,i);
			remainarray.push(p);
			indexarray.push(p);
		}
	}
	
	//��δ������һֱѭ��
	while(indexarray.length>0){
		var pp = indexarray[indexarray.length-1];
		indexarray.pop();   //ȡ�������еĵ㣬��indexarray���������
		cloud.push(pp);
		//���ݶ��˵�һ�����ҵ�������������
		while(cloud.length>0){
			var p = cloud[cloud.length-1];
			cloud.pop();
			var diff = 0;
			if(p.x%2 == 0)diff = 1;
			var p1 = new Point(p.x,p.y-1);   //��
			var p2 = new Point(p.x,p.y+1);   //��
			var p3 = new Point(p.x-1,p.y-diff);   //����
		    var p4 = new Point(p.x-1,p.y-diff+1);   //����
			var p5 = new Point(p.x+1,p.y-diff);   //����
			var p6 = new Point(p.x+1,p.y-diff+1);   //����
			//�����ߵ����������Ϸ���������򣬲��Ҳ���remainarray�У��ͷŽ�ȥ
			if(pcheck(p1) && !is_undefined(myarray[p1.x][p1.y]) &&myarray[p1.x][p1.y]!=null){
				if( !search(p1)){
					remainarray.push(p1);
					cloud.push(p1);
				}
			}
			//����ұߵ���
			if(pcheck(p2) && !is_undefined(myarray[p2.x][p2.y]) &&myarray[p2.x][p2.y]!=null){
				if( !search(p2)){
					remainarray.push(p2);
					cloud.push(p2);
				}
			}
			//���������
			if(pcheck(p3) && !is_undefined(myarray[p3.x][p3.y])&&myarray[p3.x][p3.y]!=null){
				if(!search(p3)){
					remainarray.push(p3);
					cloud.push(p3);
				}
			}
			//���������
			if(pcheck(p4) && !is_undefined(myarray[p4.x][p4.y])&&myarray[p4.x][p4.y]!=null){
				if(!search(p4)){
					remainarray.push(p4);
					cloud.push(p4);
				}
			}
			//���������
			if(pcheck(p5) && !is_undefined(myarray[p5.x][p5.y])&&myarray[p5.x][p5.y]!=null){
				if(!search(p5)){
					remainarray.push(p5);
					cloud.push(p5);
				}
			}
			//���������
			if(pcheck(p6) && !is_undefined(myarray[p6.x][p6.y])&&myarray[p6.x][p6.y]!=null){
				if(!search(p6)){
					remainarray.push(p6);
					cloud.push(p6);
				}
			}
		}
	}
	//�������
	var num = 0;
	for(var i = 0;i<= piles;++i){
		for(var j = 0;j< myarray[i].length;++j){
			if(!searchinarray(i,j)&&myarray[i][j]!=null){
				myarray[i][j]=null;
				num++;
			}
		}
	}
	
	//�ڲ�����
	function searchinarray(i,j){
		for(var k =0;k<remainarray.length;++k){
			if(remainarray[k].x ==i && remainarray[k].y == j)return true;
		}
		return false;
	}
	scoring(num);
}
	
//��������֮������ƽ��	
function dist(x1,y1,x2,y2){
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

//�����ж϶���������ǲ���undefined
function is_undefined(object) { 
return typeof object == "undefined"; 
}

//���ڼ�����Ƿ��ڱ߽�
function check_boder(x,y){
	if(x<10 || y<10)return false;
	if(x>(cwidth-10))return false;
	return true;
}

//�������������������е�λ��
function atop(x1,y1){
	var y = Math.ceil(x1/(2*srad))-1;  //��
	var x = Math.round((y1-srad)/(height*srad));  //��
	var point = new Point(x,y);
	return point;
}

//���ڼ����Ƿ�Ϸ�
function pcheck(point){
    var max;
	if(point.y <0 || point.x<0)return false;
	
	if(point.x%2 == 0)max = 9;
	else max = 8;
	
	if(point.y > max)return false;
	if(point.x > piles)return false;
	return true;
}

//���µ�ǰ�����Ϣ
function update(){
	var num = Math.floor(Math.random()*colors.length);  //���������
	var color = colors[num];
	nowball = nextball;
	nowball.sx = misslex+srad;
	nowball.sy = missley-srad;
	
	
	//С�����������ը��
	var number = Math.floor(Math.random()*100);  //���������
	if(number < 93)
		nextball = new Sphere(120,540,srad,color);
	else
		nextball = new Bomb(120,540,srad,"black");  //��Black����ʶը��
}	

//���²���
function updatepiles(){
	for(var i = 0;i<myarray.length;++i){
		var t = 0;
		for(var j = 0;j<myarray[i].length;++j){
			if(is_undefined(myarray[i][j]) || myarray[i][j] == null)t++;
		}
		if(t == myarray[i].length){
			piles = i-1;
			return;
		}
	}
}

//����
function upspeed(){
	if(velocity >= 60){
		alert("It is the maxium speed,you can not speed up anymore.");
		return;
	}
	velocity *= 1.2;
	vx *= 1.2;
	vy *= 1.2;
}

//����
function downspeed(){
	if(velocity <= 10){
		alert("It is the minium speed,you can not slow down anymore.");
		return;
	}
	velocity /= 1.2;
	vx /= 1.2;
	vy /= 1.2;
}

function textDraw(sample,ctx,font,x,y,fill){
  var text = sample;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  if(fill){
    ctx.fillStyle = "#ccc";
    ctx.fillText(text,x,y);
  }else{
    ctx.strokeStyle = "#666";
    ctx.strokeText(text,x,y);
  }
}

//����ʱ��
function calculatetime(){
  var endtime = new Date();
  var difftime = endtime - begintime;
  var seconds = Math.floor(difftime/1000+0.5);
  var canvas = document.getElementById('canvasTwo');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0,100,400,100);
  textDraw("TIME:",ctx,"bold 35px comic sans ms",100,150,false);
  textDraw(seconds,ctx,"bold 35px comic sans ms",250,150,true);
}

//���·���
function calculatescore(){
	var canvas = document.getElementById('canvasTwo');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,200,400,200);
	textDraw("SCORE:",ctx,"bold 35px comic sans ms",100,250,false);
	textDraw(score,ctx,"bold 35px comic sans ms",250,250,true);
	textDraw("Sum:",ctx,"bold 35px comic sans ms",100,350,false);
	textDraw(totalscore,ctx,"bold 35px comic sans ms",250,350,true);
}

//����������ĸ�������÷�
function scoring(number){
	var i = number -3;
	if(number>0){
		score += 300;
		totalscore += 300;
	}
	var base = 100;
	for(;i>=0;i--){
		base += 100;
		score += base;
		totalscore += base;
	}
	
	var s = localStorage.getItem("maxscore");
	if( s == null )localStorage.setItem("maxscore",totalscore);
	else if(totalscore > Number(s)){
		localStorage.setItem("maxscore",totalscore);
	}
}

//��������
function playSound(){
	music.play();
}

//��ͣ����
function pauseSound(){
	music.pause();
}

//��������
function changemusic(){
	if(!music.paused)
		music.pause();
	if(document.form1.musiclabel.value =="Baa")music = document.getElementById('sound1');
	else if(document.form1.musiclabel.value =="Do You Ears Hang Low")music = document.getElementById('sound2');
	else if(document.form1.musiclabel.value =="We Wish You A Merry Christmas")music = document.getElementById('sound3');
	else if(document.form1.musiclabel.value =="kanong")music = document.getElementById('sound4');
	else if(document.form1.musiclabel.value =="coward")music = document.getElementById('sound5');
	music.play();
}

//��������ͼƬ
function changebackground(){
	if(document.form1.backgroundlabel.value =="bg1")background.src = "image/bg1.jpg";
	else if(document.form1.backgroundlabel.value =="bg2")background.src = "image/bg2.jpg";
	else if(document.form1.backgroundlabel.value =="bg3")background.src = "image/bg3.jpg";
	else if(document.form1.backgroundlabel.value =="bg4")background.src = "image/bg4.jpg";
	else if(document.form1.backgroundlabel.value =="bg5")background.src = "image/bg5.jpg";
	document.form1.backgroundlabel.onblur = function(){
		context.clearRect(0,0,cwidth,cheight);
		context.drawImage(background,0,0);
		drawall();
		nowball.draw();
		context.drawImage(missle,misslex,missley);
	}
}

//ʹ�ü���
function uselaser(){
	//������ڷɣ�������ʹ�ü���
	if(ballfly){
		alert("The ball is flying,you can't use laser!");
		return;
	}
	if(!checktime())return;
	
	var laser = new Laser(0,450);
	laser.draw();
	theCanvas.removeEventListener('mousemove',moveit,false);      //�Ƴ�����˶���ʱ���ֹ����
	var tid = setInterval(lasermove,20);
	score -= 3000;
	totalscore -= 3000;
	
	function lasermove(){
		theCanvas.removeEventListener('mousedown',shot,false);     //������ļ����¼�
		laser.move(5);
		context.clearRect(0,0,cwidth,cheight);
		drawall();
		nowball.draw();
		context.drawImage(missle,misslex,missley);
		laser.draw();
		
		if(laser.y <= (height*piles*srad+srad)){
			for(var i =0;i<myarray[piles].length;++i){
				if(myarray[piles][i] != null){
					myarray[piles][i] = null
				}
			}
			context.clearRect(0,0,cwidth,cheight);
			drawall();
			nowball.draw();
			context.drawImage(missle,misslex,missley);
			clearInterval(tid);
			theCanvas.addEventListener('mousemove',moveit,false); 
			theCanvas.addEventListener('mousedown',shot,false);     //������ļ����¼�
			updatepiles();
			if(checkwin())dowin();
		}
	}
	
	function checktime(){
		var endtime = new Date();
		var difftime = endtime - lstuselaser;
		var seconds = Math.floor(difftime/1000+0.5);
		if(seconds<60){
			alert("The interval is: "+seconds+"seconds.The time is not enough for 60 seconds,please wait "+(60-seconds)+"seconds and reclick!");
			return false;
		}
		lstuselaser = endtime;  //�������ʹ�ü����ʱ��
		return true;
	}
}
	
//����Ƿ�����Ӯ
function checkwin (){
	if(piles > 0)return false;
	for(var i = 0 ; i<10;++i){
		if(myarray[0][i] != null)return false;
	}
	return true;
}

//����ǲ�������
function checklose(){
	if(piles > maxpiles)return true;
	return false;
}

//������ˣ�ִ�����´���
function dolose(){
	alert("sorry,you lose the game.");
	for(var i = 0 ; i<=piles;i++){
		for(var j = 0 ;j< myarray[i].length;++j){
			if(myarray[i][j] != null)myarray[i][j] = null;
		}
	}
	ask();
}

function dowin(){
	alert("wonderful,you pass!");
	for(var i = 0 ; i<=piles;i++){
		for(var j = 0 ;j< myarray[i].length;++j){
			if(myarray[i][j] != null)myarray[i][j] = null;
		}
	}
	pass++;
	ask();
	
	if(totalscore > maxscore){
		alert("new record! Your score is:"+totalscore);
	}
}

//ѯ�����
function ask(){
	var t;
	clearInterval(tid2,1000);
	context.clearRect(0,0,cwidth,cheight);
	
	context.drawImage(img,0,0);
	theCanvas.removeEventListener('mousemove',moveit,false);      //�Ƴ�����˶���ʱ���ֹ����
	theCanvas.removeEventListener('mousedown',shot,false);     //������ļ����¼�
	textDraw("Start",context,"40px comic sans ms",250,100,false);
	textDraw("Quit",context,"40px comic sans ms",250,200,false);
	textDraw("Record",context,"40px comic sans ms",250,300,false);
	textDraw("Save",context,"40px comic sans ms",250,400,false);
	textDraw("Load",context,"40px comic sans ms",250,500,false);
	
	theCanvas.addEventListener('mousemove',doit,false);   
	theCanvas.addEventListener('mousedown',next,false);	
	
	function next(ev){
		var mx;
		var my;
		if(ev.layerX || ev.layerX == 0){
			mx = ev.layerX;
			my = ev.layerY;
		}
		else if(ev.offsetX || ev.offsetX == 0){
			mx = ev.offsetX;
			my = ev.offsetY;
		}
		if(mx >= 180 && mx <=320 && my >= 50 && my <=150){
			theCanvas.removeEventListener('mousemove',doit,false);   
			theCanvas.removeEventListener('mousedown',next,false);	
			init();
		}
		else if(mx >= 200 && mx <=300 && my >= 150 && my <=250){
			windowclose();
		}
		else if(mx >= 180 && mx <=320 && my >= 250 && my <=350){
			var x = localStorage.getItem("maxscore");
			if(x!=null){
				alert("The record is:"+Number(x));
			}
			else{
				alert("No record");
			}
		}
		else if(mx >= 200 && mx <=300 && my >= 350 && my <=450){
			localStorage.setItem("barrier",pass);
			localStorage.setItem("score",totalscore);
			alert("Save successfully!");
		}
		else if(mx >= 200 && mx <=300 && my >= 450 && my <=550){
			var x = localStorage.getItem("barrier");
			if(x == null){
				alert("you did not saved before,load failed");
				return;
			}
			totalscore = Number(localStorage.getItem("score"));
			pass = Number(x);
			theCanvas.removeEventListener('mousemove',doit,false);   
			theCanvas.removeEventListener('mousedown',next,false);
			t = setInterval(process,40);
		}		
		else{
			return;
		}
	}
	
	var a = 0;
	function process(){
		if(a >= 400){
			clearInterval(t);
			init();
			return;
		}
		context.clearRect(0,0,cwidth,cheight);
		context.strokeRect(50,500,400,50);
		context.save();
		var lgt = context.createLinearGradient(50,500,400,50);
		lgt.addColorStop("0","blue");
		lgt.addColorStop(".25","red");
		lgt.addColorStop(".75","blue");
		lgt.addColorStop("1.0","yellow");
		context.fillStyle = lgt;
		context.fillRect(50,500,a,50);
		context.restore();
		a+=4;
		textDraw((a/4-1)+"%",context,"40px comic sans ms",150,450,true);	
	}
	
	function doit(ev){
		var mx;
		var my;
		if(ev.layerX || ev.layerX == 0){
			mx = ev.layerX;
			my = ev.layerY;
		}
		else if(ev.offsetX || ev.offsetX == 0){
			mx = ev.offsetX;
			my = ev.offsetY;
		}
		if(mx >= 180 && mx <=320 && my >= 50 && my <=150){
			context.clearRect(0,0,cwidth,cheight);
			context.drawImage(img,0,0);
			textDraw("Start",context,"bold 60px comic sans ms",250,100,true);
			textDraw("Quit",context,"40px comic sans ms",250,200,false);
			textDraw("Record",context,"40px comic sans ms",250,300,false);	
			textDraw("Save",context,"40px comic sans ms",250,400,false);
			textDraw("Load",context,"40px comic sans ms",250,500,false);	
		}
		else if(mx >= 200 && mx <=300 && my >= 150 && my <=250){
			context.clearRect(0,0,cwidth,cheight);
			context.drawImage(img,0,0);
			textDraw("Start",context,"40px comic sans ms",250,100,false);
			textDraw("Quit",context,"bold 60px comic sans ms",250,200,true);
			textDraw("Record",context,"40px comic sans ms",250,300,false);
			textDraw("Save",context,"40px comic sans ms",250,400,false);
			textDraw("Load",context,"40px comic sans ms",250,500,false);			
		}
		else if(mx >= 180 && mx <=320 && my >= 250 && my <=350){
			context.clearRect(0,0,cwidth,cheight);
			context.drawImage(img,0,0);
			textDraw("Start",context,"40px comic sans ms",250,100,false);
			textDraw("Quit",context,"40px comic sans ms",250,200,false);
			textDraw("Record",context,"bold 60px comic sans ms",250,300,true);	
			textDraw("Save",context,"40px comic sans ms",250,400,false);
			textDraw("Load",context,"40px comic sans ms",250,500,false);			
		}
		else if(mx >= 200 && mx <=300 && my >= 350 && my <=450){
			context.clearRect(0,0,cwidth,cheight);
			context.drawImage(img,0,0);
			textDraw("Start",context,"40px comic sans ms",250,100,false);
			textDraw("Quit",context,"40px comic sans ms",250,200,false);
			textDraw("Record",context,"40px comic sans ms",250,300,false);	
			textDraw("Save",context,"bold 60px comic sans ms",250,400,true);
			textDraw("Load",context,"40px comic sans ms",250,500,false);			
		}		
		else if(mx >= 200 && mx <=300 && my >= 450 && my <=550){
			context.clearRect(0,0,cwidth,cheight);
			context.drawImage(img,0,0);
			textDraw("Start",context,"40px comic sans ms",250,100,false);
			textDraw("Quit",context,"40px comic sans ms",250,200,false);
			textDraw("Record",context,"40px comic sans ms",250,300,false);	
			textDraw("Save",context,"40px comic sans ms",250,400,false);
			textDraw("Load",context,"bold 60px comic sans ms",250,500,true);			
		}	
		else{
			context.clearRect(0,0,cwidth,cheight);
			context.drawImage(img,0,0);
			textDraw("Start",context,"40px comic sans ms",250,100,false);
			textDraw("Quit",context,"40px comic sans ms",250,200,false);
			textDraw("Record",context,"40px comic sans ms",250,300,false);	
			textDraw("Save",context,"40px comic sans ms",250,400,false);
			textDraw("Load",context,"40px comic sans ms",250,500,false);			
		}
	}
}

function windowclose() {
    var browserName = navigator.appName;
    if (browserName=="Netscape") {
        window.open('', '_self', '');
        window.close();
    }
    else {
        if (browserName == "Microsoft Internet Explorer"){
            window.opener = "whocares";
            window.opener = null;
            window.open('', '_top');
            window.close();
        }
    }
}
