const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

const cardContainerEl = document.querySelector(".card-wrapper");

function renderCard(wordHeading, audioUrl, definition, example) {
  const container = document.createElement("div");
  container.className = "card-container";

  container.innerHTML = `
    <div class="word-div">
      <h3 class="word">${wordHeading}</h3>
      <div class="speaker-div" role="button" data-audio="${audioUrl}">
        <img
          class="speaker-icon"
          src="./assets/speaker-icon.png"
          alt="speaker"
        />
      </div>
    </div>
    <div class="info-div">
      <div class="definition-div">
        <p class="definition-heading">Definition:</p>
        <p class="definition-paragraph">
          ${definition}
        </p>
      </div>
      <div class="example-div">
        <p class="example-heading">${example ? "Example:" : ""}</p>
        <p class="example-paragraph">
          ${example ? example : ""}
        </p>
      </div>
    </div>
  `;

  const speakerDiv = container.querySelector(".speaker-div");
  speakerDiv.addEventListener("click", () => {
    const audioSrc = speakerDiv.getAttribute("data-audio");
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play();
    } else {
      console.log("No audio available.");
    }
  });

  cardContainerEl.insertAdjacentElement("afterbegin", container);
}

function renderError(msg) {
  cardContainerEl.textContent = msg;
  cardContainerEl.style.color = "red";
  cardContainerEl.style.fontFamily = "Inter, sans-serif";
}

async function getDefinition(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!res.ok) throw new Error("word not found");

    const data = await res.json();

    const wordHeading = data[0].word;
    const audioUrl = data[0]?.phonetics?.[0]?.audio || ""; // optional chaining for safety
    const definition =
      data[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
      "No definition found.";
    const example = data[0]?.meanings?.[0]?.definitions?.[0]?.example;

    renderCard(wordHeading, audioUrl, definition, example);
  } catch (err) {
    renderError(`${err.message}`);
  }
}

searchBtn.addEventListener("click", function () {
  cardContainerEl.innerHTML = "";
  const word = searchInput.value;
  getDefinition(word);
});

// Function to check input value
function checkInput() {
  const trimmedValue = searchInput.value.trim();
  searchBtn.disabled = trimmedValue === "";
}

searchInput.addEventListener("input", checkInput);
