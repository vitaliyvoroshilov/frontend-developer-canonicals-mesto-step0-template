import '../pages/index.css';

import { initialCards } from './cards.js';

import avatarImage from '../images/avatar.jpg';
const avatar = document.querySelector('.profile__image');
avatar.style.backgroundImage = `url(${avatarImage})`;

import logoImage from '../images/logo.svg';
const logo = document.querySelector('.header__logo');
logo.src = logoImage;


// Toggle submit buttons in 2 forms

const profilePopup = document.querySelector('.popup_type_edit');
const profileForm = profilePopup.querySelector('.popup__form');
const profileInputs = Array.from(profileForm.querySelectorAll('.popup__input'));
const profileSubmitButton = profileForm.querySelector('.popup__button');

const cardPopup = document.querySelector('.popup_type_new-card');
const cardForm = cardPopup.querySelector('.popup__form');
const cardInputs = Array.from(cardForm.querySelectorAll('.popup__input'));
const cardSubmitButton = cardForm.querySelector('.popup__button');

function toggleSubmitButtons() {
    let profileValid = inputProfileTitle.validity.valid && inputProfileDescription.validity.valid;
    if (profileValid) {
        profileSubmitButton.classList.remove('popup__button_inactive');
        profileSubmitButton.disabled = false;
    } else {
        profileSubmitButton.classList.add('popup__button_inactive');
        profileSubmitButton.disabled = true;
    }
    let cardValid = inputCardName.validity.valid && inputCardUrl.validity.valid;
    if (cardValid) {
        cardSubmitButton.classList.remove('popup__button_inactive');
        cardSubmitButton.disabled = false;
    } else {
        cardSubmitButton.classList.add('popup__button_inactive');
        cardSubmitButton.disabled = true;
    }
}


// Forms validation

function showInputError(input) {
    input.classList.add('popup__input_error');
    let inputErrorMessage = document.querySelector(`.${input.id}-error-message`);
    inputErrorMessage.classList.add('popup__input_error-message_active');
    inputErrorMessage.textContent = input.validationMessage;
}

function hideInputError(input) {
    input.classList.remove('popup__input_error');
    let inputErrorMessage = document.querySelector(`.${input.id}-error-message`);
    inputErrorMessage.classList.remove('popup__input_error-message_active');
}

const inputs = Array.from(document.querySelectorAll('.popup__input'));
inputs.forEach(function(input) {
    input.addEventListener('input', function(e) {
        if (!e.target.validity.valid) {
            showInputError(e.target);
        } else {
            hideInputError(e.target);
        }
        toggleSubmitButtons();
    }); 
});

// Open popup

function openModal(popup) {      
    popup.classList.add('popup_is-opened');
}

// Close popup

function closeModal(popup) {      
    popup.classList.remove('popup_is-opened');
}

// Close popup by overlay click

function handleOverlayClick(e) {
    if (e.target.classList.contains('popup')) {
        closeModal(e.target);
    }
}

// Close popup by ESC

function handleEscClick(e) {
    if (e.key === 'Escape') {
        const currentPopup = document.querySelector('.popup_is-opened');
        if (currentPopup) {
            closeModal(currentPopup);
        }
    }
}
document.addEventListener('keydown', handleEscClick);


// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки

const placesList = document.querySelector('.places__list');
const imagePopup = document.querySelector('.popup_type_image');

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
    imagePopup.classList.add('popup_is-animated');
    const cardImage = card.querySelector('.card__image');
    cardImage.addEventListener('click', function() {
        let popupCaption = imagePopup.querySelector('.popup__caption');
        popupCaption.textContent = cardData.name;
        let popupImage = imagePopup.querySelector('.popup__image');
        popupImage.src = cardData.link;
        openModal(imagePopup);
    });
    let imageCloseButton = imagePopup.querySelector('.popup__close');
    imageCloseButton.addEventListener('click', function() {
        closeModal(imagePopup);
    });
    imagePopup.addEventListener('click', handleOverlayClick);

    return card;
}

// Вывести карточки на страницу

initialCards.forEach(function(card) {
    placesList.append(addCard(card));
});


// Profile popup

profilePopup.classList.add('popup_is-animated');
profilePopup.addEventListener('click', handleOverlayClick);

const profileTitle = document.querySelector('.profile__title');
const inputProfileTitle = profilePopup.querySelector('.popup__input_type_name');
const profileDescription = document.querySelector('.profile__description');
const inputProfileDescription = profilePopup.querySelector('.popup__input_type_description');
const profileEditButton = document.querySelector('.profile__edit-button');

profileEditButton.addEventListener('click', function() {
    inputProfileTitle.value = profileTitle.textContent;
    if (!inputProfileTitle.validity.valid) {
        showInputError(inputProfileTitle);
    } else {
        hideInputError(inputProfileTitle);
    }

    inputProfileDescription.value = profileDescription.textContent;
    if (!inputProfileDescription.validity.valid) {
        showInputError(inputProfileDescription);
    } else {
        hideInputError(inputProfileDescription);
    }

    toggleSubmitButtons();
    openModal(profilePopup);
});

const profilePopupClose = profilePopup.querySelector('.popup__close');
profilePopupClose.addEventListener('click', function() {
    closeModal(profilePopup);
});

function handleProfileFormSubmit(e) {
    e.preventDefault();
    profileTitle.textContent = inputProfileTitle.value;
    profileDescription.textContent = inputProfileDescription.value;
    closeModal(profilePopup);
}
profileForm.addEventListener('submit', handleProfileFormSubmit);


// Card popup

cardPopup.classList.add('popup_is-animated');
cardPopup.addEventListener('click', handleOverlayClick);

const inputCardName = document.querySelector('.popup__input_type_card-name');
const inputCardUrl = document.querySelector('.popup__input_type_url');
const cardAddButton = document.querySelector('.profile__add-button');
cardAddButton.addEventListener('click', function() {
    inputCardName.value = '';
    if (!inputCardName.validity.valid) {
        showInputError(inputCardName);
    } else {
        hideInputError(inputCardName);
    }

    inputCardUrl.value = '';
    if (!inputCardUrl.validity.valid) {
        showInputError(inputCardUrl);
    } else {
        hideInputError(inputCardUrl);
    }

    toggleSubmitButtons();
    openModal(cardPopup);
});

const cardPopupClose = cardPopup.querySelector('.popup__close');
cardPopupClose.addEventListener('click', function() {
    closeModal(cardPopup);
});

function handleCardFormSubmit(e) {
    e.preventDefault();
    let cardName = inputCardName.value;
    let cardUrl = inputCardUrl.value;
    let cardDta = {
        name: cardName,
        link: cardUrl
    }
    placesList.prepend(addCard(cardDta));
    closeModal(cardPopup);
}
cardForm.addEventListener('submit', handleCardFormSubmit);
