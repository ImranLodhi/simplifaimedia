lucide.createIcons();
const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 40){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("primary-navigation");

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
});
document.querySelectorAll("#primary-navigation a").forEach(link => {

    link.addEventListener("click", () => {

        navigation.classList.remove("active");

    });

});
