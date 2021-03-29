import { setUpRink } from "./js/rink.js";
import { setUpOptions } from "./js/options.js";
import { setUpShots } from "./js/shots/shot.js";
import { setUpTable } from "./js/table.js";
import { setUpDownloadUpload } from "./js/upload-download.js";
function index() {
    d3.xml("resources/hockey-rink.svg").then(data => {
        setUpRink(data);
        setUpOptions();
        setUpTable();
        setUpShots();
        setUpDownloadUpload();
        $(document).ready(function() {
            $("#shot-type").select2({ tags: true });
        });
    });
}

export { index };
