var upload = document.getElementById("imageUpload");
var preview = document.getElementById("preview");
var memoryDiv = document.getElementById("memory");
var memories = [
    "夏の日、友達と笑いながら歩いた。",
    "静かな場所で風を感じていた。",
    "新しい場所を見つけてワクワクしていた。",
    "夕日を眺めながらゆっくり過ごしていた。",
    "この瞬間がずっと続けばいいと思った。"
];
upload.addEventListener("change", function () {
    var _a;
    var file = (_a = upload.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        preview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        generateMemory();
    };
    reader.readAsDataURL(file);
});
function generateMemory() {
    var random = Math.floor(Math.random() * memories.length);
    memoryDiv.innerText = memories[random];
}
