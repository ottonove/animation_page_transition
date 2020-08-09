export const getAbsolutePosition = (elm) => {
    const drawer = document.getElementById("v-drawer")
    const drawerWidth = (drawer.style.transform.match(/-?\d+/)[0] === "0") && (document.getElementsByClassName("v-overlay--active").length === 0) ? drawer.clientWidth : 0
    // drawerのtransformが「translateX(0%)」、且つ、drawerのoverlayが無い、という場合(表示領域の横幅が十分広い場合)、drawerのwidth分をleftから引く。

    const {left, top} = elm.getBoundingClientRect();
    const {left: bleft, top: btop} = document.body.getBoundingClientRect();
    
    const appbar = document.getElementById("v-appbar")

    return {
        left: left - bleft - drawerWidth,
        top: top - btop - appbar.clientHeight
    }
}