// ==UserScript==
// @name         My Twitter
// @version      1.0
// @description  自分用Twitter
// @match        https://x.com/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /*設定*/

    const redirectStartPaths = ["/home"];
    const redirectIncludePaths = ["/communities/","/lists"];
    const blockElemSelectors = [//まるでセレクタの見本市
        //"[data-testid='AppTabBar_Explore_Link']",//検索とかのやつ
        "[data-testid='AppTabBar_Home_Link']",//ホーム
        "[aria-label='コミュニティ']",
        "[data-testid='premium-signup-tab']",//プレミアム
        "div:has(> [href='https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb'])",//広告
        "div:has(> [href='/i/monetization'])",//収益
        "div:has(> [href='/i/verified-orgs-signup'])",//認証済みの組織
        "div:has(> [href$='/lists'])",//リスト
        "div:has(> [href='/jobs'])",//仕事
    ];
    //おすすめユーザーをブロックするか否か
    const doBlockUserRecommend = true;

    //リダイレクトするユーザー名
    const userId = "humitami";

    /**/




    const redirect = ()=>{
        for(const path of redirectStartPaths){
            if (location.pathname.startsWith(path)) {
                window.location.replace(`https://x.com/${userId}`);
            }
        }
        for(const path of redirectIncludePaths){
            if (location.pathname.includes(path)) {
                window.location.replace(`https://x.com/${userId}`);
            }
        }
    }

    redirect();

    window.addEventListener('DOMContentLoaded', () => {

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
        //おすすめユーザーを消す
        const blockUserRecommend = ()=>{
            const 最後の水平線 = `[data-testid="cellInnerDiv"]:has(h2) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([href^="/i/connect_people?user_id="]) + :not(:has([data-testid="tweet"]))`;
            const 削除要素リスト = [
                `[data-testid="cellInnerDiv"]:has(h2) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([href^="/i/connect_people?user_id="]) + :not(:has([data-testid="tweet"])) > *`,
                `[data-testid="cellInnerDiv"]:has(h2) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([href^="/i/connect_people?user_id="]) > *`,
                `[data-testid="cellInnerDiv"]:has(h2) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) > *`,
                `[data-testid="cellInnerDiv"]:has(h2) + :has([data-testid="UserCell"]) + :has([data-testid="UserCell"]) > *`,
                `[data-testid="cellInnerDiv"]:has(h2) + :has([data-testid="UserCell"]) > *`,
                `[data-testid="cellInnerDiv"]:has(h2) > *`
            ];
            if(document.querySelectorAll(最後の水平線).length===1){
                for(const query of 削除要素リスト){
                    let elems = document.querySelectorAll(query);
                    if(elems.length>0){
                        for(const elem of Array.from(elems)){
                            elem.remove();
                        }
                    }
                }
            }
        }

        const blockSideBarExceptSearch = ()=>{
            if(document.querySelectorAll("[aria-label='トレンド'] > * > *")){
                let elems = document.querySelectorAll("[aria-label='トレンド'] > * > :not(:has([data-testid='SearchBox_Search_Input_label'])) > *");
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
            blockSideBarExceptSearch();
            if(doBlockUserRecommend)blockUserRecommend();
        });
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true
        });
    });
})();
