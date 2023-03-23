const puppeteer = require('puppeteer');
const fetch= require('node-fetch');
require("dotenv").config();
let browser = "";
const port = process.env.PORT || 3000;
var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors())

const browserPromise = puppeteer.launch({
    headless:true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });



browserPromise.then(async browserResult => {
    browser=browserResult;
app.listen(port, () => {
      console.log(`Servidor de Express escuchando en el puerto ${port}`);
    });
console.log("el navegador esta lanzado")

  })
  .catch(error => {
    console.error('Error al lanzar el navegador:', error);
  });


async function searchVideoByUrl(videoUrl) {
    var page = await browser.newPage();
    await page.goto(videoUrl);
    //await page.screenshot({"path":"y2mate-search.jpg"});
var resp= {};
await page.screenshot()
  .then(async (screenshotBuffer) => {
    const base64Image = screenshotBuffer.toString('base64');
     var payload = {
        archivo_name: "capturay2mate.jpg",
        file_mime: "image/jpeg",
        archivo_base64: base64Image 
      };

      var result = await fetch(
        'https://script.google.com/macros/s/AKfycbz9GV4R7FOQOoTukIl8RDmdqw_sOy00z8H1IJDgA8dCQIMCbxO031VFF4TbwjSqBf0PIg/exec',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )
        .then((res) => res.json())
        .then((res) => {

resp = res;}
);
  })
  .catch((error) => {
    console.log('Error al capturar la pantalla:', error);
  });
    await page.close();
    return resp;
}
/*
(async ()=>{
browserPromise.then(async browserResult => {
        browser=browserResult;
setTimeout(async ()=>{
	var result= await searchVideoByUrl("https://www.youtube.com/watch?v=Qh4-hTA-Xgg")
console.log(result)
},2000)


  })
  .catch(error => {
    console.error('Error al lanzar el navegador:', error);
  });


})()

*/



app.get('/searchByUrl/:videoUrl',async function (req, res, next) {


	  const videoUrl = decodeURIComponent(req.params.videoUrl);
	console.log(videoUrl )
	var result= await searchVideoByUrl(videoUrl );
res.json(result)

	
})

