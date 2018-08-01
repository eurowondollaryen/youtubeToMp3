var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var videoId;//current videoId
var player;//youtube player object
var listCapacity = 0;//Capacity of List(**Duplicated)
var currentNum = -1;//Current Playing Music Number
var playList = [];//Playlist Array
var is_shuffle = 0;
setInterval(autoNext, 2000);

function onYouTubePlayerAPIReady() {
    player = new YT.Player('mainPlayer', {
      height: '360',
      width: '640',
      videoId: 'JjAJ_wK9YJk'
    });
}

function loadDownpage() {
    videoId = document.getElementById("urlinput").value;
    //document.body.innerHTML = '<iframe src="https://www.yt-download.org/@api/button/mp3/' + videoId + '" width="100%" height="100px" scrolling="no" style="border:none;"></iframe><br><h4>다운로드 버튼이 안 나오면 아래 링크로!</h4><a href = "https://y2mate.com/kr/youtube-to-mp3/' + videoId + '">링크</a>';
    var downloadWindow = window.open("", "");
    downloadWindow.document.write('<iframe src="https://www.yt-download.org/@api/button/mp3/' + videoId + '" width="100%" height="100px" scrolling="no" style="border:none;"></iframe><br><h4>다운로드 버튼이 안 나오면 아래 링크로!</h4><a href = "https://y2mate.com/kr/youtube-to-mp3/' + videoId + '">링크</a>')
}

function addToList() {
    var fullURL = document.getElementById("urlinput").value;
    videoId = fullURL;
    
    var my_tbody = document.getElementById("my-tbody");
    var row = my_tbody.insertRow(my_tbody.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    row.setAttribute("id","ID" + my_tbody.rows.length);
    listCapacity = listCapacity + 1;
    $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoId + '&key=AIzaSyC9dhEVxKVnAJHdDwGWOYZJwQHah7ZvzRQ', function(data) {
        cell1.innerHTML = "<img src='https://img.youtube.com/vi/" + videoId + "/1.jpg'>";
        cell2.innerHTML = "<p><br>" + data.items[0].snippet.title + "</p>";
        cell3.innerHTML = "<button class='btn' onclick='play(" + listCapacity + ");'>Play</button>"
        cell4.innerHTML = "<button class='btn' onclick='Delete(" + listCapacity + ")'>Delete</button>";
        playList.push({"id" : videoId,"num": listCapacity});
        console.log(playList);
        console.log(playList.length);
    });
}
function play(number) {
	if(currentNum != -1) document.getElementById("ID" + currentNum).style.backgroundColor = "white";

    player.loadVideoById(playList[number-1].id);
    currentNum = number;
    //console.log("played No." + number + " song. its ID is " + playList[number-1].id + ". CurrentNum is " + currentNum + ". ");

    document.getElementById("ID" + currentNum).style.backgroundColor = "pink";
}
function playNext() {
	document.getElementById("ID" + currentNum).style.backgroundColor = "white";
	if(is_shuffle == 0) {
		var size = playList.length;
    	currentNum = currentNum + 1;
    	if(size < currentNum) {
    		currentNum = currentNum - size;
    	}
    	//console.log("currentNum is : " + currentNum + " and playList.length is " + size);
    	player.loadVideoById(playList[currentNum-1].id);
    	//console.log("played No." + currentNum + " song. its ID is " + playList[currentNum-1].id + ". CurrentNum is " + currentNum + ". ");

    	document.getElementById("ID" + currentNum).style.backgroundColor = "pink";
	}
	else if(is_shuffle == 1) {
		var size = playList.length;
		currentNum = Math.floor(Math.random() * playList.length) + 1;
		player.loadVideoById(playList[currentNum-1].id);
		document.getElementById("ID" + currentNum).style.backgroundColor = "pink";
	}
	
}
function playPrev() {
	document.getElementById("ID" + currentNum).style.backgroundColor = "white";

	var size = playList.length;
	currentNum = currentNum - 1;
	if(currentNum < 1) {
		currentNum = size;
	}
	//console.log("currentNum is : " + currentNum + " and playList.length is " + size);
	player.loadVideoById(playList[currentNum-1].id);
	//console.log("played No." + currentNum + " song. its ID is " + playList[currentNum-1].id + ". CurrentNum is " + currentNum + ". ");
	document.getElementById("ID" + currentNum).style.backgroundColor = "pink";
}
function Delete(Num) {
	$('#ID' + Num).remove();
	listCapacity--;
	for(var i = Num+1; i <= listCapacity+1; ++i) {
		$("#ID" + i + " td:nth-child(3)").children().attr("onclick", ";play(" + (i-1) + ");");
		//delete(n)을 하나 감소
		$("#ID" + i + " td:nth-child(4)").children().attr("onclick", "Delete(" + (i-1) + ")");
		//id도 1 감소
		$("#ID" + i).attr("id", "ID" + (i-1));

		playList[i-1].num--;//플레이리스트 동기화
	}
	playList.splice(Num-1,1);
}
function autoNext() {
	if(player.getPlayerState() == 0) playNext();
}
function setShuffle() {
	if(is_shuffle == 0) {
		is_shuffle = 1;
		document.getElementById("shuffleBtn").style.backgroundColor = "pink";

	}
	else if(is_shuffle == 1) {
		is_shuffle = 0;
		document.getElementById("shuffleBtn").style.backgroundColor = "lightgray";
	}
    else {
        is_shuffle = 1;
    }
}