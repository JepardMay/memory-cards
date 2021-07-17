const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const currentEl = document.getElementById('current');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
const clearBtn = document.getElementById('clear');
const addContainer = document.getElementById('add-container');
const deleteBtn = document.getElementById('delete');
const shuffleBtn = document.getElementById('shuffle');
const notification = document.getElementById('notification');
const changeBtn = document.getElementById('change');
const toBeginBtn = document.getElementById('toBegin');
const toEndBtn = document.getElementById('toEnd');

// Kepp track of current card
let currentActiveCard = 0;

// Store DOM cards
let cardsEl = [];

// Store card data
let cardsData = getCardsData();

let isChange = false;

// const cardsData = [
// 	{
// 		question: 'What must a variable begin with?',
// 		answer: 'A letter, $ or _',
// 	},
// 	{
// 		question: 'What is a variable?',
// 		answer: 'Container for a piece of data',
// 	},
// 	{
// 		question: 'Example of Case Sensitive Variable',
// 		answer: 'thisIsAVariable',
// 	},
// ];

// Create all cards
function createCards() {
	cardsData.forEach((data, index) => createCard(data, index));
}

// Create a single card in DOM
function createCard(data, index) {
	const card = document.createElement('div');
	card.classList.add('card');

	if (index === 0) {
		card.classList.add('active');
	}

	card.innerHTML = `
    <div class="inner-card">
      <div class="inner-card-front">
        <p>${data.question}</p>
      </div>
      <div class="inner-card-back">
        <p>${data.answer}</p>
      </div>
    </div>
  `;

	card.addEventListener('click', () => {
		card.classList.toggle('show-answer');
	});

	// Add to DOM cards
	cardsEl.push(card);

	cardsContainer.appendChild(card);

	updateCurrentText();
}

// Show number of cards
function updateCurrentText() {
	currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

// Get cards from local storage
function getCardsData() {
	const cards = JSON.parse(localStorage.getItem('cards'));
	return cards === null ? [] : cards;
}

// Add card to local storage
function setCardsData(cards, reload) {
	localStorage.setItem('cards', JSON.stringify(cards));

	if (reload) {
		window.location.reload();
	}
}

// Shuffle array
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

// Show notification
function showNotification() {
	notification.classList.add('show');

	setTimeout(() => {
		notification.classList.remove('show');
	}, 2000);
}

// Check desability
function checkDisability() {
	if (currentActiveCard === 0) {
		toBeginBtn.disabled = 'disabled';
		prevBtn.disabled = 'disabled';
	} else {
		toBeginBtn.disabled = '';
		prevBtn.disabled = '';
	}

	if (currentActiveCard === cardsEl.length - 1) {
		toEndBtn.disabled = 'disabled';
		nextBtn.disabled = 'disabled';
	} else {
		toEndBtn.disabled = '';
		nextBtn.disabled = '';
	}
}

// Scroll
function scrollRight() {
	cardsEl[currentActiveCard].className = 'card left';
	if (isChange) cardsEl[currentActiveCard].classList.add('show-answer');

	currentActiveCard = currentActiveCard + 1;

	if (currentActiveCard > cardsEl.length - 1) {
		currentActiveCard = cardsEl.length - 1;
	}

	cardsEl[currentActiveCard].className = 'card active';
	if (isChange) cardsEl[currentActiveCard].classList.add('show-answer');

	checkDisability();
	updateCurrentText();
}

function scrollLeft() {
	cardsEl[currentActiveCard].className = 'card right';
	if (isChange) cardsEl[currentActiveCard].classList.add('show-answer');

	currentActiveCard = currentActiveCard - 1;

	if (currentActiveCard < 0) {
		currentActiveCard = 0;
	}

	cardsEl[currentActiveCard].className = 'card active';
	if (isChange) cardsEl[currentActiveCard].classList.add('show-answer');

	checkDisability();
	updateCurrentText();
}

createCards();

// Event listeners

// Next button
nextBtn.addEventListener('click', () => scrollRight());

// Prev button
prevBtn.addEventListener('click', () => scrollLeft());

// Scroll to end button
toBeginBtn.addEventListener('click', () => {
	while (currentActiveCard > 0) {
		scrollLeft();
	}
});

// Scroll to end button
toEndBtn.addEventListener('click', () => {
	while (currentActiveCard < cardsEl.length - 1) {
		scrollRight();
	}
});

// Delete current card
deleteBtn.addEventListener('click', () => {
	cardsData.splice(currentActiveCard, 1);
	setCardsData(cardsData);
});

// Shuffle cards
shuffleBtn.addEventListener('click', () => {
	if (shuffleBtn.classList.contains('active')) {
		cardsData = getCardsData();
	} else {
		shuffleBtn.classList.add('active');
		cardsData = shuffle(cardsData);
	}

	cardsContainer.innerHTML = '';
	cardsEl = [];
	currentActiveCard = 0;
	createCards();
});

// Change Question & Answer
changeBtn.addEventListener('click', () => {
	if (changeBtn.classList.contains('active')) {
		isChange = false;
		changeBtn.classList.remove('active');
		cardsContainer.querySelectorAll('.card').forEach(card => {
			card.classList.remove('show-answer');
		});
	} else {
		isChange = true;
		changeBtn.classList.add('active');
		cardsContainer.querySelectorAll('.card').forEach(card => {
			card.classList.add('show-answer');
		});
	}
});

// Show add container
showBtn.addEventListener('click', () => addContainer.classList.add('show'));

// Hide add container
hideBtn.addEventListener('click', () => addContainer.classList.remove('show'));

questionEl.addEventListener('focus', () => questionEl.classList.remove('error'));
answerEl.addEventListener('focus', () => answerEl.classList.remove('error'));

// Add new card
addCardBtn.addEventListener('click', () => {
	const question = questionEl.value;
	const answer = answerEl.value;

	if (question.trim() && answer.trim()) {
		const newCard = { question, answer };

		createCard(newCard);

		questionEl.value = '';
		answerEl.value = '';

		showNotification();

		cardsData.push(newCard);

		setCardsData(cardsData, false);
	} else {
		if (!question.trim()) {
			questionEl.classList.add('error');
		}
		if (!answer.trim()) {
			answerEl.classList.add('error');
		}
	}
});

// Clear cards button
clearBtn.addEventListener('click', () => {
	localStorage.clear();
	cardsContainer.innerHTML = '';
	window.location.reload();
});
