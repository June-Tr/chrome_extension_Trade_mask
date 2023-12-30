// show pop up when alt is hold
let popup = null;
let guideTxt = [
    {symbol:`Shift`, guide:`Ruler`},
    {symbol:`F1`, guide: `Open Alert Menu`},
    {symbol:`\``, guide:`Long position`},
    {symbol:`1`, guide:`Short position`},
    {symbol:`2`, guide: `Elliot impulse`},
    {symbol:`3`, guide: `Elliot corrective`},
    {symbol:`4`, guide: `Triangle`},
    {symbol:`F`, guide: `Fib retracement`},
    {symbol:`T`, guide: `Trend line`},
    {symbol:`Q`, guide: `Text`},
    {symbol:`z`, guide: `Open Order adjustment`},
]
let popupStatic = true;

let showShortCut = (e) => {
    let handler = Get("shortcut",0, false, secondaryDocument);

    if(!popupStatic){

        handler.style.top = e.clientY + "px";
        handler.style.left = (e.clientX + 25) + "px";
    }
}

let createPopup = (doc) => {
    let handle = null;
    let page = Get("chart-page",0, true, doc);
    if(popup == null){
        popup = doc.createElement('div');
        popup.setAttribute("id", "shortcut");
        popup.setAttribute("class", "tv-floating-toolbar");
        popup.style["background-color"] = " rgba(255, 255, 255, 0)";
        for(txt of guideTxt){
            handle = doc.createElement('div');


            let symbol = doc.createElement("div");
            symbol.appendChild(doc.createTextNode(txt.symbol))
            symbol.style["font-size"] = "20px";
            symbol.style["font-weight"] = "bold";
            symbol.style["color"] = "#0c0622";
            handle.appendChild(symbol);

            symbol = doc.createElement("div");
            symbol.style.width = "40px";
            handle.appendChild(symbol);
            
            symbol = doc.createElement("div");
            symbol.appendChild(doc.createTextNode(txt.guide))
            symbol.style["font-size"] = "14px";
            symbol.style.height = "28px";
            symbol.style["color"] = "#0c0622";
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
    popup.style.width = "auto";
    popup.style.height = "auto";
    page.appendChild(popup);
    doc.addEventListener("mousemove", (e) => { showShortCut(e, doc)}, true);
}

/**
 * @todo: use shift to display different infomation
 */
