//defining main app
var simonApp = angular.module('simonApp',[]);

//defining controller
simonApp.controller('maincon',['$scope','$timeout','$interval','$filter',function($scope,$timeout,$interval,$filter){
  //general purpose array with objects
  $scope.arr = [
    {audid: 'aud1id', butid: 'bt1id', bstyle: '#33ff33'},
    {audid: 'aud2id', butid: 'bt2id', bstyle: '#ff3333'},
    {audid: 'aud3id', butid: 'bt3id', bstyle: '#ffff33'},
    {audid: 'aud4id', butid: 'bt4id', bstyle: '#3333ff'}
  ];
  //declare and generate main array for 20 steps
  var mainarr = [];
  genermainar();
  //variables for adding classes
  $scope.varofstart = '', $scope.varofstrict = '', $scope.varofcount = ''; 
  //variables for ng-if directive
  $scope.showhr = true, $scope.whichstep = 1, $scope.showwhichstep;
  //variable for activating/disactivating functionalities
  $scope.isOff = true;
  //non-scope variables
  var yourturnstep = 0, increment = 0, isbuttonact = false, playerror, stricton, playcomp; 
  
  $scope.toggleSlideButton = function(){ 
    if($scope.isOff) {
      $scope.isOff = false;
      $scope.varofcount = 'colorofhr';
    }else{
      $scope.isOff = true;
      $scope.varofcount = '';
      $scope.varofstart = '';
      $scope.varofstrict = '';
      $scope.showhr = true;
      $scope.whichstep = 1;
      $scope.showerror = false;
      isbuttonact = false;
      $timeout.cancel(playcomp);
      $timeout.cancel(playerror);
    }
  };  
  //game starts
  $scope.toggleColorofStart = function(){
      if(!$scope.isOff) {
        if($scope.varofstart === ''){
          $scope.varofstart = 'colorofstart';
          yourturnstep = 0;
          $scope.whichstep = 1;
          increment = 0;
          firstStep();
        }else{
          $scope.varofstart = '';
          $scope.showhr = true;
          $scope.whichstep = 1;
          $scope.showerror = false;
          isbuttonact = false;
        }
      }
  }; 

  $scope.toggleColorofStrict = function(){
      if(!$scope.isOff) {
        if($scope.varofstrict === ''){
          $scope.varofstrict = 'colorofstrict';
          stricton = true;
        }else{
          $scope.varofstrict = '';
          stricton = false;
        }
      }
  }; 
//====================================helpers=========================================================
function blink(){
  var white = function(){$scope.varofcount = '';};
  var red = function(){$scope.varofcount = 'colorofhr';};
  white();
  $timeout(red,250);
}
//function for generating error  
function genermainar(){
   var k=20, ar1=[], ar2=[];
   for(var i=0;i<k;i++){
    ar1.push(Math.floor(Math.random()*4+1));
    for(var j=0; j<ar1.length; j++){
        ar2.push(ar1[j]);
    }
    mainarr.push(ar2);
    ar2=[];
  } 
} 
//helper function to play the steps in generated array by computer
//the function acitvates in 1ms light color and sound for each button by id and disactivates in 500ms. To get the meaning
//of each i in for loop setTimeout is put in closure, before it is put in another setTimeout to give enaugh time to play
//each button, in this case the time is i*1000ms. Also after all buttons finish playing buttons are disactivated. The whole
//function is invoked in 2000ms once it is called
function compPlays(par) {
  playcomp = $timeout(function(){
      $scope.showwhichstep = $scope.whichstep;
      $scope.showhr = false;
      $timeout(function(){ isbuttonact = true; },mainarr[par].length*1000);
      for (i = 0; i < mainarr[par].length; i++) {
        var num = Number(mainarr[par][i])-1;
        (function(num){
            setTimeout(function(){
                setTimeout(function(){document.getElementById($scope.arr[num].butid).style.background = $scope.arr[num].bstyle;},1);
                setTimeout(function(){
                  document.getElementById($scope.arr[num].butid).style.background = '';
                  document.getElementById($scope.arr[num].audid).play();
                },500);
            }, i*1000);
        })(num);
      }    
  },2000);
}
//blink exclamation mark
function blinkexc(){
  $timeout(function(){$scope.showwhichstep = '!!';},200);
  $timeout(function(){$scope.showwhichstep = '';},400);
  $timeout(function(){$scope.showwhichstep = '!!';},600);
  $timeout(function(){$scope.showwhichstep = $scope.whichstep;},800);
}
//helper function gives time to click button, if nothing happens within given time it plays error
function timeForYou(giventime){
  playerror = $timeout(function(){
    blinkexc();
    document.getElementById('error').play();
    increment = 0;
    if(stricton){
      yourturnstep = 0;
      $scope.whichstep = 1;
    }
    compPlays(yourturnstep);
  },giventime);
}
//to play audio and change background color on button click, also it gets number parameter of button and compares it
//with each corresponding element of n-th subarray by incrementing increment variable. If all buttons clicked corresponding
//to all subarray elements then youturnstep incremented together with other variables and compPlays function called with
//with youturnstep variable as a parameter. If one of the button's number is not similar to array's element then
//error plays and increment is zeroed to start from beginning depending on strict mode and compPlays invoked again
//with the same youturnstep parameter without incrementing. If step number reaches 20 then winner sound plays and game is over.
$scope.play = function(audioid,buttonid,buttonstyle,n,sourceid){
  if(isbuttonact){
      setTimeout(function(){document.getElementById(buttonid).style.background = buttonstyle;},1);
      setTimeout(function(){
        document.getElementById(buttonid).style.background = '';
        document.getElementById(audioid).load();
        document.getElementById(audioid).play();
      },100);      
      $timeout.cancel(playerror);
      timeForYou(mainarr[yourturnstep].length*1000+7001);
      if(mainarr[yourturnstep][increment] === Number(n)){
        increment++;
      }else{
        blinkexc();
        document.getElementById('error').play();
        increment = 0;
        if(stricton){
          yourturnstep = 0;
          $scope.whichstep = 1;
        }
        isbuttonact = false;
        compPlays(yourturnstep);
      }
      if(increment===mainarr[yourturnstep].length){        
        yourturnstep++;
        $scope.whichstep++;
        increment = 0;
        if($scope.whichstep===21){
          $scope.whichstep = 20;
          document.getElementById('winner').play();
          isbuttonact = false;
          $timeout.cancel(playerror);
        }else{
          isbuttonact = false;
          compPlays(yourturnstep);
        }
      }
  }
}
//first step function when start is clicked
function firstStep(){  
  $interval(blink,500,2);
  $interval.cancel(blink);
  compPlays(0);
  timeForYou(8000);
}
}]);


