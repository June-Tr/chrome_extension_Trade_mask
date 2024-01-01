class Button {
    constructor() {
        this.button = Get("_myButton", 0, false, cache.header.main);
        this.button.addEventListener("click", this.clickHandle);
        this.button.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(this.button.innerText);
        })
        /*   0: not enter
            -1: short
            +1: long        */
        this.state = 0; 
    }

    react() {
        this.state = 0;
        if(cache.Position.state)
            this.state = (cache.Position.direction == "Buy") ? 1: -1;

        this.change();
    }

    change() {
        
        this.button.classList.remove("but1", "but1_on", "but2_on");
        this.button.innerText = cache.Position.price;
        navigator.clipboard.writeText(cache.Position.price);
        switch (this.state){
            case 1:
                this.button.classList.add("but1_on");
                break;
            case -1 :
                this.button.classList.add("but2_on");
                break;
            default:
                this.button.classList.add("but1");
                break;          
        }
    }

    clickHandle = () => (cache.Position.state)
            ? this.ExistHandle()
            : this.EntryHandle();


    EntryHandle = () => 
        IsInOpenPosition(
            ExtractImportancePositionDetail,
            () => {
                alert("Button click:: Entry!! << No position found!");
            }    
        );
    

    ExistHandle = async () => {
        IsInOpenPosition(
            () => { alert("Button click:: Exit!! <<Still on an open position")},
            () => // only try attempt finding the end of position if not on any position
                NavTo( "History",
                    async () => ExtractPrice(
                        async (found, _) => {
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
                                alert("Trade not found")
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
                                    pattern: "--------------------------------------------",
                                    description: "Paste: Img here"
                                })
                                console.log("+++")
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

async function getClipboardContents() {
    try {
      const clipboardItems = await navigator.clipboard.read();
  
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          // we can now use blob here
        }
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }