const coll = document.getElementsByClassName("collapsible");
let i;
console.log(coll.length);
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        console.log('hm');
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
