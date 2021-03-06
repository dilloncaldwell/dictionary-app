const wrapper = document.querySelector(".wrapper"),
	searchInput = wrapper.querySelector("input"),
	volume = wrapper.querySelector(".word i"),
	infoText = wrapper.querySelector(".info-text"),
	synonyms = wrapper.querySelector(".synonyms .list"),
	antonyms = wrapper.querySelector(".antonyms .list"),
	removeIcon = wrapper.querySelector(".search span");
let audio, origin;

function data(result, word) {
	if (result.title) {
		infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
	} else {
		wrapper.classList.add("active");
		let definitions = result[0].meanings[0].definitions[0],
			phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;

		document.querySelector(".word p").innerText = result[0].word;
		document.querySelector(".word span").innerText = phontetics;
		document.querySelector(".meaning span").innerText =
			definitions.definition;
		document.querySelector(".example span").innerText = definitions.example;
		audio = new Audio("https:" + result[0].phonetics[0].audio);

		origin = document.querySelector(".origin span").innerText =
			result[0].origin;
		if (origin === undefined) {
			document.querySelector(".origin").style.display = "none";
		}

		if (definitions.synonyms[0] == undefined) {
			synonyms.parentElement.style.display = "none";
		} else {
			synonyms.parentElement.style.display = "block";
			synonyms.innerHTML = "";

			for (let i = 0; i < 4; i++) {
				if (definitions.synonyms[i] == undefined) break;

				let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
				tag =
					i == 3
						? (tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[2]}</span>`)
						: tag;
				synonyms.insertAdjacentHTML("beforeend", tag);
			}
		}

		if (definitions.antonyms[0] == undefined) {
			antonyms.parentElement.style.display = "none";
		} else {
			antonyms.parentElement.style.display = "block";
			antonyms.innerHTML = "";
			for (let i = 0; i < 5; i++) {
				if (definitions.antonyms[i] == undefined) break;
				let tag = `<span onclick="search('${definitions.antonyms[i]}')">${definitions.antonyms[i]},</span>`;
				tag =
					i == 4
						? (tag = `<span onclick="search('${definitions.antonyms[i]}')">${definitions.antonyms[4]}</span>`)
						: tag;
				antonyms.insertAdjacentHTML("beforeend", tag);
			}
		}
	}
}
function search(word) {
	fetchApi(word);
	searchInput.value = word;
}

function fetchApi(word) {
	wrapper.classList.remove("active");
	infoText.style.color = "#000";
	infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
	// https://dictionaryapi.dev/ read docs for more info
	let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
	fetch(url)
		.then((response) => response.json())
		.then((result) => data(result, word))
		.catch(() => {
			infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
		});
}

searchInput.addEventListener("keyup", (e) => {
	let word = e.target.value.replace(/\s+/g, " ");
	if (e.key == "Enter" && word) {
		fetchApi(word);
	}
});

volume.addEventListener("click", () => {
	volume.style.color = "#4D59FB";
	audio.play();
	setTimeout(() => {
		volume.style.color = "#999";
	}, 800);
});

removeIcon.addEventListener("click", () => {
	searchInput.value = "";
	searchInput.focus();
	wrapper.classList.remove("active");
	infoText.style.color = "#9A9A9A";
	infoText.innerHTML =
		"Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
