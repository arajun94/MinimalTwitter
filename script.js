// ==UserScript==
// @name         My Twitter
// @version      1.0
// @description  自分用Twitter
// @match        https://x.com/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const blockStartPaths = ["/home","/explore"];
    const blockIncludePaths = ["/communities/","/lists"];
    const blockElemSelectors = [//まるでセレクタの見本市
        "[aria-label='トレンド'] > * > div:not(:has(> * > * > * > [aria-label='検索']))",//右のやつ検索以外
        "[data-testid='AppTabBar_Explore_Link']",//検索とかのやつ
        "[data-testid='AppTabBar_Home_Link']",//ホーム
        "[aria-label='コミュニティ']",
        "[data-testid='premium-signup-tab']",//プレミアム
        "div:has(> [href='https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb'])",//広告
        "div:has(> [href='/i/monetization'])",//収益
        "div:has(> [href='/i/verified-orgs-signup'])",//認証済みの組織
        "div:has(> [href$='/lists'])",//リスト
        "div:has(> [href='/jobs'])"//仕事
    ];

    const css = `
    [data-testid='tweetText'],[data-testid='tweetTextarea_0RichTextInputContainer'],[data-testid="UserDescription"]  {
        line-height:1.75em;
    }
    `;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);

    const userId = "humitami";

    const redirect = ()=>{
        for(const path of blockStartPaths){
            if (location.pathname.startsWith(path)) {
                window.location.replace(`https://x.com/${userId}`);
            }
        }
        for(const path of blockStartPaths){
            if (location.pathname.includes(path)) {
                window.location.replace(`https://x.com/${userId}`);
            }
        }
    }

    const blockElem = ()=>{
        for(const query of blockElemSelectors){
            let elems = document.querySelectorAll(query);
            if(elems.length>0){
                for(const elem of Array.from(elems)){
                    elem.remove();
                }
            }
        }
    }

    const observer = new MutationObserver(()=>{
        redirect();
        blockElem();
    });

    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true
        });
    });
})();
