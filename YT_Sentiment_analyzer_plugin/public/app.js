const videoCardContainer = document.querySelector('.video-container');


let api_key = "AIzaSyBggO5YmBvsnDLIdno18ky8WNFK2E-MTfc";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let search_http = "https://www.googleapis.com/youtube/v3/search?";
var x = 0;

fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 50,
    regionCode: 'it'
}))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            getChannelIcon(item);
        })
    })
    .catch(err => console.log(err));

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
        .then(res => res.json())
        .then(data => {
            x++;
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            if (x <= 50) {
                id = video_data.id
                console.log("sono qua ", id);
            } else {
                id = video_data.id.videoId
                console.log("sono qua 2 ", id);
            }

            makeVideoCard(video_data, id);
        })
}
//import {sendDataToServer} from "client.js"
const makeVideoCard = (data, id) => {
    //console.log(data.id);
    videoCardContainer.innerHTML += `
    <div class="video" onclick="sendDataToServer('https://youtube.com/watch?v=${id}')">    
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>
    <div id="snackbar">URL copiato negli appunti</div>
    `;
}

const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";


searchBtn.addEventListener('click', () => {

    videoCardContainer.innerHTML = "";
    console.log("mbareeee");
    console.log(searchInput.value);
    let keyword = searchInput.value.toString();
    fetch(search_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        q: keyword,
        maxResults: 50,
        type: 'video'
    }))
        .then(res => res.json())
        .then(data => {
            data.items.forEach(item => {
                getChannelIcon(item);
            })
        })
        .catch(err => console.log(err));
})


get_video_url = () => {
    let url = navigator.clipboard.readText();
    console.log("eccomi qua : ", url);
    return url;
}


    const sendDataToServer = (url) => {

        $('body').html(`<!DOCTYPE html>
            
            <body>
                
                <nav class="navbar1">
                    <a href="index.html"><img src="img/logo1.png" class="logo1" alt=""></a>
                </nav>
            
            
                <div class="load"></div>
            
                <div id="risultati">
            
                </div>
            
                <script src='plugins/jquery/jquery.min.js'></script>
            
                <script type="module" src=client.js ></script>
            </body>
            `)
            
        console.log("sono stata chiamata")
       // window.location = "analyzer.html"
        const payload = {};
        //input = $("#input1");

        payload["url"] = url;

        //request(payload).then((resp)=>{
        //    console.log("resp " + resp);
        //});
        const $contenitore = $("#risultati");
        const $load = $(".load");
        if (payload["url"] != "") {

            fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then((response) => response.json())
                .then((data) => {
                    let html = "";
                    console.log(data[data.length - 1].result_of_video);
                    if (data[data.length - 1].result_of_video >= 0) {
                        $contenitore.css("background-color", "green");
                        html = "<h1> Lo Score del video è : " + data[data.length - 1].result_of_video + " ed è POSITIVO </h1>";
                    } else {
                        $contenitore.css("background-color", "red");
                        html = "<h1> Lo Score del video è : " + data[data.length - 1].result_of_video + " ed è NEGATIVO </h1> ";
                    }

                    $contenitore.html(html);
                    $load.css("display", "none");
                })

        }

    };

   
