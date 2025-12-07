const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "music");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Static public files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// HOME PAGE
app.get("/", (req, res) => {
    res.render("index");
});

// MUSIC PAGE
app.get("/music", (req, res) => {
    res.render("music");
});

// UPLOAD SONG
app.post("/upload", upload.single("song"), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: "No file uploaded" });
    }
    res.json({ success: true, file: req.file.filename });
});

// LIST MUSIC
app.get("/list-music", (req, res) => {
    const musicPath = path.join(__dirname, "music");

    fs.readdir(musicPath, (err, files) => {
        if (err) return res.json([]);

        // Only show mp3 files
        const mp3Files = files.filter(file => file.endsWith(".mp3"));

        res.json(mp3Files);
    });
});


app.listen(PORT, () => {
    console.log("Dougify running on port " + PORT);
});
