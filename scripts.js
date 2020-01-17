let app;

window.addEventListener('load', () => {
	app = new App();
});

class App {
	constructor() {
		// Populate with some default memes
		this.memes = {
			0: new MemeData( "https://media.giphy.com/media/AGGz7y0rCYxdS/giphy.gif" , " " , "destructure!" ) ,
			1: new MemeData( "https://media.giphy.com/media/iGAn18RZYjk7R8l0Oh/giphy.gif" , " " , "NOPE" ) ,
			2: new MemeData( "https://i.kym-cdn.com/entries/icons/original/000/013/564/doge.jpg" , "such spectacular" , "much special" )
		};


		// Form elements
		this.createMemeForm = document.querySelector('form.create-form');
		this.memePreview = this.createMemeForm.querySelector('.meme-preview');
		this.memePreviewPlaceholderCaption = this.memePreview.querySelector(".caption-placeholder");
		this.imageUrlInput = this.createMemeForm.querySelector('[name="imageUrl"]');
		this.topCaptionInput = this.createMemeForm.querySelector('[name="topCaption"]');
		this.bottomCaptionInput = this.createMemeForm.querySelector('[name="bottomCaption"]');

		// Memes
		this.memeListContainer = document.querySelector('.meme-list');

		// Get template and clear list
		this.memeTemplate = this.memeListContainer.querySelector('.meme-list-item').cloneNode(true)
		this.memeTemplate.classList.remove("hidden");
		this.memeListContainer.innerHTML = "";

		this.init();
	}

	init() {
		// Get next id and memes from local storage
		if (localStorage.nextMemeId)
			MemeData.nextId = parseInt(localStorage.nextMemeId);
		if (localStorage.memes)
			this.memes = JSON.parse(localStorage.memes);

		// Set focus on form
		this.imageUrlInput.focus();

		this.buildMemesList();
		this.addEvents();
		this.clearForm();
	}

	buildMemesList() {
		for (let id in this.memes) {
			this.addMemeToDOM(this.memes[id]);
		}
	}

	addEvents() {
		this.memeListContainer.addEventListener('click', (event) => this.memeListContainerClickHandler(event));
		this.createMemeForm.addEventListener('submit', (event) => this.createFormSubmitHandler(event));

		this.imageUrlInput.addEventListener('input', (event) => this.formChangeHandler(event));
		this.topCaptionInput.addEventListener('input', (event) => this.formChangeHandler(event));
		this.bottomCaptionInput.addEventListener('input', (event) => this.formChangeHandler(event));
	}

	formChangeHandler(event) {
		// Show/hide preview text
		if (this.topCaptionInput.value == "" && this.bottomCaptionInput.value == "") {
			this.memePreviewPlaceholderCaption.classList.remove('hidden');
		} else {
			this.memePreviewPlaceholderCaption.classList.add('hidden');
		}
		this.updateMemeElement(this.memePreview, this.imageUrlInput.value, this.topCaptionInput.value, this.bottomCaptionInput.value);
	}

	memeListContainerClickHandler(event) {
		const element = event.target;
		if (element.classList.contains('delete-button')) {
			console.log(element.parentNode);
			this.deleteMeme(element.parentNode.dataset.id);
		}
	}

	createFormSubmitHandler(event) {
		event.preventDefault();

		this.createMeme(this.imageUrlInput.value, this.topCaptionInput.value, this.bottomCaptionInput.value);
		this.clearForm();
	}

	createMeme(imageUrl, topCaption, bottomCaption) {
		const data = new MemeData(imageUrl, topCaption, bottomCaption);
		this.memes[data.id] = data;

		this.addMemeToDOM(data, true);
		this.updateLocalStorage();

		return data;
	}

	deleteMeme(id) {
		delete this.memes[id];

		// Remove from DOM
		const element = this.memeListContainer.querySelector(`[data-id='${id}']`);
		this.memeListContainer.removeChild(element);

		this.updateLocalStorage();
	}

	updateMemeElementWithData(element, data) {
		if (element == null || data == null)
			return;

		this.updateMemeElement(element, data.imageUrl, data.topCaption, data.bottomCaption);
	}

	updateMemeElement(element, imageUrl, topCaption, bottomCaption = "") {
		element.querySelector('.caption-top').innerText = topCaption;
		element.querySelector('.caption-bottom').innerText = bottomCaption;
		element.querySelector('.image').style.backgroundImage = `url('${imageUrl}')`;
	}

	addMemeToDOM(data) {
		// Make a clone of the template
		const listItem = this.memeTemplate.cloneNode(true);
		listItem.dataset.id = data.id;

		// Prepend to list
		this.memeListContainer.prepend(listItem);

		// Set content
		const element = listItem.querySelector('.meme');
		this.updateMemeElementWithData(element, data);
	}

	updateLocalStorage() {
		localStorage.nextMemeId = MemeData.nextId;
		localStorage.memes = JSON.stringify(this.memes);
	}

	clearForm() {
		// Reset focus to input
		this.createMemeForm.reset();
		// Clear preview
		this.updateMemeElement(this.memePreview, null , null , "I can haz preview?");
	}
}

class MemeData {
	constructor(imageUrl, topCaption, bottomCaption = "", id = null) {
		if (id != null)
			this.id = id;
		else
			this.id = MemeData.getNewId();

		this.imageUrl = imageUrl;
		this.topCaption = topCaption;
		this.bottomCaption = bottomCaption;
	}
}
MemeData.nextId = 0;
MemeData.getNewId = function () {
	const returnValue = MemeData.nextId;
	MemeData.nextId++;
	return returnValue;
}
