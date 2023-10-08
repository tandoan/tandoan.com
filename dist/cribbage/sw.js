const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/cribbage/assets/cribbage_board.min.css",
            "/cribbage/assets/cribbage_board.min.js",
            "/cribbage/assets/css.nope",
            "/cribbage/assets/font-awesome.min.css",
            "/cribbage/assets/jquery-ui.css",
            "/cribbage/assets/jquery-ui.min.js",
            "/cribbage/assets/jquery.min.js",
            "/cribbage/assets/main.js",
            "/cribbage/assets/main.min.css",
            "/cribbage/assets/img/board-bkg-classic.png",
            "/cribbage/assets/img/board-bkg-clear.png",
            "/cribbage/assets/img/classic.jpg",
            "/cribbage/assets/img/peg_shadow.png",
            "/cribbage/assets/img/skunk.svg",
            "/cribbage/assets/img/stinkline.svg",

        ]),
    );
});
