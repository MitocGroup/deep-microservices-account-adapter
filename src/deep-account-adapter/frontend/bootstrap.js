/* global System */
'use strict';
'format es6';

export function loadFirst() {
  let scripts = [];

  return Promise.all(scripts);
}

export default function account() {
  return System.import('/deep-account-adapter/js/app/angular/index.js');
}
