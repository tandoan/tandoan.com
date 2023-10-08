const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/assets/cribbage_board.min.css",
            "/assets/cribbage_board.min.js",
            "/assets/css.nope",
            "/assets/font-awesome.min.css",
            "/assets/jquery-ui.css",
            "/assets/jquery-ui.min.js",
            "/assets/jquery.min.js",
            "/assets/main.js",
            "/assets/main.min.css",
            "/assets/img/board-bkg-classic.png",
            "/assets/img/board-bkg-clear.png",
            "/assets/img/classic.jpg",
            "/assets/img/peg_shadow.png",
            "/assets/img/skunk.svg",
            "/assets/img/stinkline.svg",

        ]),
    );
});
