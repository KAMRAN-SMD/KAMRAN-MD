<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KAMRAN-MD Deployment Guide - Premium Style</title>
  <style>
    /* ------------------- COLOR PALETTE & ANIMATION ------------------- */
    :root {
      --soft-white: #ffffff;
      --soft-bg: #f5f7fa;
      --text-dark: #1f2937;
    }

    /* Animation for smooth color cycling (for stylish light effect) */
    @keyframes hue-rotate {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }

    /* Animation for subtle background movement */
    @keyframes bg-move {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Animation for soft block glow */
    @keyframes soft-pulse {
      0% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 0 0px var(--neon-color-main); }
      50% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.2), 0 0 15px var(--neon-color-main); }
      100% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 0 0px var(--neon-color-main); }
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }

    /* ------------------- ELEGANT LUMINOSITY BACKGROUND ------------------- */
    body {
      background: linear-gradient(135deg, #FFDDE1 0%, #FAD0C4 25%, #E1FFD1 75%, #C3F4FF 100%);
      min-height: 100vh;
      color: var(--text-dark);
      padding: 40px 10px;
      background-size: 400% 400%;
      animation: bg-move 25s ease infinite alternate; /* Dheere-dheere move hone wala background */
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* ------------------- PREMIUM FROSTED GLASS CARD ------------------- */
    .main-container {
      width: clamp(350px, 90%, 750px);
      padding: 30px 40px;
      background: rgba(255, 255, 255, 0.6); /* Thoda transparent */
      border-radius: 35px;
      backdrop-filter: blur(15px); /* Frosted Glass Effect */
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2), 0 0 60px rgba(255, 255, 255, 0.8) inset;
      transition: all 0.5s ease;
      position: relative;
    }
    
    .main-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
    }

    /* ------------------- STYLISH TITLE AREA ------------------- */
    .title-area {
        text-align: center;
        margin-bottom: 25px;
        padding-bottom: 20px;
    }

    .main-h1 {
      font-size: 2.8rem;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
      /* Gradient Text */
      background: linear-gradient(90deg, #ff0077, #00ffff, #ff0077);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      /* Subtle Glow */
      text-shadow: 0 0 8px rgba(255, 0, 119, 0.3);
    }
    
    .typing-svg {
        display: block;
        margin: 0 auto 20px;
        max-width: 100%;
        height: auto;
        /* Smooth Color Change */
        filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.5));
        animation: hue-rotate 15s linear infinite;
    }

    .subtitle-code {
      text-align: center;
      margin: 10px 0 30px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      font-family: monospace;
      font-size: 1.0em;
      color: #6b7280;
      border: 1px dashed rgba(0, 0, 0, 0.1);
    }

    /* ------------------- IMAGE STYLING (CHAMAKNE WALA) ------------------- */
    .image-block {
      text-align: center;
      margin-bottom: 30px;
    }

    .profile-img {
      width: clamp(200px, 60%, 300px);
      border-radius: 25px;
      border: 4px solid var(--soft-white);
      
      /* Soft Pulsing Light Effect */
      --neon-color-main: #ff00ff;
      animation: soft-pulse 2.5s infinite alternate;
      transition: all 0.5s ease;
    }

    /* ------------------- STYLISH DEPLOYMENT BLOCKS ------------------- */
    .deployment-block {
      padding: 25px;
      border-radius: 20px;
      margin-bottom: 30px;
      background: rgba(255, 255, 255, 0.7);
      transition: all 0.3s ease;
      
      /* Base Soft Shadow */
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);

      /* Stylish Color Pulsing */
      --neon-color-main: #00ffff;
      animation: soft-pulse 3s infinite alternate;
      position: relative;
    }

    /* Magenta Pulse for the second block */
    .deployment-block:nth-child(3) {
      --neon-color-main: #ff00ff;
      animation: soft-pulse 3.5s infinite alternate;
    }

    .deployment-block:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), 0 0 20px var(--neon-color-main);
    }

    /* Inner Block for Fork Button */
    .inner-fork-block {
      background: rgba(0, 0, 0, 0.05);
      padding: 15px;
      border-radius: 15px;
      border-left: 5px solid #00ffff;
    }

    /* Link/Shield Styling */
    .link-group {
        display: flex;
        align-items: center;
        margin: 15px 0;
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .link-description {
        font-weight: 700;
        color: #555;
        margin-right: 10px;
        font-size: 1.1em;
    }
    
    /* Deployment Option Title */
    .deployment-title {
        text-align: center;
        margin-top: 40px;
        margin-bottom: 25px;
    }

    /* Step Titles */
    .step-title {
        text-align: center;
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 20px 0 10px;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .deploy-link-container {
        text-align: center;
        margin-top: 15px;
    }
    
    /* Media Query for Mobile */
    @media (max-width: 600px) {
        .main-container {
            padding: 20px;
        }
        .main-h1 {
            font-size: 2.2rem;
        }
    }
  </style>
</head>
<body>
  <div class="main-container">
    
    <div class="title-area">
      <!-- MAIN TITLE: Gradient aur Soft Glow ke Saath -->
      <h1 class="main-h1">KAMRAN-𝐌𝐃</h1>
      <img 
        src="https://readme-typing-svg.demolab.com?font=Black+Ops+One&size=100&pause=1000&color=ff0000&center=true&width=1000&height=200&lines=KAMRAN-MD-5.0" 
        alt="KAMRAN-MD-5.0 Typing SVG"
        class="typing-svg"
      />
    </div>

    <div class="subtitle-code">
      Dont forget to fork & star repo
    </div>

    <div class="image-block">
      <!-- Profile Image: Soft Chamakne Wali Border -->
      <img 
        src="https://files.catbox.moe/7dm3u4.jpg" 
        alt="KAMRAN-MD Bot Image" 
        class="profile-img"
      />
    </div>

    <p style="font-weight: 800; font-size: 1.3em; margin-bottom: 15px; text-align: center; color: #ff0077;">
        `DEPLOMENT STEPS`
    </p>

    <!-- Block 1: FORK REPO (Cyan Pulsing Light) -->
    <div class="deployment-block">
      <div class="inner-fork-block">
        <a href='https://github.com/KAMRAN-SMD/KAMRAN-MD/fork' target="_blank">
          <img src='https://img.shields.io/badge/FORK_REPO-FF5500?style=for-the-badge&logo=github&logoColor=white&labelColor=000000' alt="FORK REPO Shield"/>
        </a>
      </div>
    </div>

    <!-- Block 2: PAIR CODE OPTIONS (Magenta Pulsing Light) -->
    <div class="deployment-block">
        
      <div class="link-group">
        <span class="link-description">∞ KAMRAN ACCOUNT</span>
        <a href='https://github.com/KAMRAN-SMD' target="_blank">
          <img src='https://img.shields.io/badge/FOLLOW ACCOUNT-800080?style=for-the-badge&logo=matrix&logoColor=white&labelColor=000000' alt="FOLLOW ACCOUNT Shield"/>
        </a>
      </div>
      
      <div style="height: 1px; background: rgba(0, 0, 0, 0.1); margin: 15px 0;"></div>

      <div class="link-group">
        <span class="link-description">⚠️ OPTION ONE</span>
        <a href='https://kamran-md.onrender.com/pair' target="_blank">
          <img src='https://img.shields.io/badge/PAIR_CODE_1-FF7700?style=for-the-badge&logo=matrix&logoColor=white&labelColor=000000' alt="PAIR CODE 1 Shield"/>
        </a>
      </div>
      
      <div style="height: 1px; background: rgba(0, 0, 0, 0.1); margin: 15px 0;"></div>
      
      <div class="link-group">
        <span class="link-description">⚠️ OPTION TWO</span>
        <a href='https://kamran-md.onrender.com/pair' target="_blank">
          <img src='https://img.shields.io/badge/PAIR_CODE_2-FF00AA?style=for-the-badge&logo=matrix&logoColor=white&labelColor=000000' alt="PAIR CODE 2 Shield"/>
        </a>
      </div>

    </div>
    
    <div class="deployment-title">
        <img 
            src="https://readme-typing-svg.demolab.com?font=Black+Ops+One&size=100&pause=1000&color=ff0000&center=true&width=1000&height=200&lines=DEPLOYMENT.OPTION" 
            alt="DEPLOYMENT.OPTION Typing SVG"
            class="typing-svg"
        />
        <div style="height: 1px; background: rgba(0, 0, 0, 0.1); margin: 0 auto; width: 80%;"></div>
    </div>

    <!-- Step 2: HEROKU -->
    <h4 class="step-title">2. Heroku</h4>
    <p class="deployment-p">
      <div class="deploy-link-container">
        <a href='https://dashboard.heroku.com/new?template=https://github.com/KAMRAN-SMD/KAMRAN-MD/tree/main' target="_blank">
          <img alt='Heroku Deploy' src='https://img.shields.io/badge/-heroku ‎Deploy-FF00AA?style=for-the-badge&logo=Github&logoColor=white'/>
        </a>
      </div>
    </p>

    <!-- Step 1: TALKDROVE -->
    <h4 class="step-title">1. TalkDrove Free</h4>
    <p class="deployment-p">
      <div class="deploy-link-container">
        <a href='https://talkdrove.com/share-bot/11' target="_blank">
          <img alt='TalkDrove Deploy' src='https://img.shields.io/badge/-TalkDrove ‎ deploy-FF004D?style=for-the-badge&logo=heroku&logoColor=white'/>
        </a>
      </div>
    </p>
  
<b><strong><summary align="center" style="color: Yello;">EASIEST METHOD</summary></strong></b>
<p style="text-align: center; font-size: 1.2em;">
 

<h3 align="center"> HOW TO DEPLOY ON TALKDROVE</h3>
<h6 align-"center">
Create Account Here:

https://host.talkdrove.com/auth/signup?ref=9535F15A

Then Login
Claim 10 coins in wallet section
Locate where to deploy your bot
You will see a dashboard of bots listed 


Click next , next
Until you see KAMRAN MD
Then click on it

You will be asked to fill in some stuffs like your session Id , and other stuffs on how you want your bot to be ( bot settings ) , it's not hard I added examples


Get session I'd here:

https://kamran-md.onrender.com/pair

After you're done filling it
Click deploy button 

If you can't see any deploy button , switch the website to dark mode 

It will show

That's all bot connected

`DR KAMRAN OFC`</h6>
</details>

--------------


<h4 align="center">3. Koyeb</h4>
<p style="text-align: center; font-size: 1.2em;">


<p align="center">
<a href='https://app.koyeb.com/services/deploy?type=git&repository=KAMRAN-SMD/KAMRAN-MD[PREFIX]=.&env[SESSION_ID]=&env[ALWAYS_ONLINE]=false&env[MODE]=public&env[AUTO_STATUS_MSG]=Seen%20status%20by%20KAMRAN-MD&env[AUTO_STATUS_REPLY]=false&env[AUTO_STATUS_SEEN]=true&env[AUTO_TYPING]=false&env[ANTI_LINK]=true&env[AUTO_REACT]=false&env[READ_MESSAGE]=false' target="_blank"><img alt='Heroku' src='https://img.shields.io/badge/-koyeb ‎ deploy-FF009D?style=for-the-badge&logo=koyeb&logoColor=white'/< width=150 height=28/p></a>

-----
<h4 align="center">4. Railway</h4>
<p style="text-align: center; font-size: 1.2em;">

<p align="center">
<a href='https://railway.app/new' target="_blank"><img alt='Heroku' src='https://img.shields.io/badge/-railway deploy-FF8700?style=for-the-badge&logo=railway&logoColor=white'/< width=150 height=28/p></a>

-----

<h4 align="center">5. Render</h4>
<p style="text-align: center; font-size: 1.2em;">
  
<p align="center">
<a href='https://dashboard.render.com/web/new' target="_blank"><img alt='Heroku' src='https://img.shields.io/badge/-Render deploy-black?style=for-the-badge&logo=render&logoColot=white'/< width=150 height=28/p></a>
--------

<h4 align="center">6. ZIP FILE</h4>
<p style="text-align: center; font-size: 1.2em;">
  
<p align="center">
<a href='[https://www.mediafire.com/file/at7yp0spnfs5p35/KAMRAN-MD-main.kanran-smd/file](https://github.com/KAMRAN-SMD/KAMRAN-MD/archive/refs/heads/main.zip)' target="_blank"><img alt='Netlify' src='https://img.shields.io/badge/-zip file-CC00FF?style=for-the-badge&logo=huggingface&logoColor=white'/< width=150 height=28/p></a> </a>

<details>
  
<b><strong><summary align="center" style="color: Yello;">EASIEST METHOD 2</summary></strong></b>
<p style="text-align: center; font-size: 1.2em;">
 

<h3 align="center">DOWNLOAD ZIP FILE </h3>
<h6 align-"center">
*❄️ Deploy kamran xmd On bot-hosting For Free !*

`Specs :`
- v2 CPU
- 16GB RAM

> `Steps to deploy`

`Step 1`
1. Go to bot-hosting.co/join and create an account and verify your email too.

`Step 2`
1. Go to the https://bot-hosting.net/?aff=1338673948329508876

2. Tap on *three dots* _(as shown in image)_

3. Tap on *duplicate space* _(as shown in image)_

`Step 3`
1. Fill your details, e.g., Session ID, Bot Name, owner number etc...

2. Tap on *duplicate space shown below*

```After that wait 10 seconds & your have deployed it successfuly  for free 24/7```

> CREDITS KAMRAN-MD🎐

*by DR KAMRAN*</h6>

</details>

--------------


<h4 align="center">7. Replit</h4>
<p style="text-align: center; font-size: 1.2em;">

<p align="center">
<a href='https://replit.com/~' target="_blank"><img alt='Replit' src='https://img.shields.io/badge/-Replit Deploy-1976D2?style=for-the-badge&logo=replit&logoColor=white'/< width=150 height=28/p></a> </a>

 --------
 <h4 align="center">8. Workflow</h4>
<p style="text-align: center; font-size: 1.2em;">


<details>

<b><strong><summary align="center" style="color: Yello;">Deploy On Workflow</summary></strong></b>
<p style="text-align: center; font-size: 1.2em;">
 
<h8>Copy the workflow codes and then frok the repo edit config add session id then save and now click on repo action tag then click on start new workflow then paste workflow codes name them deploy and save the file</h8>
<h3 align-"center"> Important</h3>
<h6 align-"center">Attention! We do not take responsibility if your github account is suspended through this Deploy method, I advise you not to use this workflow deploy method in the latest github accounts, github accounts created a year or more ago have not received the risk of suspension so far, this works It will only be done for 6 hours, you need to update the code to reactivate it.</h6>

```
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm install

    - name: Start application
      run: npm start
```
</details> 

***
