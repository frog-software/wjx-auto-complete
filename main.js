// ==UserScript==
// @name        问卷星自动填写信息
// @version     1.0
// @description 问卷星自动填写个人信息并提交
// @author      Charlie Chiang
// @include     https://www.wjx.top/*/*.aspx
// @include     https://www.wjx.cn/*/*.aspx
// @namespace   http://tampermonkey.net/
// ==/UserScript==

(() => {
  'use strict';
  // 是否自动提交，true为自动提交，false为手动提交
  const autoPost = false;
  // 提交时间，默认2000毫秒，即2秒
  const time = 2000;
  // 题目匹配模式，默认模糊匹配
  const exactMatchForTitle = false;
  // 答案匹配模式（单选或下拉选择），默认模糊匹配
  const exactMatchForAnswer = false;

  // 个人信息，可以按照格式随意增加或减少
  const personalInfo = [
    {
      key: "学院",
      content: "计算机学院"
    },
    {
      key: "学号",
      content: "2021202120"
    },
    {
      key: "姓名",
      content: "张三"
    },
    {
      key: "专业",
      content: "软件工程"
    },
    {
      key: "班级",
      content: "333"
    },
    {
      key: "手机号",
      content: "13333333333"
    },
    {
      key: "性别",
      content: "男"
    }
  ]

  const fillInfo = () => {
    Array.from(document.getElementsByClassName("div_question")).forEach((question) => {
      const title = question.getElementsByClassName("div_title_question")?.[0]?.innerText;
      const textarea = question.getElementsByTagName("textarea")?.[0];
      const select = question.getElementsByTagName("select")?.[0];
      const ulradiocheck = question.getElementsByClassName("ulradiocheck")?.[0];

      const correspondingInfo = personalInfo.find(i => (
        exactMatchForTitle ? title === i.key : title.includes(i.key)
      ))

      let hasFilled = false

      if (correspondingInfo && textarea) {
        textarea.innerText = correspondingInfo.content
        hasFilled = true
      } else if (correspondingInfo && select) {
        const select = question.getElementsByTagName("select")?.[0]
        Array.from(select.getElementsByTagName("option")).forEach((option) => {
          if (exactMatchForAnswer
            ? option.innerText === correspondingInfo.content
            : option.innerText.includes(correspondingInfo.content)) {
            select.value = option.value
            const textbox = Array.from(question.getElementsByTagName("span")).filter((spn) => (
              spn.getAttribute("role") === "textbox"
            ))?.[0]

            textbox.innerText = option.innerText
            hasFilled = true
          }
        })
      } else if (correspondingInfo && ulradiocheck) {
        Array.from(ulradiocheck.getElementsByTagName("li")).forEach((list) => {
          const input = list.getElementsByTagName("input")[0]
          const label = list.getElementsByTagName("label")[0]
          const anchor = list.getElementsByTagName("a")[0]

          if (exactMatchForAnswer
            ? label.innerText === correspondingInfo.content
            : label.innerText.includes(correspondingInfo.content)) {
            input.checked = true
            anchor.className += " jqChecked"
            hasFilled = true
          }
        })
      }

      if (!hasFilled) {
        question.style.background = "#F9FCBA"
      }
    })
  }

  const scrollDown = () => {
    try {
      const scrollvalue = document.getElementById("submit_button").offsetParent.offsetParent.offsetTop;
      window.scrollTo({
        top: scrollvalue,
        behavior: "smooth"
      });
    } catch (error) { }

    if (autoPost) {
      setTimeout(function () {
        document.getElementById("submit_button").click();
        console.log("提交成功!");
      }, time);
    } else { console.warn("自动提交已关闭，请手动开启") }
  }


  fillInfo();
  scrollDown();
})();