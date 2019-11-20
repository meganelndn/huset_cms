//when the page loads, call the init function
window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    //grab search=something from the url (it might not exist)
    const search = urlParams.get("search");
    //grab id=something from the url (it might not exist)
    const id = urlParams.get("id");
    const category = urlParams.get("category");

    if (search) { //if search has a value
        getSearchData();
    } else if (id) { //if id has a value
        getSinglePost(id);
    } else if (category) {
        //category stuff

        getCategoryData(category)
    } else { // if neither is true, get data for the frontpage
        getFrontpageData();
    }
    getNavigation()
}

function getNavigation() {
    fetch("http://georgianadancu.com/wordpress/wp-json/wp/v2/categories?per_page=100")
        .then(res => res.json())
        .then(data => {
            // console.log("get nav", data)
            data.forEach(addLink)
        })
}

function addLink(oneItem) {

    //document.querySelector("#links").innerHTML += oneItem.name
    if (oneItem.parent === 14 && oneItem.count > 0) {
        const link = document.createElement("a");
        link.textContent = oneItem.name;
        link.setAttribute("href", "categories.html?category=" + oneItem.id)
        link.setAttribute("class", "nav-link")
        document.querySelector("#links").appendChild(link);
    }
}

function getSearchData() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get("search");

    fetch("http://georgianadancu.com/wordpress/wp-json/wp/v2/art?_embed&search=" + search)
        .then(res => res.json())
        .then(handleData)
}

function getFrontpageData() {
    console.log("hello archive")
    fetch("http://georgianadancu.com/wordpress/wp-json/wp/v2/art?_embed")
        .then(res => res.json())
        .then(handleData)
}

function getCategoryData(catId) {
    console.log("category id:", catId)
    fetch("http://georgianadancu.com/wordpress/wp-json/wp/v2/art?_embed&categories=" + catId)
        .then(res => res.json())
        .then(handleData)
}

function getSinglePost(singlePostid) {
    console.log("single post:", singlePostid)
    //const urlParams = new URLSearchParams(window.location.search);
    //const id = urlParams.get("id");

    fetch("http://georgianadancu.com/wordpress/wp-json/wp/v2/art/" + singlePostid)
        .then(res => res.json())
        .then(showPost)
}

function handleData(myData) {
    myData.forEach(showPost)
}

function showPost(post) {
    console.log("displaying post: ",post)
    const copiesContainer = document.querySelector('#templateCopiesContainer');
    const myTemplate = document.querySelector('.podTemplate').content;
    let myCopy = myTemplate.cloneNode(true);
    // populate the elements within the clone here
    //console.log(myCopy);
    //get h1 for each post
    let h1 = myCopy.querySelector("h1");
    h1.textContent = post.title.rendered;
    let a = myCopy.querySelector(".event-link");
    a.setAttribute("href", "archive.html?id=" + post.id)
    // get p = content for each post
    let description = myCopy.querySelector(".description");
    description.innerHTML = post.content.rendered;

    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("id")) {
    // get the event date
    let eventDate = myCopy.querySelector(".event_date_container");
    eventDate.innerHTML = post.date;
    eventDate.classList.add("event_date");
    }

    copiesContainer.appendChild(myCopy);
}

