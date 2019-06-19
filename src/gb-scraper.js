'use strict';

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const gbScraper = async project => {
  return await fetch(`https://gb.kyivcity.gov.ua/projects/11/${project}`)
  .then(res => res.text())
  .then(body => {
    const countLabelContainers = [
      ...new JSDOM(body)
      .window
      .document
      .getElementsByClassName('votes-count')
    ];
    if (countLabelContainers.length !== 1) {
      // TODO: FATAL site change
    }
    const labels = countLabelContainers[0]
    .getElementsByTagName('strong');  
    if (labels.length !== 1) {
      // TODO: FATAL site change
    }
    return labels[0].textContent;
  });
};

module.exports = gbScraper;