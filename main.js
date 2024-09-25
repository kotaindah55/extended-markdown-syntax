var __defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__hasOwnProp=Object.prototype.hasOwnProperty,__defNormalProp=(e,t,i)=>t in e?__defProp(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,__export=(e,t)=>{for(var i in t)__defProp(e,i,{get:t[i],enumerable:!0})},__copyProps=(e,t,i,r)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let o of __getOwnPropNames(t))__hasOwnProp.call(e,o)||o===i||__defProp(e,o,{get:()=>t[o],enumerable:!(r=__getOwnPropDesc(t,o))||r.enumerable});return e},__toCommonJS=e=>__copyProps(__defProp({},"__esModule",{value:!0}),e),__publicField=(e,t,i)=>__defNormalProp(e,"symbol"!=typeof t?t+"":t,i),main_exports={};__export(main_exports,{default:()=>ExtendedMarkdownSyntax}),module.exports=__toCommonJS(main_exports);var import_obsidian5=require("obsidian"),import_view7=require("@codemirror/view"),import_obsidian2=require("obsidian"),import_state=require("@codemirror/state"),import_language4=require("@codemirror/language");function checkSelectionOverlap(e,t,i){if(!e)return!1;for(const r of e.ranges)return r.to>=t&&r.from<=i;return!1}var import_language=require("@codemirror/language");function isCodeblock(e,t,i){let r=!1;return(0,import_language.syntaxTree)(e.state).iterate({from:t,to:i,enter:e=>{if(/^inline-code/.test(e.name)||"HyperMD-codeblock_HyperMD-codeblock-bg"==e.name)return r=!0,!1}}),r}var import_language2=require("@codemirror/language"),import_language3=require("@codemirror/language");function isColumnSeparator(e,t){return/hmd-table-sep/.test(e.resolveInner(t,1).name)}function isRestrictedPos(e,t){return/(?:inline-code)|(?:tag)|(?:HyperMD-codeblock)|(?:footref)|(?:hmd-internal-link)|(?:hmd-footnote)|(?:math)|(?:hmd-codeblock)|(?:formatting-strikethrough)/.test(e.resolveInner(t,1).name)}function isTable(e,t){let i=!1;return e.iterate({from:t,to:t,enter:e=>{if(/table/.test(e.name))return i=!0,!1}}),i}var delimRegExps=new Map([["u",{openingDelim:new RegExp("(?:(?<!\\\\)|(?<=(?<!\\\\)(?:\\\\{2})+))\\+\\+(?![\\+\\s]|$)","gd"),closingDelim:new RegExp("(?:(?<![\\s\\\\]|^)|(?<=(?<!\\\\)(?:\\\\{2})+))\\+\\+","gd"),length:2}],["sup",{openingDelim:new RegExp("(?:(?<!\\\\)|(?<=(?<!\\\\)(?:\\\\{2})+))\\^(?![\\^\\s]|$)","gd"),closingDelim:new RegExp("(?:(?<![\\s\\\\]|^)|(?<=(?<!\\\\)(?:\\\\{2})+))\\^","gd"),length:1}],["sub",{openingDelim:new RegExp("(?:(?<!\\\\)|(?<=(?<!\\\\)(?:\\\\{2})+))~(?![~\\s]|$)","gd"),closingDelim:new RegExp("(?:(?<![\\s\\\\]|^)|(?<=(?<!\\\\)(?:\\\\{2})+))~","gd"),length:1}],["spoiler",{openingDelim:new RegExp("(?:(?<!\\\\)|(?<=(?<!\\\\)(?:\\\\{2})+))\\|\\|(?![|\\s]|$)","gd"),closingDelim:new RegExp("(?:(?<![\\s\\\\]|^)|(?<=(?<!\\\\)(?:\\\\{2})+))\\|\\|","gd"),length:2}]]),postProcessorDelimRegExps=new Map([["u",{openingDelim:new RegExp("\\+\\+(?![\\s]|$|(?:<br>\\n?))","gd"),closingDelim:new RegExp("(?<![\\s]|(?:<br>\\n?))\\+\\+","gd"),raw:{openingDelim:new RegExp("((?<!\\\\)(?:\\\\{2})*\\\\)?(\\+(\\\\)?\\+)(?!$|\\s)(?=(\\+)?)","gd"),closingDelim:new RegExp("(?:((?<!\\\\)(?:\\\\{2})*(?<!\\s)\\\\)|(?<![\\\\\\s])|((?<!\\\\)(?:\\\\{2})+))(\\+(\\\\)?\\+)","gd")},length:2}],["sup",{openingDelim:new RegExp("\\^(?![\\s]|$|(?:<br>\\n?))","gd"),closingDelim:new RegExp("(?<![\\s]|(?:<br>\\n?))\\^","gd"),raw:{openingDelim:new RegExp("((?<!\\\\)(?:\\\\{2})*\\\\)?(\\^()?)(?!$|\\s)(?=(\\^)?)","gd"),closingDelim:new RegExp("(?:((?<!\\\\)(?:\\\\{2})*(?<!\\s)\\\\)|(?<![\\\\\\s])|((?<!\\\\)(?:\\\\{2})+))(\\^()?)","gd")},length:1}],["sub",{openingDelim:new RegExp("~(?![\\s]|$|(?:<br>\\n?))","gd"),closingDelim:new RegExp("(?<![\\s]|(?:<br>\\n?))~","gd"),raw:{openingDelim:new RegExp("((?<!\\\\)(?:\\\\{2})*\\\\)?(~()?)(?!$|\\s)(?=(~)?)","gd"),closingDelim:new RegExp("(?:((?<!\\\\)(?:\\\\{2})*(?<!\\s)\\\\)|(?<![\\\\\\s])|((?<!\\\\)(?:\\\\{2})+))(~()?)","gd")},length:1}],["spoiler",{openingDelim:new RegExp("\\|\\|(?![\\s]|$|(?:<br>\\n?))","gd"),closingDelim:new RegExp("(?<![\\s]|(?:<br>\\n?))\\|\\|","gd"),raw:{openingDelim:new RegExp("((?<!\\\\)(?:\\\\{2})*\\\\)?(\\|(\\\\)?\\|)(?!$|\\s)(?=(\\|)?)","gd"),closingDelim:new RegExp("(?:((?<!\\\\)(?:\\\\{2})*(?<!\\s)\\\\)|(?<![\\\\\\s])|((?<!\\\\)(?:\\\\{2})+))(\\|(\\\\)?\\|)","gd")},length:2}]]);function getDelimiterFromEditor(e,t,i,r,o,l){var n,s,a,c,d,g,m,h;let u=e.toString(),p=/\n\n+/g,x=/(?<!^)\|/g,f=[];if(l){f=l.posCollection;let{from:e,delimLength:t}=l,i=e-t;f.length&&f.findLast(((r,o,l)=>e>=r[1]?(e<r[3]||e==r[3]&&r[2]==r[3]?(i=r[0],l.splice(o)):e-r[3]<t?(i=r[3],l.splice(o+1)):l.splice(o+1),!0):0==o?(l.splice(0),!0):void 0)),r.lastIndex=p.lastIndex=i}for(let l=null==(n=r.exec(u))?void 0:n.indices[0],v=null!=(a=null==(s=p.exec(u))?void 0:s.index)?a:u.length;l&&!(l[1]>t.length);l=null==(c=r.exec(u))?void 0:c.indices[0]){if(isRestrictedPos(t,l[0]))continue;let n=[0,0,0,0];o.lastIndex=l[1];let s=0,a=e.lineAt(l[0]),c=isTable(t,l[0]);if(c){if("spoiler"==i){r.lastIndex=a.to;continue}for(x.lastIndex=l[0]-a.from;;){let e=null==(d=x.exec(a.text))?void 0:d.index;if(!e){s=a.to;break}if(isColumnSeparator(t,e+a.from)){s=e+a.from;break}}}for(r.lastIndex>v&&(p.lastIndex=r.lastIndex,v=(null==(g=p.exec(u))?void 0:g.index)||u.length),[n[0],n[1]]=l;;){let e=null==(m=o.exec(u))?void 0:m.indices[0];if(!e||o.lastIndex>v||c&&o.lastIndex>s)n[2]=n[3]=r.lastIndex=c?s:v,o.lastIndex>v&&(v=(null==(h=p.exec(u))?void 0:h.index)||u.length);else{if(isRestrictedPos(t,e[0]))continue;r.lastIndex=e[1],[n[2],n[3]]=e}break}f.push(n)}return o.lastIndex&&(o.lastIndex=0),f}var extendedFormattingField=import_state.StateField.define({create(e){let t=new Map,i=(0,import_language4.syntaxTree)(e);return delimRegExps.forEach(((r,o)=>{t.set(o,getDelimiterFromEditor(e.doc,i,o,r.openingDelim,r.closingDelim))})),{delimField:t,treeLength:i.length}},update(e,t){let i=(0,import_language4.syntaxTree)(t.state);if(t.effects.forEach((e=>{var t,r;i=null!=(r=null==(t=e.value)?void 0:t.tree)?r:i})),t.docChanged||i.length!=e.treeLength){let r=Math.min(e.treeLength,i.length);e.treeLength=i.length,t.changes.iterChangedRanges((e=>{r=Math.min(r,e)}),!1),e.delimField.forEach(((e,o)=>{let{openingDelim:l,closingDelim:n,length:s}=delimRegExps.get(o);getDelimiterFromEditor(t.state.doc,i,o,l,n,{from:r,delimLength:s,posCollection:e})}))}return e}}),import_state2=require("@codemirror/state"),import_language5=require("@codemirror/language");function getHighlight(e,t,i){let r=e.toString(),o=/highlight/,l=/(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))==+(?=(?:\{([\w\d\-]+)\})|[^=\s])/g,n=[];if(i){n=i.hlCollection;let{from:e}=i,t=e-2;n.length&&n.findLast(((i,r,o)=>e>=i[1]?(e<i[3]||e==i[3]?(t=i[0],o.splice(r)):o.splice(r+1),!0):0==r?(o.splice(0),!0):void 0)),l.lastIndex=t}for(let e,i=l.exec(r);i&&(e=t.resolveInner(i.index,1));i=l.exec(r)){let r,s=e.from;if(s>t.length)break;if(!o.test(e.name))continue;for(;r=e.to,e=t.resolveInner(e.to,1),o.test(e.name););let a=t.resolveInner(r,-1),c=/formatting-highlight/.test(a.name)?a.from:r;n.push([s,l.lastIndex,c,r,i[1]]),l.lastIndex=r}return n}var customHighlightField=import_state2.StateField.define({create(e){let t=(0,import_language5.syntaxTree)(e);return{hlCollection:getHighlight(e.doc,t),treeLength:t.length}},update(e,t){let i=(0,import_language5.syntaxTree)(t.state);if(t.effects.forEach((e=>{var t,r;i=null!=(r=null==(t=e.value)?void 0:t.tree)?r:i})),t.docChanged||i.length!=e.treeLength){let r=Math.min(e.treeLength,i.length);e.treeLength=i.length,t.changes.iterChangedRanges((e=>{r=Math.min(r,e)}),!1),getHighlight(t.state.doc,i,{from:r,hlCollection:e.hlCollection})}return e}}),import_view=require("@codemirror/view"),import_obsidian=require("obsidian"),ColorButton=class extends import_view.WidgetType{constructor(e="default",t,i,r,o,l,n){super(),__publicField(this,"color"),__publicField(this,"markerFrom"),__publicField(this,"markerTo"),__publicField(this,"menu"),__publicField(this,"outerFrom"),__publicField(this,"outerTo"),__publicField(this,"innerFrom"),__publicField(this,"innerTo"),__publicField(this,"colors",["red","orange","yellow","green","cyan","blue","purple","pink","accent","default"]),this.color=e,this.markerFrom=t,this.markerTo=i,this.outerFrom=r,this.outerTo=o,this.innerFrom=l,this.innerTo=n}eq(e){return e.color==this.color}toDOM(e){let t=document.createElement("span");return t.setAttribute("aria-hidden","true"),t.className="cmx-color-btn",t.onclick=t=>{e.dispatch({selection:{anchor:this.markerFrom,head:this.markerTo}})},t.onmouseover=i=>{if(null!=this.menu)return;this.menu=new import_obsidian.Menu,this.menu.dom.addClass("es-highlight-colors-modal"),this.colors.forEach((t=>{this.menu.addItem((i=>{i.setTitle(t).onClick((i=>{e.dispatch({changes:{from:this.markerFrom,to:this.markerTo,insert:"default"!=t?`{${t}}`:""}})})).setIcon("palette"),i.dom.addClass(`es-item-${t}`)}))})),this.menu.addItem((t=>{t.setTitle("Remove").setIcon("ban").onClick((t=>{e.dispatch({changes:[{from:this.outerFrom,to:this.markerTo,insert:""},{from:this.innerTo,to:this.outerTo,insert:""}]})}))}));const r=t.getBoundingClientRect();this.menu.showAtPosition({x:r.left,y:r.bottom})},t}ignoreEvent(){return!1}},import_view2=require("@codemirror/view"),HiddenWidget=class extends import_view2.WidgetType{constructor(e){super(),__publicField(this,"mark"),this.mark=e}eq(e){return e.mark==this.mark}toDOM(e){return document.createElement("span")}},import_view3=require("@codemirror/view"),alignerDecorators=[import_view3.Decoration.line({class:"cmx-align-left",query:/(?<=^|^#{1,6} +)!left!/gm,style:"text-align: left;",marker:import_view3.Decoration.mark({class:"cmx-align-left-marker"})}),import_view3.Decoration.line({class:"cmx-align-right",query:/(?<=^|^#{1,6} +)!right!/gm,style:"text-align: right;",marker:import_view3.Decoration.mark({class:"cmx-align-right-marker"})}),import_view3.Decoration.line({class:"cmx-align-center",query:/(?<=^|^#{1,6} +)!center!/gm,style:"text-align: center;",marker:import_view3.Decoration.mark({class:"cmx-align-center-marker"})}),import_view3.Decoration.line({class:"cmx-align-justify",query:/(?<=^|^#{1,6} +)!justify!/gm,style:"text-align: justify;",marker:import_view3.Decoration.mark({class:"cmx-align-justify-marker"})})],import_view4=require("@codemirror/view"),highlightDecorator={class:"cmx-highlight cmx-highlight",markerDeco:import_view4.Decoration.mark({class:"cmx-highlight-marker"})},import_view5=require("@codemirror/view"),formattingDecorators=new Map([["u",import_view5.Decoration.mark({class:"cmx-underline",delimDeco:import_view5.Decoration.mark({class:"cmx-underline cmx-formatting-underline"})})],["sup",import_view5.Decoration.mark({class:"cmx-superscript",delimDeco:import_view5.Decoration.mark({class:"cmx-superscript cmx-formatting-superscript"})})],["sub",import_view5.Decoration.mark({class:"cmx-subscript",delimDeco:import_view5.Decoration.mark({class:"cmx-subscript cmx-formatting-subscript"})})],["spoiler",import_view5.Decoration.mark({class:"cmx-spoiler",delimDeco:import_view5.Decoration.mark({class:"cmx-spoiler cmx-formatting-spoiler"})})]]),import_view6=require("@codemirror/view"),hiddenSpoiler=import_view6.Decoration.mark({class:"cmx-spoiler cmx-spoiler-hidden"}),ExtendedFormatting=class{constructor(e){__publicField(this,"decorations"),__publicField(this,"isLivePreview"),this.decorations=this.buildDecorations(e),this.isLivePreview=e.state.field(import_obsidian2.editorLivePreviewField)}update(e){e.state.field(import_obsidian2.editorLivePreviewField)==this.isLivePreview&&(this.decorations=this.buildDecorations(e.view)),this.isLivePreview=e.state.field(import_obsidian2.editorLivePreviewField),(e.docChanged||e.selectionSet)&&(this.decorations=this.buildDecorations(e.view))}buildDecorations(e){let t=[];return e.state.field(extendedFormattingField).delimField.forEach(((i,r)=>{if(0===i.length)return;let o=formattingDecorators.get(r),l=null==o?void 0:o.spec.delimDeco;i.forEach((i=>{let n=i[2]!=i[3];"spoiler"!=r&&t.push(o.range(i[1],i[2])),t.push(l.range(i[0],i[1])),n&&t.push(l.range(i[2],i[3])),e.hasFocus&&checkSelectionOverlap(e.state.selection,i[0],i[3])||!this.isLivePreview?"spoiler"==r&&t.push(o.range(i[1],i[2])):("spoiler"==r&&t.push(hiddenSpoiler.range(i[1],i[2])),this.hideDelim(t,l,i,n))}))})),import_view7.Decoration.set(t,!0)}hideDelim(e,t,i,r){let o=import_view7.Decoration.replace({widget:new HiddenWidget(t)});e.push(o.range(i[0],i[1])),r&&e.push(o.range(i[2],i[3]))}},extendedFormattingPlugin=import_view7.ViewPlugin.fromClass(ExtendedFormatting,{decorations:e=>e.decorations}),import_view8=require("@codemirror/view"),import_search=require("@codemirror/search"),import_obsidian3=require("obsidian"),Aligner=class{constructor(e){__publicField(this,"decorations"),__publicField(this,"isLivePreview"),this.decorations=this.buildDecorations(e),this.isLivePreview=e.state.field(import_obsidian3.editorLivePreviewField)}update(e){e.state.field(import_obsidian3.editorLivePreviewField)==this.isLivePreview&&(this.decorations=this.buildDecorations(e.view)),this.isLivePreview=e.state.field(import_obsidian3.editorLivePreviewField),(e.docChanged||e.selectionSet)&&(this.decorations=this.buildDecorations(e.view))}buildDecorations(e){let t=[];return alignerDecorators.forEach((i=>{let r=new import_search.RegExpCursor(e.state.doc,i.spec.query).next();if(r.done)return t;let o=i.spec.marker;for(;!r.done;){let[l,n]=[r.value.from,r.value.to];if(!isCodeblock(e,l,n)){let r=e.state.doc.lineAt(l).from;t.push(i.range(r,r)),t.push(o.range(l,n)),!checkSelectionOverlap(e.state.selection,l,n)&&this.isLivePreview&&this.hideMarker(t,o,l,n)}r.next()}})),import_view8.Decoration.set(t,!0)}hideMarker(e,t,i,r){let o=import_view8.Decoration.replace({widget:new HiddenWidget(t)});e.push(o.range(i,r))}},alignerPlugin=import_view8.ViewPlugin.fromClass(Aligner,{decorations:e=>e.decorations}),import_view9=require("@codemirror/view"),import_obsidian4=require("obsidian"),CustomHighlight=class{constructor(e){__publicField(this,"decorations"),__publicField(this,"isLivePreview"),this.decorations=this.buildDecorations(e),this.isLivePreview=e.state.field(import_obsidian4.editorLivePreviewField)}update(e){e.state.field(import_obsidian4.editorLivePreviewField)==this.isLivePreview&&(this.decorations=this.buildDecorations(e.view)),this.isLivePreview=e.state.field(import_obsidian4.editorLivePreviewField),(e.docChanged||e.selectionSet)&&(this.decorations=this.buildDecorations(e.view))}buildDecorations(e){let t=[],i=highlightDecorator.markerDeco;return e.state.field(customHighlightField).hlCollection.forEach((r=>{let[o,l,n,s,a]=[...r],c=a?a.length+2:0;t.push(import_view9.Decoration.mark({class:`${highlightDecorator.class}-${null!=a?a:"default"}`}).range(o,s),import_view9.Decoration.mark({class:`${highlightDecorator.class}-first-letter`}).range(l+c,l+c+1),import_view9.Decoration.mark({class:`${highlightDecorator.class}-last-letter`}).range(n-1,n)),!checkSelectionOverlap(e.state.selection,o,s)&&this.isLivePreview||t.push(import_view9.Decoration.widget({widget:new ColorButton(a,l,l+c,o,s,l,n),side:1}).range(l)),a&&!checkSelectionOverlap(e.state.selection,l,l+c)&&this.isLivePreview&&this.hideMarker(t,i,l,l+c)})),import_view9.Decoration.set(t,!0)}hideMarker(e,t,i,r){let o=import_view9.Decoration.replace({widget:new HiddenWidget(t)});e.push(o.range(i,r))}},customHighlightPlugin=import_view9.ViewPlugin.fromClass(CustomHighlight,{decorations:e=>e.decorations}),AlignerPostProcessor=class{constructor(){__publicField(this,"targetedElements","p, h1, h2, h3, h4, h5, h6, td, th, .callout-title-inner"),__publicField(this,"format",(e=>{var t,i;let r,o=/^!((?:left)|(?:right)|(?:center)|(?:justify))!/;"BLOCKQUOTE"!=(null==(t=e.parentElement)?void 0:t.tagName)&&((null==(i=e.parentElement)?void 0:i.hasClass("callout-content"))?(o=/^ *!((?:left)|(?:right)|(?:center)|(?:justify))!/,r=o.exec(e.innerHTML)):r="[object HTMLHeadingElement]"==e.toString()&&3==e.childNodes[1].nodeType?o.exec(e.childNodes[1].textContent):o.exec(e.innerHTML),r&&(e.innerHTML=e.innerHTML.replace(r[0],""),e.hasClass("callout-title-inner")?e.parentElement.style.justifyContent="justify"!=r[1]?r[1]:"space-between":e.style.textAlign=r[1]))})),__publicField(this,"postProcess",(e=>{e.classList.contains("table-cell-wrapper")?this.format(e):e.querySelectorAll(this.targetedElements).forEach((e=>{this.format(e)}))}))}},CustomHighlightPostProcessor=class{constructor(){__publicField(this,"format",(e=>{let t=e.querySelectorAll("mark"),i=/^\{([\w\d\-_]+)\}/;t.forEach((e=>{let t=i.exec(e.innerText);t&&(e.innerHTML=e.innerHTML.replace(t[0],""),e.classList.add(`cmx-highlight-${t[1]}`))}))})),__publicField(this,"postProcess",((e,t)=>{this.format(e)}))}};function splitCells(e){let t=e.split("\n"),i=[];return t.forEach(((e,t)=>{1!==t&&((e=e.trim()).startsWith("|")&&(e=e.substring(1)),e.endsWith("|")&&(e=e.substring(0,e.length-1)),e.split(/(?:(?<!\\)|(?<=(?<!\\)(?:\\{2})+))\|/).forEach((e=>{i.push(e)})))})),i}function getEscapedDelims(e,t,i){let r=getRestrictedRanges(e),o=[];t.lastIndex=0,i.lastIndex=0;for(let l=t.exec(e),n=0;l;l=t.exec(e)){let[s,a,c,d,g]=l.indices;if(!r.some((e=>e[0]<=s[0]&&e[1]>=s[1])))if(i.lastIndex=s[1],a||d||g)o.push(n),t.lastIndex=c[0]+1,n++;else{n++;for(let l=i.exec(e);l||(t.lastIndex=e.length,0);l=i.exec(e)){let[e,s,a,c,d]=[...l.indices];if(!r.some((t=>t[0]<=e[0]&&t[1]>=e[1]))){if(!s&&!d){n++,t.lastIndex=e[1];break}o.push(n),i.lastIndex=c[0]+1,n++}}}}return o}function getDelimiterFromPreview(e,t,i){var r,o,l,n,s,a,c;let d=/(<br>\n?)\1+/g,g=/<[\w\d\-]+(?: *[\w\d\-]+(?:=(?:"[^"]*")|(?:'[^']*'))?)*>/g,m=null!=(o=null==(r=d.exec(e))?void 0:r.index)?o:e.length,h=g.exec(e),u=[null!=(l=null==h?void 0:h.index)?l:e.length,g.lastIndex||e.length],{openingDelim:p,closingDelim:x,raw:f}=i,v=getEscapedDelims(t,f.openingDelim,f.closingDelim),w=[];p.lastIndex=0,x.lastIndex=0;for(let t=p.exec(e),i=p.lastIndex,r=0;t;t=p.exec(e),i=p.lastIndex){let o=[0,0,0,0];if(i>u[1]&&(g.lastIndex=i,u=[(null==(n=g.exec(e))?void 0:n.index)||e.length,g.lastIndex||e.length]),!(i>u[0]&&i<u[1]))if(v[0]!==r){i>m&&(d.lastIndex=i,m=(null==(s=d.exec(e))?void 0:s.index)||e.length),x.lastIndex=i,[o[0],o[1]]=t.indices[0],r++;for(let t=x.exec(e);;t=x.exec(e)){if(i=x.lastIndex,!t||i>m)p.lastIndex=o[2]=o[3]=m,m=(null==(a=d.exec(e))?void 0:a.index)||e.length;else{if(i>u[0]&&i<u[1])continue;if(v[0]===r){x.lastIndex=t.index+1,v.shift(),r++;continue}i>u[1]&&(g.lastIndex=i,u=[(null==(c=g.exec(e))?void 0:c.index)||e.length,g.lastIndex||e.length]),[o[2],o[3]]=t.indices[0],p.lastIndex=i,r++}break}w.push(o)}else p.lastIndex=t.index+1,v.shift(),r++}return w}function getRestrictedRanges(e){let t=new RegExp("(\\\\)|`(?:[^`])+`|\\[\\[\\[?(?!\\[)(?:.|\\s)+?(?<!\\])\\]\\]|\\$\\$(?:.|\\s)*?\\$\\$|\\$(?!\\s|\\$).+?(?<!\\s)\\$","gd"),i=[];for(let r=t.exec(e);r;r=t.exec(e))r[1]?t.lastIndex+=1:i.push(r.indices[0]);return i}function getTextAtLine(e,t,i){return e.split("\n").slice(t,i+1).join("\n")}function replaceStringByPos(e,t,i,r){let o=new RegExp(`.{${r-i}}`,"ys");return o.lastIndex=i,e.replace(o,t)}function iterDelimReplacement(e,t,i,r,o,l){l&&"spoiler"==r&&(t="");let n=[],s=e.querySelectorAll(o);s.length&&s.forEach((e=>{n.push(e.innerHTML),e.innerHTML=""}));let a=e.innerHTML,c=getDelimiterFromPreview(a,t,i);if(c.length){let e=null==i?void 0:i.length,t=r.length+2-e,o=r.length+3,l=0;c.forEach((i=>{a=replaceStringByPos(a,`<${r}>`,i[0]+l,i[1]+l),l+=t,a=replaceStringByPos(a,`</${r}>`,i[2]+l,i[3]+l),l=i[2]==i[3]?l+o:l+o-e}))}e.innerHTML=a,n.forEach(((t,i)=>{e.querySelectorAll(o)[i].innerHTML=t}))}function getBlockquoteSections(e,t){let i=/^ *>/,r=[];e.split("\n").forEach((e=>{let t=0;for(;i.test(e)&&++t;)e=e.replace(i,"");e=e.trimStart(),r.push({text:e,level:t})}));e:for(let e=0,i=!1;e<r.length;){let o=r[e];if(t&&0===e)e++;else if(/^```/.test(o.text)){let t=1;for(;r[e+t];){let{level:i,text:l}=r[e+t++];if(""===l&&i<o.level||/^``` *$/.test(l)&&i==o.level)break}r.splice(e,t),i&&(i=!1)}else{if(/^\$\$/.test(o.text)){let t=1;for(;r[e+t];){let{level:i,text:l}=r[e+t++];if(""===l&&i<o.level&&t--||/^\$\$ *$/.test(l)&&i==o.level)break}if(1!==t){r.splice(e,t),i&&(i=!1);continue e}}else if(""===o.text){r.splice(e,1),i&&(i=!1);continue e}i&&r[e-1].level>=o.level&&(r[e-1].text+=`\n${r.splice(e,1)[0].text}`,e--),e++,i||(i=!0)}}return r}var ExtendedFormattingPostProcessor=class{constructor(e){__publicField(this,"view"),__publicField(this,"workspace"),__publicField(this,"targetedElements","p, li, h1, h2, h3, h4, h5, h6, .callout-title-inner"),__publicField(this,"excludedSelector","code, a.internal-link"),__publicField(this,"postProcess",((e,t)=>{var i,r,o,l,n,s,a;let c=t.getSectionInfo(e);if(c){let t=getTextAtLine(c.text,c.lineStart,c.lineEnd),i=e.firstElementChild;"TABLE"==(null==i?void 0:i.tagName)?splitCells(t).forEach(((t,i)=>{this.format(e.querySelectorAll("td, th")[i],t,!0)})):"BLOCKQUOTE"==(null==i?void 0:i.tagName)?getBlockquoteSections(t,!1).forEach(((t,i)=>{this.format(e.querySelectorAll(this.targetedElements)[i],t.text)})):(null==i?void 0:i.classList.contains("callout"))?getBlockquoteSections(t,!0).forEach(((t,i)=>{this.format(e.querySelectorAll(this.targetedElements)[i],t.text)})):e.querySelectorAll(this.targetedElements).forEach((e=>{this.format(e,t)})),e.querySelectorAll("spoiler").forEach((e=>{e.addEventListener("click",(e=>{let t=e.currentTarget;t.hasClass("cmx-revealed")?t.removeClass("cmx-revealed"):t.addClass("cmx-revealed")}))}))}else{let c=null!=(n=null==(r=null==(i=this.view)?void 0:i.editor)?void 0:r.cm)?n:null==(l=null==(o=this.workspace._["quick-preview"].find((e=>{var i,r;return(null==(i=e.ctx)?void 0:i.hasOwnProperty("editMode"))&&(null==(r=e.ctx)?void 0:r.path)==t.sourcePath})))?void 0:o.ctx)?void 0:l.editMode.cm;if(e.classList.contains("table-cell-wrapper")){let i=c.docView.children.find((e=>{var i;return(null==(i=e.widget)?void 0:i.containerEl)==t.containerEl})),r=null==(s=null==i?void 0:i.widget)?void 0:s.cellChildMap.keys();for(let i of r)if(i.contentEl==t.el){this.format(e,i.text,!0);break}}else if(t.containerEl.classList.contains("cm-callout")){let i=c.docView.children.find((e=>{var i;return(null==(i=e.widget)?void 0:i.containerEl)==t.containerEl}));getBlockquoteSections(null==(a=null==i?void 0:i.widget)?void 0:a.text,!0).forEach(((t,i)=>{this.format(e.querySelectorAll(this.targetedElements)[i],t.text)}))}}})),this.view=e.activeEditor,this.workspace=e}format(e,t,i){postProcessorDelimRegExps.forEach(((r,o)=>{iterDelimReplacement(e,t,r,o,this.excludedSelector,i)}))}},ExtendedMarkdownSyntax=class extends import_obsidian5.Plugin{async onload(){await this.loadData(),this.registerEditorExtension([extendedFormattingField,customHighlightField]),this.registerEditorExtension([extendedFormattingPlugin,customHighlightPlugin,alignerPlugin]),this.registerMarkdownPostProcessor(new ExtendedFormattingPostProcessor(this.app.workspace).postProcess),this.registerMarkdownPostProcessor((new CustomHighlightPostProcessor).postProcess),this.registerMarkdownPostProcessor((new AlignerPostProcessor).postProcess)}onunload(){}};