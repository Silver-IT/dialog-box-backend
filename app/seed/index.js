const mongoose = require('mongoose');
const fs = require("fs");
const Collection = require("../models/collection");
const Aboutus = require("../models/aboutus");
const Charity = require("../models/charity");

const aboutus_content = `<p style="text-align: center;"><span style="font-size: 12pt;">Hi! </span></p>
<p style="text-align: center;"><span style="font-size: 12pt;">We are a group of creators that like to hang out with each other. Since most of us are working in fields connected to graphics design, we felt like our conversations lacked a bit of imagery. That&rsquo;s why we decided to make this project in our free time. </span></p>
<p style="text-align: center;"><span style="font-size: 12pt;">We present to you the dialog box - a place, in which you can literally see our abstract thoughts and unique, free takes on different topics. A lot of things in the current world seem absurd and you can definitely see it in our &ldquo;boxes&rdquo;. After a few months of making the designs together we feel like we are ready to share it with you! </span></p>
<p style="text-align: center;"><span style="font-size: 12pt;">Each piece in dbox tells some story or captures certain feeling, we would love you to try and interpret it yourself! In the end the dialog is what started it and we are very happy to hear and discuss everyone&rsquo;s feelings about different things, hope we can hear from you through our socials!</span></p>
<p style="text-align: center;">&nbsp;</p>
<p style="text-align: right;"><em><strong><span style="font-size: 12pt;">~ Famous Development Team</span></strong></em></p>`;

const charity_content = `<p style="text-align: center;">There is a lot of things in this world, which don&rsquo;t get the needed attention.</p>
<p style="text-align: center;">We hope we can bring the awareness to certain issues by making graphics about them, but we thought about other ways to contribute in some way.</p>
<p style="text-align: center;">We decided to give up 50% of the dialog box profits to the charity.</p>
<p style="text-align: center;">Organisations will be chosen depending on the topic of the given series, we are very open to contributing to different issues all around the world.</p>
<p style="text-align: center;">That&rsquo;s why we want to hear on this topic from you as well!</p>
<p style="text-align: center;">In this project you have the opportunity to have a say in where we donate the money.</p>`;

module.exports = async () => {
    await Collection.deleteMany();
    await Aboutus.deleteMany();
    await Charity.deleteMany();

    await Aboutus.insertMany({ content: aboutus_content });
    console.log("Aboutus content is seeded successfully!");

    await Charity.insertMany({ content: charity_content });
    console.log("Charity content is seeded successfully!");

    mongoose.disconnect();
};