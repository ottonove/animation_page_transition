export const getAbsolutePosition = (elm,appberHeight) => {
    const drawer = document.getElementById("drawer")
    //console.log("drawer.clientWidth:",drawer.clientWidth)
    //console.log("drawer.offsetWidth:",drawer.offsetWidth)
    //console.log("drawer.style:",drawer.style.transform.match(/-?\d+/)[0])
    const drawerWidth = drawer.style.transform.match(/-?\d+/)[0] === "0" ? drawer.clientWidth : 0

    const {left, top} = elm.getBoundingClientRect();
    const {left: bleft, top: btop} = document.body.getBoundingClientRect();
    return {
        left: left - bleft - drawerWidth,
        top: top - btop - appberHeight // appbarのheightを引く,
    }
}