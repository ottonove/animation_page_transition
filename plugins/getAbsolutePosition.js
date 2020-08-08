export const getAbsolutePosition = (elm) => {
    const drawer = document.getElementById("v-drawer")
    const drawerWidth = drawer.style.transform.match(/-?\d+/)[0] === "0" ? drawer.clientWidth : 0

    const {left, top} = elm.getBoundingClientRect();
    const {left: bleft, top: btop} = document.body.getBoundingClientRect();
    
    let resultLeft = 0
    if(left - bleft - drawerWidth > 0){
        resultLeft = left - bleft - drawerWidth
    } else {
        resultLeft = left - bleft
    }

    const appbar = document.getElementById("v-appbar")

    return {
        left: resultLeft,
        top: top - btop - appbar.clientHeight
    }
}