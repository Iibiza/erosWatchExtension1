const PORT = process.env.PORT || 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require("cors");



const baseURL = "https://sxyprn.com/popular/";
const corsOptions = {
    origin: "https://flutterspanlapp-api.vercel.app/", // Replace with the origin(s) you want to allow
    credentials: true, // Allow sending cookies and other credentials
    allowedHeaders: [
      "Origin",
      "Content-Type",
      "X-Amz-Date",
      "Authorization",
      "X-Api-Key",
      "X-Amz-Security-Token",
      "locale",
    ],
    methods: "POST, OPTIONS, GET", // Specify the allowed HTTP methods
  };
  
  app.use(cors(corsOptions));
  

// app.use(cors());

app.get("/", (req, res) => {
  let info = {
    popular: `http://localhost:${PORT}/api/popular/page=:page`,
    movies: `http://localhost:${PORT}/api/movies/page=:page`,
    recentlyAadded: `http://localhost:${PORT}/api/recently-added/drama/page=:page`,
    kshow: `http://localhost:${PORT}/api/kshow/page=:page`,
    search: `http://localhost:${PORT}/api/search/:word/:page`,
    episode_link: `http://localhost:${PORT}/api/watching/:id`,

    recently_added: `http://localhost:${PORT}/api/recentlyadded/:page`,
  };
  res.send(info);
});

app.get("/api/trending", (req, res) => {
    // const page = req.query.page || '1';
    // const quality = req.query.quality || 'all';
    // const duration = req.query.duration || 'all';
    const type = req.query.type || 'top-pop.html?p=all';//latest-updates
  const allCoupon = `${baseURL}/${type}`;
  //  const quality = "hd , fhd , uhd , all"
  //  const duration = "10 , 20 , 40 , all"

  axios(allCoupon)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const allCoupon = [];

      $(".main_content  > div > .post_el_small").each(function (index, element) {
        const title = $(this).find('post_text').text();

        const id = $(this).find('a').attr("href");
        const dataId = $(this).find('post_text').text();
        const image = $(this).find(" .vid_container > .post_vid_thumb > a > img").attr("data-src");
        const preview = $(this)
          .find(" .vid_container > .post_vid_thumb > a > video")
          .attr("src");
        const duration = $(this).find(".vid_container > .post_vid_thumb > .duration_small ").text();
      
        const quality = $(this)
          .find(".vid_container > .post_vid_thumb > shd_small")

          .text();

        const percentage = $(this).find(".post_control > .post_control_time").text();
        const views = $(this).find(".post_control > .post_control_time ").text();
        const time = $(this).find(" .post_control > .post_control_time ").text();

        allCoupon.push({
          title,
          dataId,
          id,
          image,
          preview,
          duration,
          quality,
          percentage,
          views,
          time,
        });
      });
      res.json(allCoupon);
    })
    .catch((err) => console.log(err));
});



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
