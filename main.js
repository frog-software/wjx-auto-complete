// ==UserScript==
// @name        问卷星自动填写信息
// @version     0.2
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
  // 信息名称匹配模式，默认模糊匹配
  const exactMatch = false;

  // 个人信息
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
    }
  ]

  const fillInfo = () => {
    Array.from(document.getElementsByClassName("div_question")).forEach((question) => {
      const title = question.getElementsByClassName("div_title_question")?.[0]?.innerText;
      const textarea = question.getElementsByTagName("textarea")?.[0];
      const select = question.getElementsByTagName("select")?.[0];
      const ulradiocheck = question.getElementsByClassName("ulradiocheck")?.[0];

      const correspondingInfo = personalInfo.find(i => (
        exactMatch ? title === i.key : title.includes(i.key)
      ))

      if (correspondingInfo && textarea) {
        textarea.innerText = correspondingInfo.content
      } else if (correspondingInfo && select){
        // selection
      } else if (correspondingInfo && ulradiocheck) {
        // radio
        Array.from(ulradiocheck.getElementsByTagName("li")).forEach((list) => {
          const input = list.getElementsByTagName("input")[0]
          const label = list.getElementsByTagName("label")[0]
          const anchor = list.getElementsByTagName("a")[0]

          if (exactMatch ? label.innerText === correspondingInfo.content : label.innerText.includes(correspondingInfo.content)) {
            input.checked = true
            anchor.className += " jqChecked"
          }
        })
      } else {
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