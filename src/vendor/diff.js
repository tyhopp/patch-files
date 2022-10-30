/*
diff@5.1.0

Software License Agreement (BSD License)

Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function e(e,n,t){let o=!0,i=!1,l=!1,s=1;return function r(){if(o&&!l){if(i?s++:o=!1,e+s<=t)return s;l=!0}if(!i)return l||(o=!0),n<=e-s?-s++:(i=!0,r())}}function n(n,t,o={}){if("string"==typeof t&&(t=function(e,n={}){let t=e.split(/\r\n|[\n\v\f\r\x85]/),o=e.match(/\r\n|[\n\v\f\r\x85]/g)||[],i=[],l=0;function s(){let e={};for(i.push(e);l<t.length;){let n=t[l];if(/^(\-\-\-|\+\+\+|@@)\s/.test(n))break;let o=/^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(n);o&&(e.index=o[1]),l++}for(r(e),r(e),e.hunks=[];l<t.length;){let o=t[l];if(/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(o))break;if(/^@@/.test(o))e.hunks.push(u());else{if(o&&n.strict)throw new Error("Unknown line "+(l+1)+" "+JSON.stringify(o));l++}}}function r(e){const n=/^(---|\+\+\+)\s+(.*)$/.exec(t[l]);if(n){let t="---"===n[1]?"old":"new";const o=n[2].split("\t",2);let i=o[0].replace(/\\\\/g,"\\");/^".*"$/.test(i)&&(i=i.substr(1,i.length-2)),e[t+"FileName"]=i,e[t+"Header"]=(o[1]||"").trim(),l++}}function u(){let e=l,i=t[l++].split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/),s={oldStart:+i[1],oldLines:void 0===i[2]?1:+i[2],newStart:+i[3],newLines:void 0===i[4]?1:+i[4],lines:[],linedelimiters:[]};0===s.oldLines&&(s.oldStart+=1),0===s.newLines&&(s.newStart+=1);let r=0,u=0;for(;l<t.length&&!(0===t[l].indexOf("--- ")&&l+2<t.length&&0===t[l+1].indexOf("+++ ")&&0===t[l+2].indexOf("@@"));l++){let e=0==t[l].length&&l!=t.length-1?" ":t[l][0];if("+"!==e&&"-"!==e&&" "!==e&&"\\"!==e)break;s.lines.push(t[l]),s.linedelimiters.push(o[l]||"\n"),"+"===e?r++:"-"===e?u++:" "===e&&(r++,u++)}if(r||1!==s.newLines||(s.newLines=0),u||1!==s.oldLines||(s.oldLines=0),n.strict){if(r!==s.newLines)throw new Error("Added line count did not match for hunk at line "+(e+1));if(u!==s.oldLines)throw new Error("Removed line count did not match for hunk at line "+(e+1))}return s}for(;l<t.length;)s();return i}(t)),Array.isArray(t)){if(t.length>1)throw new Error("applyPatch only works with a single input.");t=t[0]}let i,l,s=n.split(/\r\n|[\n\v\f\r\x85]/),r=n.match(/\r\n|[\n\v\f\r\x85]/g)||[],u=t.hunks,f=o.compareLine||((e,n,t,o)=>n===o),d=0,h=o.fuzzFactor||0,a=0,c=0;function p(e,n){for(let t=0;t<e.lines.length;t++){let o=e.lines[t],i=o.length>0?o[0]:" ",l=o.length>0?o.substr(1):o;if(" "===i||"-"===i){if(!f(n+1,s[n],i,l)&&(d++,d>h))return!1;n++}}return!0}for(let n=0;n<u.length;n++){let t=u[n],o=s.length-t.oldLines,i=0,l=c+t.oldStart-1,r=e(l,a,o);for(;void 0!==i;i=r())if(p(t,l+i)){t.offset=c+=i;break}if(void 0===i)return!1;a=t.offset+t.oldStart+t.oldLines}let g=0;for(let e=0;e<u.length;e++){let n=u[e],t=n.oldStart+n.offset+g-1;g+=n.newLines-n.oldLines;for(let e=0;e<n.lines.length;e++){let o=n.lines[e],u=o.length>0?o[0]:" ",f=o.length>0?o.substr(1):o,d=n.linedelimiters[e];if(" "===u)t++;else if("-"===u)s.splice(t,1),r.splice(t,1);else if("+"===u)s.splice(t,0,f),r.splice(t,0,d),t++;else if("\\"===u){let t=n.lines[e-1]?n.lines[e-1][0]:null;"+"===t?i=!0:"-"===t&&(l=!0)}}}if(i)for(;!s[s.length-1];)s.pop(),r.pop();else l&&(s.push(""),r.push("\n"));for(let e=0;e<s.length-1;e++)s[e]=s[e]+r[e];return s.join("")}function t(){}function o(e,n,t,o,i){let l=0,s=n.length,r=0,u=0;for(;l<s;l++){let s=n[l];if(s.removed){if(s.value=e.join(o.slice(u,u+s.count)),u+=s.count,l&&n[l-1].added){let e=n[l-1];n[l-1]=n[l],n[l]=e}}else{if(!s.added&&i){let n=t.slice(r,r+s.count);n=n.map((function(e,n){let t=o[u+n];return t.length>e.length?t:e})),s.value=e.join(n)}else s.value=e.join(t.slice(r,r+s.count));r+=s.count,s.added||(u+=s.count)}}let f=n[s-1];return s>1&&"string"==typeof f.value&&(f.added||f.removed)&&e.equals("",f.value)&&(n[s-2].value+=f.value,n.pop()),n}t.prototype={diff(e,n,t={}){let i=t.callback;"function"==typeof t&&(i=t,t={}),this.options=t;let l=this;function s(e){return i?(setTimeout((function(){i(void 0,e)}),0),!0):e}e=this.castInput(e),n=this.castInput(n),e=this.removeEmpty(this.tokenize(e));let r=(n=this.removeEmpty(this.tokenize(n))).length,u=e.length,f=1,d=r+u;t.maxEditLength&&(d=Math.min(d,t.maxEditLength));let h=[{newPos:-1,components:[]}],a=this.extractCommon(h[0],n,e,0);if(h[0].newPos+1>=r&&a+1>=u)return s([{value:this.join(n),count:n.length}]);function c(){for(let i=-1*f;i<=f;i+=2){let f,d=h[i-1],a=h[i+1],c=(a?a.newPos:0)-i;d&&(h[i-1]=void 0);let p=d&&d.newPos+1<r,g=a&&0<=c&&c<u;if(p||g){if(!p||g&&d.newPos<a.newPos?(f={newPos:(t=a).newPos,components:t.components.slice(0)},l.pushComponent(f.components,void 0,!0)):(f=d,f.newPos++,l.pushComponent(f.components,!0,void 0)),c=l.extractCommon(f,n,e,i),f.newPos+1>=r&&c+1>=u)return s(o(l,f.components,n,e,l.useLongestToken));h[i]=f}else h[i]=void 0}var t;f++}if(i)!function e(){setTimeout((function(){if(f>d)return i();c()||e()}),0)}();else for(;f<=d;){let e=c();if(e)return e}},pushComponent(e,n,t){let o=e[e.length-1];o&&o.added===n&&o.removed===t?e[e.length-1]={count:o.count+1,added:n,removed:t}:e.push({count:1,added:n,removed:t})},extractCommon(e,n,t,o){let i=n.length,l=t.length,s=e.newPos,r=s-o,u=0;for(;s+1<i&&r+1<l&&this.equals(n[s+1],t[r+1]);)s++,r++,u++;return u&&e.components.push({count:u}),e.newPos=s,r},equals(e,n){return this.options.comparator?this.options.comparator(e,n):e===n||this.options.ignoreCase&&e.toLowerCase()===n.toLowerCase()},removeEmpty(e){let n=[];for(let t=0;t<e.length;t++)e[t]&&n.push(e[t]);return n},castInput:e=>e,tokenize:e=>e.split(""),join:e=>e.join("")};const i=new t;function l(e,n,t,o,l,s,r){r||(r={}),void 0===r.context&&(r.context=4);const u=function(e,n,t){return i.diff(e,n,t)}(t,o,r);if(!u)return;function f(e){return e.map((function(e){return" "+e}))}u.push({value:"",lines:[]});let d=[],h=0,a=0,c=[],p=1,g=1;for(let e=0;e<u.length;e++){const n=u[e],i=n.lines||n.value.replace(/\n$/,"").split("\n");if(n.lines=i,n.added||n.removed){if(!h){const n=u[e-1];h=p,a=g,n&&(c=r.context>0?f(n.lines.slice(-r.context)):[],h-=c.length,a-=c.length)}c.push(...i.map((function(e){return(n.added?"+":"-")+e}))),n.added?g+=i.length:p+=i.length}else{if(h)if(i.length<=2*r.context&&e<u.length-2)c.push(...f(i));else{let n=Math.min(i.length,r.context);c.push(...f(i.slice(0,n)));let l={oldStart:h,oldLines:p-h+n,newStart:a,newLines:g-a+n,lines:c};if(e>=u.length-2&&i.length<=r.context){let e=/\n$/.test(t),n=/\n$/.test(o),s=0==i.length&&c.length>l.oldLines;!e&&s&&t.length>0&&c.splice(l.oldLines,0,"\\ No newline at end of file"),(e||s)&&n||c.push("\\ No newline at end of file")}d.push(l),h=0,a=0,c=[]}p+=i.length,g+=i.length}}return{oldFileName:e,newFileName:n,oldHeader:l,newHeader:s,hunks:d}}function s(e,n,t,o,i,s){return function(e,n,t,o,i,s,r){return function(e){const n=[];e.oldFileName==e.newFileName&&n.push("Index: "+e.oldFileName),n.push("==================================================================="),n.push("--- "+e.oldFileName+(void 0===e.oldHeader?"":"\t"+e.oldHeader)),n.push("+++ "+e.newFileName+(void 0===e.newHeader?"":"\t"+e.newHeader));for(let t=0;t<e.hunks.length;t++){const o=e.hunks[t];0===o.oldLines&&(o.oldStart-=1),0===o.newLines&&(o.newStart-=1),n.push("@@ -"+o.oldStart+","+o.oldLines+" +"+o.newStart+","+o.newLines+" @@"),n.push.apply(n,o.lines)}return n.join("\n")+"\n"}(l(e,n,t,o,i,s,r))}(e,e,n,t,o,i,s)}i.tokenize=function(e){let n=[],t=e.split(/(\n|\r\n)/);t[t.length-1]||t.pop();for(let e=0;e<t.length;e++){let o=t[e];e%2&&!this.options.newlineIsToken?n[n.length-1]+=o:(this.options.ignoreWhitespace&&(o=o.trim()),n.push(o))}return n};export{n as applyPatch,s as createPatch};
