const express = require("express");

const app = express();

const database = require("./my_modules/database");
const { MongoClient } = require('mongodb')

const PORT = 8080;

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//app.get("/api/data", (req, res) => {
// res.json(database.getRisultato());
//});



app.post("/api/data", async (req, res) => {
  const newData = req.body;
  console.log("sono qui")
  //database.insertUrl(newData);
  //res.json({error : false});

  analyzer(newData, res);
  //console.log("x: " + x);


});

app.listen(PORT, () => {
  console.info("Il server web è avviato sulla porta", PORT);
});

const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');

const ffmpeg = require('ffmpeg-static')

const deepgram = new Deepgram("84de60a0686d56664c5bd6e8faacae5d1f5a435f")
const YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: './',
  youtubeVideoQuality: 'highestaudio'
})

var sentiment = require('wink-sentiment');
//var sentiment = new Sentiment();




function analyzer(data, res) {

 

  let url = data.url + "&";
  console.log("url: " + url);
  let id_video = url.substring(url.indexOf('?') + 3, url.indexOf('&'));
  console.log("id: " + id_video);


  fs.readFile('data.txt', 'utf-8', function read(err, data) {
    if (err) {
      throw err;
    }
    arr = data.split(' ');
    console.log(arr)
    let trovato = 0
    for (i = 0; i < arr.length; i++) {
      console.log(arr[i] + " " + id_video)
      if (arr[i].localeCompare(id_video) == 0) {
        trovato = 1
        console.log("gia fatto" + arr[i + 1])
        let ressp = {
          'result_of_video': arr[i + 1]

        }
        database.insertRisultato(ressp);
        res.json(database.getRisultato())
        break;

      }
    }
      if (trovato == 0) {
        console.log("eh nooooo")

        const YD = new YoutubeMp3Downloader({
          ffmpegPath: ffmpeg,
          outputPath: './',
          youtubeVideoQuality: 'highestaudio'
        })

        YD.download(id_video)

        YD.on('progress', data => {
          console.log(data.progress.percentage + '% downloaded')
        })

        YD.on('finished', async (err, video) => {
          console.log("video" + video);
          let videoFileName = video.file 
          console.log(videoFileName)
          console.log(`Downloaded ${videoFileName}`)

          let file = {
            buffer: fs.readFileSync(videoFileName),
            mimetype: 'audio/mp3'
          }

          console.log("file: " + file);
          let options = {
            punctuate: true, language: "it"
          }

          let result = await deepgram.transcription.preRecorded(file, options).catch(e => console.log(e))
          let transcript = result.results.channels[0].alternatives[0].transcript

          let sentimento = sentiment(transcript);
          console.dir(sentimento);
          //a.WriteLine(id_video + " " + sentimento.score);
          //database.insertRisultato(sentimento.score);

          let ressp = {
            'result_of_video': sentimento.score
          }


          database.insertRisultato(ressp);

          //fs.writeFileSync(`${videoFileName}.txt`, transcript, () => `Wrote ${videoFileName}.txt`)
          fs.appendFile('data.txt', id_video + " " + sentimento.score + " ", () => `Wrote ${videoFileName}.txt`);
          fs.unlinkSync(videoFileName)
          res.json(database.getRisultato())


        })
        
      }
    



   


  })
}
