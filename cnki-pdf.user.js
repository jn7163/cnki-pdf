// ==UserScript==
// @name        CNKI PDF Download
// @description 中国知网 PDF 下载
// @author      Arnie97
// @version     2018.05.25
// @license     MIT
// @grant       none
// @namespace   https://github.com/Arnie97
// @homepageURL https://github.com/Arnie97/cnki-pdf
// @supportURL  https://greasyfork.org/scripts/368399
// @match       *://*.cnki.net/*
// @include     *://*.cnki.net.*/*
// @include     *://*/kns*/brief/*
// @include     *://*/grid2008/brief/*
// @include     *://*/detail/detail.aspx*
// @exclude     *://image.cnki.net/*
// @exclude     *://*/frame/*
// ==/UserScript==

((_, $) => {
    const host = 'gb.oversea.cnki.net';
    const hash = '#pdfDownload';

    console.debug(location.href);
    if (!location.pathname.includes('detail.aspx')) {
        $('a').forEach(i => {
            if (!i.href.includes('download.aspx')) {
                return;
            }
            let a = i.parentNode.appendChild(i.cloneNode());

            if (a.href.includes('&dflag')) {
                a.href = a.href.replace('nhdown', 'pdfdown');
            } else {
                a.href += '&dflag=pdfdown';
            }

            // change the icon color
            a.classList.add('briefDl_D');
            a.classList.remove('briefDl_Y');
        });
    } else if (_.title.endsWith(' - 中国知网')) {
        $('.dllink>a').forEach(a => {
            if (!a.href.includes('download.aspx')) {
                return;
            } else if (a.text.includes('整本下载')) {
                a.text = 'CAJ 下载';
            } else if (a.text.includes('分页下载')) {
                a.text = 'PDF 下载';
                a.target = 'framecatalog_CkFiles';
                a.href = location.href.replace('kns.cnki.net', host);
                window.open(a.href, a.target);  // preload the page
                a.href += hash;
            }
        });
    } else if ($('li.pdf').length) {
        if (location.hostname !== host) {
            return;
        }
        window.addEventListener('hashchange', () => {
            if (location.hash.endsWith(hash)) {
                location.href = $('.pdf>a')[0].href;
            }
        });
    } else {
        $('li.readol').forEach(li => {
            let a = _.createElement('a');
            a.text = 'PDF 下载';
            a.href = li.firstChild.href.replace('readonline', 'pdfdown');
            let liPDF = _.createElement('li');
            liPDF.setAttribute('class', 'pdf');
            liPDF.appendChild(a);
            li.parentNode.insertBefore(liPDF, li);
        });
    }
})(document, selector => Array.from(document.querySelectorAll(selector)));
