// show pop up when alt is hold
let popup = null;
let guideTxt = [
    {symbol:`\``, guide:`Long position`},
    {symbol:`1`, guide:`Short position`},
    {symbol:`2`, guide: `Elliot impulse`},
    {symbol:`3`, guide: `Elliot corrective`},
    {symbol:`F`, guide: `Fib retracement`}
]
let showShortCut = (e, doc) => {
    let handler = Get("shortcut",0, false, doc);
    
    handler.style.top = e.clientY + "px";
    handler.style.left = (e.clientX + 25) + "px";
}

let createPopup = (doc) => {
    let handle = null;
    let page = Get("chart-page",0, true, doc);
    if(popup == null){
        popup = doc.createElement('div');
        popup.setAttribute("id", "shortcut");
        popup.setAttribute("class", "tv-floating-toolbar");
        popup.style["background-color"] = "rgb(58, 8, 2)";
        for(txt of guideTxt){
            handle = doc.createElement('div');


            let symbol = doc.createElement("div");
            symbol.appendChild(doc.createTextNode(txt.symbol))
            symbol.style["font-size"] = "22px";
            symbol.style["font-weight"] = "bold";
            symbol.style["color"] = "rgb(60, 222, 255)";
            handle.appendChild(symbol);

            symbol = doc.createElement("div");
            symbol.style.width = "25px";
            handle.appendChild(symbol);
            
            symbol = doc.createElement("div");
            symbol.appendChild(doc.createTextNode(txt.guide))
            handle.appendChild(symbol);

            symbol = doc.createElement("div");
            symbol.style.height = "12px";
            handle.appendChild(symbol);

            handle.setAttribute("class", "guide");
            handle.style.display = "flex";
            popup.appendChild(handle)
        }
        popup.style["z-index"] = "auto";
        popup.style.display = "none";
    }
    
    page.appendChild(popup);
    doc.addEventListener("mousemove", (e) => { showShortCut(e, doc)}, true);
}
