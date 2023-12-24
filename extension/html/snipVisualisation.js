let handle = null;
let firstCoordinate = null;
let doc = null;
let page = null;
let visualiserUpdate = (event) => {
    
    //console.log(event.clientX < firstCoordinate.x)
    handle.style.top =( (event.clientY < firstCoordinate.y) 
        ? event.clientY : firstCoordinate.y) + "px";
    handle.style.left = ((event.clientX < firstCoordinate.x) 
    ? event.clientX : firstCoordinate.x ) + "px";
    handle.style.width = Math.abs(event.clientX - firstCoordinate.x) + "px";
    handle.style.height = Math.abs(event.clientY - firstCoordinate.y) + "px";
}

let _selfClose = (event) => {
    if(event)
    event.preventDefault();
    destroyVisualiser(event)
    
}
let createVisualiser = (docu, coord) => {
    
    if(handle == null){
        
        doc = docu;
        page = Get("chart-page", 0 , true, doc);
        firstCoordinate = coord; 
        handle = doc.createElement("div");
        handle.setAttribute("id", "visualiser");
        handle.setAttribute("class", "tv-floating-toolbar");
        handle.style.opacity = 0.8;
        handle.style["pointer-events"] = "none";
        handle.style["z-index"] = "10";
        handle.style["background-color"] = " rgba(255, 255, 255, 0)";
        handle.style.display = "flex";
        page.appendChild(handle);
        doc.addEventListener("mousemove", visualiserUpdate, true);
        doc.addEventListener("click", _selfClose, true);
    }   
}

let destroyVisualiser = (event) => {
    handle.remove();
    doc.removeEventListener("mousemove",visualiserUpdate, true);
    doc.removeEventListener("click", _selfClose, true);
    
    
    firstCoordinate = null;
    doc = null;
    handle = null;

}