"use strict";

const card = document.querySelector(".card");

let score = 0;
let ques_no = 1;
let highscore = 0;
const addQuestion = function (ques, ans1, ans2, ans3, ans4, s, hs) {
  const cardhtml = `
    <button class="my_btn restart_btn resetBtn">RESET</button>
    <div class="score_container">
      <p>Score: <span>${s}</span></p>
      <p>Highscore: <span>${hs}</span></p>
      </div>
      <p class="of_line">${ques_no} fo 15</p>
    <div class="question_box">
      <p>${ques}</p>
    </div>
    <div class="answer_container">
      <button id="option_1" class="my_btn">${ans1}</button>
      <button id="option_2" class="my_btn">${ans2}</button>
      <button id="option_3" class="my_btn">${ans3}</button>
      <button id="option_4" class="my_btn">${ans4}</button>
    </div>
    `;
  card.insertAdjacentHTML("beforeend", cardhtml);
};
//===================
const losingMsg = function (msg) {
  const cardhtml = `
    <div class="gameover_container">
      <p class="gameover_line">GAME OVER</p>
      <p class="gameover_line">your score :<span> ${score}</span></p>
      <p class="gameover_line">Highscore :<span> ${highscore}</span></p>
      <p class="gameover_line more_mg">${msg}</p>
     
      </div>
    `;
  card.insertAdjacentHTML("beforeend", cardhtml);
};
//===================
const winingMsg = function (msg) {
  const cardhtml = `
    <div class="gameover_container">
      <p class="gameover_line more_mg" style="font-size:3rem;">${msg}</p>
      </div>
    `;
  card.insertAdjacentHTML("beforeend", cardhtml);
};
//=========================
const renderError = function (headMsg = "error", complErr = "error") {
  card.innerHTML = "";
  const cardhtml = `
  <div class="gameover_container">
    <p class="gameover_line">${headMsg}</p>
    <p class="of_line">${complErr}</p>

    </div>
  `;
  card.insertAdjacentHTML("beforeend", cardhtml);
};
//=========================
const requestingDataAgain = function () {
  setTimeout(function () {
    ques_no = 1;
    score = 0;
    card.innerHTML = "";

    requestingData();
  }, 1000);
};
//=========================
const incOrder = function (data) {
  try {
    const myData = data.results[ques_no - 1];
    let optionsArr = [];

    const answerArr = [
      myData.correct_answer,
      myData.incorrect_answers[0],
      myData.incorrect_answers[1],
      myData.incorrect_answers[2],
    ];

    optionsArr.push(answerArr.splice(Math.floor(Math.random() * 4), 1));
    optionsArr.push(answerArr.splice(Math.floor(Math.random() * 3), 1));
    optionsArr.push(answerArr.splice(Math.floor(Math.random() * 2), 1));
    optionsArr.push(answerArr.splice(0, 1));
    addQuestion(
      myData.question,
      optionsArr[0],
      optionsArr[1],
      optionsArr[2],
      optionsArr[3],
      score,
      highscore
    );
    const option_1_btn = document.getElementById("option_1");
    const option_2_btn = document.getElementById("option_2");
    const option_3_btn = document.getElementById("option_3");
    const option_4_btn = document.getElementById("option_4");
    const resetBtn = document.querySelector(".resetBtn");
    const allOptions = [option_1_btn, option_2_btn, option_3_btn, option_4_btn];

    for (let i = 0; i < allOptions.length; i++) {
      allOptions[i].addEventListener("click", function () {
        const clickedAns = allOptions[i].innerText;
        if (clickedAns === myData.correct_answer) {
          score += 5;
          highscore = score;
          ques_no++;
          if (ques_no === 16) {
            card.innerHTML = "";
            winingMsg("You Won");
          } else {
            card.innerHTML = "";
            incOrder(data);
          }
        }
        if (clickedAns != myData.correct_answer) {
          if (score > highscore) {
            highscore = score;
          }
          card.innerHTML = "";
          losingMsg("Restart....");
          requestingDataAgain();
        }
      });
    }

    //=============
    // reset funtionallty
    resetBtn.addEventListener("click", function () {
      card.innerHTML = "";
      console.log("me");
      losingMsg("Restart....");
      requestingDataAgain();
    });
    //=============
  } catch (err) {
    renderError(
      "Try Again!",
      "Somthing went wrong. Not able to get data from server"
    );
  }
};

//=========================
const requestingData = function () {
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://opentdb.com/api.php?amount=15&category=27&type=multiple`
  );
  try {
    request.send();
  } catch (err) {
    renderError("Sorry! ☹", "Unable to connect to the Internet");
  }
  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    incOrder(data);
  });
};
window.addEventListener("load", function () {
  requestingData();
});
