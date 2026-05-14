// HENT ALLE POSTS FRA API //

//Hvor mange posts der vises per side
const POSTS_PER_PAGE = 3;

//Hvilken side man er på nu - starter på side 1
let currentPage = 1;

//Gemmer alle posts når de er hentet
let allPosts = [];

//Finder container-elementerne
const postsContainer = document.getElementById("blog-posts-container");
const paginationContainer = document.getElementById("pagination");

//Henter alle blog posts fra API
fetch("http://localhost:4000/blogposts")
  //Konverterer svaret til JSON
  .then(function (response) {
    return response.json();
  })

  //Når JSON er klar, gemmes posts og bliver vist
  .then(function (posts) {
    //Gemmer alle posts i variablerne
    allPosts = posts;

    //Viser den første side
    showPage(1);

    //Bygger pagineringsknapperne
    buildPagination();
  })

  //Vis fejlbesked hvis noget går galt
  .catch(function (error) {
    postsContainer.innerHTML =
      '<p class="loading-text">Could not load blog posts. Please try again later.</p>';
    console.error("API error:", error);
  });

// VIS EN BESTEMT SIDE AF POSTS //
function showPage(pageNumber) {
  //Opdaterer hvilken side man er på
  currentPage = pageNumber;
  //Udregner hvilke posts der skal vises på denne side
  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const endIndex = pageNumber * POSTS_PER_PAGE;
  //.slice() tager kun de posts der hører til denne side
  const pagePosts = allPosts.slice(startIndex, endIndex);

  //Ryder containeren
  postsContainer.innerHTML = "";
  //Bygger et post-row for hvert post
  pagePosts.forEach(function (post) {
    // Laver et nyt div til rækken
    const row = document.createElement("div");
    row.classList.add("blog-post-row");

    //Nedskærer indholdet til 300 karakterer
    const excerpt = post.content.substring(0, 300) + "...";

    //Bygger HTML til rækken
    //Read More-linket sender brugeren til blogpost.html med post-id'ét som URL parameter
    row.innerHTML = `
    <img
    src="${post.asset.url}"
    alt="${post.title}"
    class="blog-post-image"
    >
    <div class="blog-post-body">
    <h2 class="blog-post-title">${post.title}</h2>
    <p class="blog-post-meta">By ${post.author}</p>
    <p class="blog-post-excerpt">${excerpt}</p>
    <a href="blogpost.html?id=${post.id}" class="blog-read-more">Read More</a>
    </div>
    `;
    //Tilføjer rækken til containeren
    postsContainer.appendChild(row);
  });

  //Opdaterer pagineringsknapperne så den rigtige er aktiv
  updatePagination();
}

// PAGINERINGSKNAPPER //
function buildPagination() {
  //Udregner hvor mnage sider der skal bruges i alt
  //Math.ceil() runder altid op
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  //Rydder pagination containeren
  paginationContainer.innerHTML = "";
  //Laver en knap for hver side
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("pagination-btn");
    btn.textContent = i;

    //Viser den side, når der klikkes på knappen
    btn.addEventListener("click", function () {
      showPage(i);
    });

    paginationContainer.appendChild(btn);
  }

  //Tilføjer "next"-knap
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("pagination-btn");
  nextBtn.textContent = "Next >";

  nextBtn.addEventListener("click", function () {
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    if (currentPage < totalPages) {
      showPage(currentPage + 1);
    }
  });

  paginationContainer.appendChild(nextBtn);
}

// OPDATER AKTIV PAGINERINGSKNAP //
function updatePagination() {
  //Finder alle pagineringsknapper
  const buttons = paginationContainer.querySelectorAll(".pagination-btn");
  //Går igennem alle knapper
  buttons.forEach(function (btn, index) {
    //Fjerner aktiv klasse fra alle knapper
    btn.classList.remove("active-page");
    //Tilføjer aktiv klasse til den knap der svarer til nuverænde side
    if (index === currentPage - 1) {
      btn.classList.add("active-page");
    }
  });
}

// FOOTER RECENT POST //
const footerPostsContainer = document.getElementById("footer-recent-posts");

fetch("http://localhost:4000/blogposts")
  .then(function (response) {
    return response.json();
  })
  .then(function (posts) {
    //Rydder loading-tekst
    footerPostsContainer.innerHTML = "";
    //Viser kun de 2 seneste posts
    const recentTwo = posts.slice(0, 2);
    recentTwo.forEach(function (post) {
      const postEl = document.createElement("div");
      postEl.classList.add("footer-post");

      postEl.innerHTML = `
            <img
          src="${post.asset.url}"
          alt="${post.title}"
          class="footer-post-img"
        >
        <div>
          <p class="footer-post-title">${post.content.substring(0, 60)}...</p>
          <span class="footer-post-date">April 17, 2018</span>
        </div>
        `;

      footerPostsContainer.appendChild(postEl);
    });
  })
  .catch(function (error) {
    footerPostsContainer.innerHTML = "";
    console.error("Footer posts error:", error);
  });
