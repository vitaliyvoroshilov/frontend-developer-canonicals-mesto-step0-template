// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки

const placesList = document.querySelector('.places__list');

function addCard(cardData) {
    const card = cardTemplate.querySelector('.card').cloneNode(true);
    card.querySelector('.card__title').textContent = cardData.name;
    card.querySelector('.card__image').src = cardData.link;

    // Like card
    const likeButton = card.querySelector('.card__like-button');
    likeButton.addEventListener('click', function() {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    // Delete card
    const deleteButton = card.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', function() {
        card.remove();
    });

    // Image popup
    const imagePopup = document.querySelector('.popup_type_image');
    imagePopup.classList.add('popup_is-animated');
    const cardImage = card.querySelector('.card__image');
    cardImage.addEventListener('click', function() {
        popupCaption = imagePopup.querySelector('.popup__caption');
        popupCaption.textContent = cardData.name;
        popupImage = imagePopup.querySelector('.popup__image');
        popupImage.src = cardData.link;
        openModal(imagePopup);
    });
    imageCloseButton = imagePopup.querySelector('.popup__close');
    imageCloseButton.addEventListener('click', function() {
        closeModal(imagePopup);
    });

    return card;
}

// Вывести карточки на страницу

for (let i = 0; i < initialCards.length; i++) {
    placesList.append(addCard(initialCards[i]));
}

// Popups

function openModal(popup) {      
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {      
    popup.classList.remove('popup_is-opened');
}


// Profile popup

const profilePopup = document.querySelector('.popup_type_edit');
profilePopup.classList.add('popup_is-animated');

const profileTitle = document.querySelector('.profile__title');
const profileTitleInput = profilePopup.querySelector('.popup__input_type_name');
const profileDescription = document.querySelector('.profile__description');
const inputProfileDescription = profilePopup.querySelector('.popup__input_type_description');
const profileEditButton = document.querySelector('.profile__edit-button');

profileEditButton.addEventListener('click', function() {
    profileTitleInput.value = profileTitle.textContent;
    inputProfileDescription.value = profileDescription.textContent;
    openModal(profilePopup);
});

const profilePopupClose = profilePopup.querySelector('.popup__close');
profilePopupClose.addEventListener('click', function() {
    closeModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = profileTitleInput.value;
    profileDescription.textContent = inputProfileDescription.value;
    closeModal(profilePopup);
}
const profileForm = profilePopup.querySelector('.popup__form');
profileForm.addEventListener('submit', handleProfileFormSubmit);


// Card popup

const cardPopup = document.querySelector('.popup_type_new-card');
cardPopup.classList.add('popup_is-animated');

const inputCardName = document.querySelector('.popup__input_type_card-name');
const inputCardUrl = document.querySelector('.popup__input_type_url');
const cardAddButton = document.querySelector('.profile__add-button');
cardAddButton.addEventListener('click', function() {
    inputCardName.value = '';
    inputCardUrl.value = '';
    openModal(cardPopup);
});

const cardPopupClose = cardPopup.querySelector('.popup__close');
cardPopupClose.addEventListener('click', function() {
    closeModal(cardPopup);
});

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    cardName = inputCardName.value;
    cardUrl = inputCardUrl.value;
    cardDta = {
        name: cardName,
        link: cardUrl
    }
    placesList.prepend(addCard(cardDta));
    closeModal(cardPopup);
}
const cardForm = cardPopup.querySelector('.popup__form');
cardForm.addEventListener('submit', handleCardFormSubmit);
