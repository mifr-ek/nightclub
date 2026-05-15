// HAMBURGER MENU
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", function () {
  //Toggler open-class på begge hamburger- og nav links
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// Luk hamburger-menu når der klikkes på et link
navLinks.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

//BLOGPOST SIDE - HENT ENKELT POST FRA API //

//Læser post-id fra URL'en
//Hvis URL'en er blogpost.html?id=2, så giver dette mig "2"
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

//Finder container-elementerne
const blogpostContent = document.getElementById("blogpost-content");
const commentsTitle = document.getElementById("comments-title");
const commentsContainer = document.getElementById("comments-container");

//Funktion til at hente og vise kommentarer
//Den er en funktion så den kan kaldes både ved sideload og efter ny kommentar
function loadComments() {
  //Bruger det korrekte API endpoint med blogpostId som query parameter
  //t=${Date.now()} forhindrer browseren i at cache svaret
  fetch(`http://localhost:4000/comments?blogpostId=${postId}&t=${Date.now()}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (comments) {
      //Opdaterer kommentar-overskriften med antal kommentarer
      commentsTitle.textContent = `${comments.length} Comments`;

      //Rydder containeren
      commentsContainer.innerHTML = "";

      if (comments.length === 0) {
        commentsContainer.innerHTML =
          '<p class="loading-text">No comments yet. Be the first!</p>';
      } else {
        //Viser hver kommentar
        //API'et bruger "name" og "content" ikke "author" og "comment"
        comments.forEach(function (comment) {
          const commentEl = document.createElement("div");
          commentEl.classList.add("comment");
          commentEl.innerHTML = `
            <p class="comment-author">${comment.name}</p>
            <p class="comment-date">Posted: ${comment.date || "Unknown date"}</p>
            <p class="comment-text">${comment.content}</p>
          `;
          commentsContainer.appendChild(commentEl);
        });
      }
    })
    .catch(function (error) {
      console.error("Comments error:", error);
    });
}

//Hvis der ikke er et id i URL'en vises fejlbesked
if (!postId) {
  blogpostContent.innerHTML =
    '<p class="loading-text">No post found. Please go back to the blog.</p>';
} else {
  //Henter post fra API'et med det specifikke id
  fetch(`http://localhost:4000/blogposts/${postId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Bygger post-indholdet
      blogpostContent.innerHTML = `
        <img
          src="${data.asset.url}"
          alt="${data.title}"
          class="blogpost-image"
        >
        <h1 class="blogpost-title">${data.title}</h1>
        <p class="blogpost-meta">By: ${data.author}</p>
        <p class="blogpost-content">${data.content}</p>
      `;

      //Kalder loadComments funktionen for at vise kommentarer
      loadComments();
    })
    .catch(function (error) {
      blogpostContent.innerHTML =
        '<p class="loading-text">Could not load this post. Please try again later.</p>';
      console.error("Blogpost error:", error);
    });
}

// KOMMENTAR FORM - VALIDERING OG POST TIL API //
const commentForm = document.getElementById("comment-form");

commentForm.addEventListener("submit", function (event) {
  //Forhindrer siden i at genindlæse ved submit
  event.preventDefault();

  //Henter værdier fra formularen
  const name = document.getElementById("commenter-name").value.trim();
  const email = document.getElementById("commenter-email").value.trim();
  const comment = document.getElementById("commenter-text").value.trim();

  //Henter fejlbesked-elementerne
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const commentError = document.getElementById("comment-error");
  const formSuccess = document.getElementById("form-success");

  //Nulstiller alle fejlbeskeder
  nameError.classList.remove("visible");
  emailError.classList.remove("visible");
  commentError.classList.remove("visible");
  formSuccess.classList.remove("visible");

  //Validerer felterne
  let isValid = true;

  if (name === "") {
    nameError.classList.add("visible");
    isValid = false;
  }

  //Tjekker om email er gyldigt med regex
  //Dette sikrer at der er et @ og et punktum
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.classList.add("visible");
    isValid = false;
  }

  if (comment === "") {
    commentError.classList.add("visible");
    isValid = false;
  }

  //Hvis alle felter er rigtige, så send til API
  //API'et bruger /comments endpoint med blogpostId, name og content
  if (isValid) {
    fetch(`http://localhost:4000/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blogpostId: parseInt(postId),
        name: name,
        content: comment,
        date: new Date().toISOString(),
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        //Viser succesbesked
        formSuccess.classList.add("visible");
        //Nulstiller formularen
        commentForm.reset();
        //Genindlæser kommentarerne så den nye kommentar vises med det samme
        loadComments();
      })
      .catch(function (error) {
        console.error("Comment post error:", error);
      });
  }
});

// FOOTER RECENT POSTS - BLOGPOST SIDE //
const footerPostsContainerBlogpost = document.getElementById(
  "footer-recent-posts-blogpost",
);

fetch("http://localhost:4000/blogposts")
  .then(function (response) {
    return response.json();
  })
  .then(function (posts) {
    footerPostsContainerBlogpost.innerHTML = "";
    const recentThree = posts.slice(0, 3);
    recentThree.forEach(function (post) {
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
      footerPostsContainerBlogpost.appendChild(postEl);
    });
  })
  .catch(function (error) {
    footerPostsContainerBlogpost.innerHTML = "";
    console.error("Footer posts error:", error);
  });
