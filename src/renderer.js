const youtubeDl = require("youtube-dl");
const { app } = require('electron').remote;
const path = require('path');
var urls = [];

function getMetadata() {
    let url = document.getElementById("url").value;
    youtubeDl.getInfo(url, undefined, (err, info) => {
        if (err) {
            document.getElementById("metadata").innerHTML = err;
        }
        urls.push(url);
        prependListElement(info, url);
    });
}

/*
    <li class="media">
        <img class="mr-3" src="..." alt="Generic placeholder image">
        <div class="media-body">
        <h5 class="mt-0 mb-1">List-based media object</h5>
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </div>
    </li>
*/
function prependListElement(info, url) {
    let li = document.createElement("li");
    li.setAttribute("class", "media");

    let img = document.createElement("img");
    img.setAttribute("class", "mr-3");
    img.setAttribute("src", info.thumbnail);
    img.setAttribute("width", "114");
    img.setAttribute("height", "64");

    let mediaBody = document.createElement("div");
    mediaBody.setAttribute("class", "media-body");

    let h5 = document.createElement("h5");
    h5.setAttribute("class", "mt-0 mb-1");

    let h5text = document.createTextNode(info.title);
    h5.appendChild(h5text);

    let descText = document.createTextNode(url);

    mediaBody.appendChild(h5);
    mediaBody.appendChild(descText);

    li.appendChild(img);
    li.appendChild(mediaBody);

    document.getElementById("media-list").prepend(li);
    document.getElementById("url").value = '';
}

function download() {
    let withVideo = document.getElementById("includeVideo").checked;
    app.get
    let outputPath = withVideo === true ? app.getPath('videos') : app.getPath('music');
    outputPath += '/%(title)s.%(ext)s';
    let params = [];
    if (withVideo === false) {
        params.push("-f bestaudio");
        params.push("-x");
    }
    console.log("downloading urls: ", urls.join(", "), " to : ", outputPath);

    if (withVideo === true) {
        youtubeDl.exec(urls.join(', '), [], { cwd: path.dirname(outputPath) }, function (err, output) {
            if (err) throw err;
            console.log(output.join('\n'));
        });
    } else {
        youtubeDl.exec(urls.join(", "), ['-x', '--audio-format', 'mp3'], { cwd: path.dirname(outputPath) }, function (err, output) {
            if (err) throw err;
            console.log(output.join('\n'));
        });
    }
    /*let video = youtubeDl(firstUrl, params, { cwd: __dirname });
    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
    });

    video.pipe(fs.createWriteStream('videos.' + ext));
    */
}

document.getElementById("add-btn").addEventListener('click', () => { getMetadata() });
document.getElementById("download-btn").addEventListener('click', () => { download() });
