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
    //regionCode: 'ita'
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

const makeVideoCard = (data, id) => {
    //console.log(data.id);
    videoCardContainer.innerHTML += `
    <div class="video" onclick="navigator.clipboard.writeText('https://youtube.com/watch?v=${id}');popUp()">    
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

function popUp() {
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}
//onclick=()=>{navigator.clipboard.writeText('https://youtube.com/watch?v=${data.id}')};
//<div class="video" onclick="copia(${data.id})"></div>
// search bar

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

//const search_url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
//&part=snippet&q=${search}&maxResults=${maxResults}&type=video`;
//https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=the%20show&type=video&videoType=any&key=AIzaSyBggO5YmBvsnDLIdno18ky8WNFK2E-MTfc


