class Button {
    constructor() {
        this.longButton = Get("bull", 0, false, cache.header.main);
        this.shortButton = Get("bear", 0, false, cache.header.main);
        this.longButton.addEventListener("click", this.clickHandle);
        this.shortButton.addEventListener("click", this.clickHandle);
        /*
        0: not enter
        -1: short
        1: long
        */
        this.state = 0; 
    }

    react() {
        if(cache.Position.state){
            this.state = (cache.Position.direction == "Buy") ? 1: -1;
        }else{
            this.state = 0
        }
        this.change();
    }

    change() {
        switch (this.state){
            case 1:
                this.shortButton.style.display = "none";
                this.longButton.style.display = "block";
                this.longButton.classList.remove("but1");
                this.longButton.classList.add("but1_on");
                this.longButton.innerText = cache.Position.price;
                break;
            case -1 :
                this.longButton.style.display = "none";
                this.shortButton.style.display = "block";
                this.shortButton.classList.remove("but2");
                this.shortButton.classList.add("but2_on");
                this.shortButton.innerText = cache.Position.price;
                break;
            default:
                this.longButton.style.display = "block";
                this.shortButton.style.display = "block";
                this.shortButton.classList.add("but2");
                this.shortButton.classList.remove("but2_on");
                this.longButton.classList.add("but1");
                this.longButton.classList.remove("but1_on");
                this.longButton.innerText = "Buy";
                this.shortButton.innerText = "Sell";
                break;
                
        }
    }

    test() {
        console.log(this.longButton);
        console.log(this.shortButton);
    }
    clickHandle = () => {
        if(cache.Position.state){
            this.ExistHandle();
        }else{
            this.EntryHandle();
        }
    }
    EntryHandle = () => {
        IsInOpenPosition(
            ExtractImportancePositionDetail,
            () => {
                alert("Button click:: Entry!! << No position found!");
            }
            
        );
    }
    ExistHandle = () => {
        IsInOpenPosition(
            () => { alert("Button click:: Exit!! <<Still on an open position")},
            () => // only try attempt finding the end of position if not on any position
                NavTo( "History",
                    () => ExtractPrice(
                        (found, _) => {
                            // find the index of the current entry
                            let i =0;

                            /* Increment to find the location of current entry
                            */
                            let update = (i) => { return i + 1;}
                            let objectFound = false
                            let entry = null;
                            while(i< found.length && i > -1){
                                
                                if(i > 100 || i < -100){
                                    alert("Infinite while loop @click handler");
                                    break;
                                }

                                if(!objectFound && found[i].id == cache.Position.entry){
                                    // start looking for
                                    update = (i) => {return i - 1}
                                    objectFound = true;
                                    let d= extractDate(found[i].date);
                                    entry = {
                                        ...found[i],
                                        date: {
                                            start: new Date(
                                                    d.y, d.m, d.d, d.h, d.m, d.s
                                                ).toISOString()
                                        },
                                         type: found[i].direction, market: "Eur_usd", label:"Open", curency:"Usd"
                                    }
                                }
                                
                                if(objectFound && found[i]?.direction != cache.Position.direction){
                                    
                                    let d= extractDate(found[i].date);
                                    objectFound = {
                                        ...found[i],
                                        date: {
                                            start: new Date(
                                                    d.y, d.m, d.d, d.h, d.m, d.s
                                                ).toISOString()
                                        },
                                         type: found[i].direction, market: "Eur_usd", label:"Full close", curency:"Usd"
                                    }
                                    break;
                                }
                                i = update(i);
                            }

                            if(objectFound === false || objectFound === true){
                                Alert("Trade not found")
                            }else{
                                cache.Position.reset();
                                /**
                                 * @todo: send these information toward proxy server to load into Notion database.
                                 */
                                cache.Position.mostRecent ={
                                    entry: entry.id,
                                    exit: objectFound.id
                                }
                                SendOrder(entry); 
                                SendOrder(objectFound);
                                SendTrade({
                                    entry: cache.Position.mostRecent.entry,
                                    exit: cache.Position.mostRecent.exit,
                                    pattern: "Long",
                                    description: "_____Require filling in"
                                })
                            }
                            NavTo(CONFIG.MainWS);
                        },
                        {},
                        false
                    )
                )
        )
    }
}

