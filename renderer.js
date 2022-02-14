// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.addEventListener("load",()=>{
    let previewMode=0
    const title=document.querySelector("#title");
    const content=document.querySelector("#content");
    const preview=document.querySelector("#preview");
    const previewModeButton=document.querySelector("#preview_mode_btn");
    let parsed = "";
    const onlyOneLine=(e)=>{
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.key == "Enter")return e.preventDefault();
    }
    const emitPreview=()=>{
        if(previewMode==0){
            preview.innerHTML=parsed
        }else preview.innerText=parsed;
    }
    document.title=(title.innerText!="" ? title.innerText : "untitled")
    title.addEventListener("keydown",onlyOneLine)
    title.addEventListener("input",()=>document.title=(title.innerText!="" ? title.innerText : "untitled"))
    previewModeButton.addEventListener("click",()=>{
        switch (previewMode^=1){
            case 0:
                preview.style.whiteSpace="";
                break
            case 1:
                preview.style.whiteSpace="pre";
                break
        }
        previewModeButton.innerText=`ソース\r\n${previewMode ? "非" : ""}表示`
        emitPreview()
    })
    content.addEventListener("input",()=>{
        const markdown = (t)=>t
            .replace(/([<>])/g,(_,c)=>"&#x"+c.charCodeAt(0).toString(16)+";")
            .replace(/(#{1,6})(.+)(\r\n|\r|\n)?/g,(m,...g)=>`<h${g[0].length}>${g[1]}</h${g[0].length}>`)
            .replace(/\\(.)/g,(_,c)=>"&#x"+c.charCodeAt(0).toString(16)+";")
            .replace(/(\r\n|\r|\n){2}/g,`<br>`)
            .replace(/(\*\*|__)((?:[^*_]|\\[*_])*)(\*\*|__)/g,(_,...g)=>`<b>${g[1]}</b>`)
            .replace(/(\*|_)((?:[^*_]|\\[*_])*)(\*|_)/g,(_,...g)=>`<i>${g[1]}</i>`)
            .replace(/~~((?:[^~]|\\~)*)~~/g,"<s>$1</s>")
            .replace(/!\[((?:[^\[\]]|\\[[]"])*)\]\(((?:[^"()]|\\[()"])*)(?:\s"(.*)")?\)/g,`<img src="$2" alt="$1" title="$3" \/>`)
            .replace(/\[((?:[^\[\]]|\\[[]])*)\]\(((?:[^"()]|\\[()"])*)(?:\s"(.*)")?\)/g,`<a href="$2" title="$3">$1</a>`)
            .replace(/```((?:[^`]|\\`)*)```/g,`<pre><code>$1</code></pre>`)
            .replace(/`((?:[^`]|\\`)*)`/g,`<code>$1</code>`);

        parsed=markdown(content.innerText)
        emitPreview()
    })
})