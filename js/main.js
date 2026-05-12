//HERO-BAGGRUND//
// Random hero-baggrund på load //
const heroBackgrounds = [
  "../assets/bg/header_bg_1.jpg",
  "../assets/bg/header_bg_2.jpg",
];

// Math.random() giver et tilfældigt tal mellem 0 og 1
// Math.floor() runder det ned til et helt tal
// Ganger det med 2, så det giver enten 0 eller 1
const randomIndex = Math.floor(Math.random() * heroBackgrounds.length);

// Finder hero-baggrundsbillede-elementet og tilføjer det tilfældige billede
const heroBg = document.querySelector(".hero-bg");
heroBg.style.backgroundImage = `url('${heroBackgrounds[randomIndex]}')`;

//STICKY NAVBAR//
// Find navbaren og hero-elemterne via deres id
const navbar = document.getElementById("navbar");
const hero = document.getElementById("hero");

// Denne her funktion kører på scroll
window.addEventListener("scroll", function () {
  // Får højden på hero-sektionen i pixels
  const heroHeight = hero.offsetHeight;

  // Gør navbaren sticky på scroll hvis scroll er over height
  if (window.scrollY >= heroHeight) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// Fetch seneste blog-post fra API
const blogGrid = document.getElementById("recent-blog-grid");

// fetch() sender en request til API'en og venter på svar
fetch("http://localhost:4000/blogposts")
  // Når svaret ankommer, konverteres det til JSON
  .then(function (response) {
    return response.json();
  })

  // Når JSON er klar, bruges det til at bygge blog-cards
  .then(function (posts) {
    // Fjerner "Loading posts..." teksten
    blogGrid.innerHTML = "";

    // Vis kun de 3 seneste posts på forsiden
    // .slice(0, 3) tager de 3 første items fra array
    const recentPosts = posts.slice(0, 3);

    // Loop igennem hvert post og skaber et card
    recentPosts.forEach(function (post) {
      // Laver et nyt div for hvert card
      const card = document.createElement("div");
      card.classList.add("blog-card");

      // Nedskær indholdet til 150 karakterer til uddraget
      const excerpt = post.content.substring(0, 150) + "...";

      // Cards bliver bygget i HTML ved at bruge post data
      card.innerHTML = `
        <img src="${post.asset.url}" alt="${post.title}">
        <div class="blog-card-body">
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-meta">By ${post.author}</p>
          <p class="blog-card-excerpt">${excerpt}</p>
        </div>
      `;

      // Tilføjer card til griddet
      blogGrid.appendChild(card);
    });
  })

  // Hvis noget går galt, så vis error message
  .catch(function (error) {
    blogGrid.innerHTML =
      '<p class="loading-text">Could not load blog posts. Please try again later.</p>';
    console.error("API error:", error);
  });
