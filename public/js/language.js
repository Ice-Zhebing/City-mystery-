(function () {
  'use strict';

  const storageKey = 'city-mystery-language';
  const strings = window.CITY_ZH_STRINGS;
  const attributes = ['aria-label', 'aria-roledescription', 'alt', 'title', 'placeholder'];
  const untouched = 'script, style, noscript, .maplibregl-map, .account-button-name, #account-name, #account-password';
  let chinese = false;
  try {
    chinese = localStorage.getItem(storageKey) === 'zh-CN';
  } catch (_) {}
  const locale = chinese ? 'zh-CN' : 'en-GB';
  document.documentElement.lang = chinese ? 'zh-CN' : 'en';

  function word(value) {
    return Object.hasOwn(strings, value) ? strings[value] : value;
  }

  function formatMeasures(text) {
    return text
      .replace(/(\d+) hr\b/g, '$1 小时')
      .replace(/(\d+) min\b/g, '$1 分钟')
      .replace(/(\d+(?:\.\d+)?) km\b/g, '$1 公里')
      .replace(/(\d+) m\b/g, '$1 米');
  }

  const patterns = [
    [/^(.+) · My Trip — City Mystery$/, city => word(city) + '行程 — 城市盲盒'],
    [/^(.+) trip$/, city => word(city) === city ? city + ' trip' : word(city) + '行程'],
    [/^(.+) city view$/, city => word(city) + '城市风景'],
    [/^(.+) in (Edinburgh|London|York|Brighton|Bristol|Cambridge|Liverpool|Oxford)$/, (place, city) => word(city) + '的' + word(place)],
    [/^(.+), (England|Scotland)$/, (city, country) => word(city) + '，' + word(country)],
    [/^(.+) · (Edinburgh|London|York|Brighton|Bristol|Cambridge|Liverpool|Oxford|England|Scotland|United Kingdom)$/i,
      (place, area) => word(place) + ' · ' + word(area)],
    [/^(\d+) of (\d+): (.+)$/, (index, total, label) => '第 ' + index + ' 张，共 ' + total + ' 张：' + localize(label)],
    [/^Show (.+) on the map$/, place => '在地图上查看' + word(place)],
    [/^Show (.+)$/, label => '显示' + localize(label)],
    [/^Reveal a city to unlock this (sight|food) card$/, group => '先抽城市，再抽' + (group === 'sight' ? '景点' : '美食')],
    [/^Reveal (sight|food) (\d+)$/, (group, index) => '抽第 ' + index + ' 张' + (group === 'sight' ? '景点' : '美食') + '卡'],
    [/^Draw a different (sight|food stop) instead of (.+)$/, (group, place) => '换一张' + (group === 'sight' ? '景点' : '美食') + '卡，替换' + word(place)],
    [/^Find a flavour in (.+)\.$/, city => '来尝尝' + word(city) + '的味道。'],
    [/^A sight waiting for you in (.+)\.$/, city => '下一站，去看看' + word(city) + '的风景。'],
    [/^(\d+) discoveries in (.+)$/, (count, city) => '在' + word(city) + '逛 ' + count + ' 个景点'],
    [/^(\d+) of (\d+) discoveries revealed in (.+)\.$/, (count, total, city) => '已抽出 ' + count + ' / ' + total + ' 张' + word(city) + '卡片'],
    [/^Your city is (.+)\. Your sight and food cards are ready to reveal\.$/, city => '你抽到了' + word(city) + '，接着抽景点和美食吧。'],
    [/^(Sight|Food stop) revealed: (.+)\.$/, (group, place) => '抽到了' + (group === 'Sight' ? '景点' : '美食') + '：' + word(place)],
    [/^(\d+) sights?$/, count => count + ' 个景点'],
    [/^(\d+) food stops?$/, count => count + ' 家餐饮店'],
    [/^(\d+) of (\d+) sight stamps collected$/, (count, total) => '邮戳已收集 ' + count + ' / ' + total + ' 枚'],
    [/^(.+), spread (\d+) of (\d+)$/, (city, index, total) => word(city) + '，第 ' + index + ' 组，共 ' + total + ' 组'],
    [/^(.+) travel stamp$/, place => word(place) + '旅行邮戳'],
    [/^VISITED · (.+)$/, date => '已到访 · ' + date],
    [/^Walk (\d.*)$/, detail => '步行 ' + formatMeasures(detail)],
    [/^(\d+(?:\.\d+)? (?:hr|min|km|m)(?: \d+ min)?)$/, formatMeasures]
  ];

  function localize(text) {
    const direct = word(text);
    if (direct !== text) return direct;
    for (const [pattern, translate] of patterns) {
      const match = pattern.exec(text);
      if (match) return translate(...match.slice(1));
    }
    return text;
  }

  function translate(text) {
    if (!chinese || !text) return text;
    const trimmed = text.trim();
    return trimmed ? text.replace(trimmed, () => localize(trimmed)) : text;
  }
  window.CityLanguage = {locale, translate};

  function translateElement(element) {
    for (const attribute of attributes) {
      if (!element.hasAttribute(attribute)) continue;
      const original = element.getAttribute(attribute);
      const localized = translate(original);
      if (original !== localized) element.setAttribute(attribute, localized);
    }
  }

  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest(untouched)) return;
      const localized = translate(node.data);
      if (node.data !== localized) node.data = localized;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || node.closest(untouched)) return;

    translateElement(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(child) {
        if (child.nodeType === Node.ELEMENT_NODE && child.matches(untouched)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const child = walker.currentNode;
      if (child.nodeType === Node.TEXT_NODE) translateNode(child);
      else translateElement(child);
    }
  }

  function installMenu() {
    const header = document.querySelector('.header-inner');
    if (!header) return;
    const account = header.querySelector(':scope > .team-mark');
    const actions = document.createElement('div');
    actions.className = 'header-actions';
    header.append(actions);
    const menu = document.createElement('details');
    menu.className = 'language-menu';
    menu.innerHTML = '<summary>Language <span aria-hidden="true">⌄</span></summary>'
      + '<div class="language-options"><button type="button" lang="zh-CN" data-language="zh-CN">简体中文</button>'
      + '<button type="button" lang="en" data-language="en">English</button></div>';
    actions.append(menu);
    if (account) actions.append(account);
    menu.querySelectorAll('[data-language]').forEach(button => {
      const selected = button.dataset.language === (chinese ? 'zh-CN' : 'en');
      button.setAttribute('aria-pressed', String(selected));
      button.addEventListener('click', () => {
        menu.open = false;
        if (selected) return;
        try {
          localStorage.setItem(storageKey, button.dataset.language);
          location.reload();
        } catch (_) {}
      });
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  installMenu();
  if (!chinese) return;
  translateNode(document.documentElement);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const node of record.addedNodes) translateNode(node);
      } else if (record.type === 'characterData') {
        translateNode(record.target);
      } else if (!record.target.closest(untouched)) {
        translateElement(record.target);
      }
    }
  });
  observer.observe(document.documentElement, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: attributes
  });
}());
