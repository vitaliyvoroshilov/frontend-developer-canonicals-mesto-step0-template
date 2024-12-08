import '../pages/index.css';

import { initialCards } from './cards.js';

//import avatarImage from '../images/avatar.jpg';
const profileAvatar = document.querySelector('.profile__image');
//profileAvatar.style.backgroundImage = `url(${avatarImage})`;

import logoImage from '../images/logo.svg';
const logo = document.querySelector('.header__logo');
logo.src = logoImage;


// Profile

const profilePopup = document.querySelector('.popup_type_edit');
const profileForm = profilePopup.querySelector('.popup__form');

const profileInputs = Array.from(profileForm.querySelectorAll('.popup__input'));
const inputProfileDescription = profilePopup.querySelector('.popup__input_type_description');
const inputProfileTitle = profilePopup.querySelector('.popup__input_type_name');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileSubmitButton = profileForm.querySelector('.popup__button');
const profileEditButton = document.querySelector('.profile__edit-button');

// Card

const placesList = document.querySelector('.places__list');

const cardPopup = document.querySelector('.popup_type_new-card');
const cardForm = cardPopup.querySelector('.popup__form');

const cardInputs = Array.from(cardForm.querySelectorAll('.popup__input'));
const inputCardName = document.querySelector('.popup__input_type_card-name');
const inputCardUrl = cardForm.querySelector('.popup__input_type_url');

const cardSubmitButton = cardForm.querySelector('.popup__button');
const cardAddButton = document.querySelector('.profile__add-button');

// Avatar

const avatarPopup = document.querySelector('.popup_type_new-avatar');
avatarPopup.addEventListener('click', handleOverlayClick);
const avatarImage = document.querySelector('.profile__image');
const avatarForm = avatarPopup.querySelector('.popup__form');
const inputAvatarUrl = avatarForm.querySelector('.popup__input_type_url');
const avatarSubmitButton = avatarForm.querySelector('.popup__button');

avatarImage.addEventListener('click', function() {
    inputAvatarUrl.value = '';
    if (!inputAvatarUrl.validity.valid) {
        showInputError(inputAvatarUrl);
    } else {
        hideInputError(inputAvatarUrl);
    }

    toggleSubmitButtons();
    openModal(avatarPopup);
});

const avatarPopupClose = avatarPopup.querySelector('.popup__close');
avatarPopupClose.addEventListener('click', function() {
    closeModal(avatarPopup);
});

avatarForm.addEventListener('submit', function handleAvatarFormSubmit(e) {
    e.preventDefault();

    const updatedAvatarUrl = inputAvatarUrl.value;

    updateAvatar(updatedAvatarUrl)
    .then((userData) => {
      avatarImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(`updateAvatar() error: ${err}`);
    })
});


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
    let avatarValid = inputAvatarUrl.validity.valid;
    if (avatarValid) {
        avatarSubmitButton.classList.remove('popup__button_inactive');
        avatarSubmitButton.disabled = false;
    } else {
        avatarSubmitButton.classList.add('popup__button_inactive');
        avatarSubmitButton.disabled = true;
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



const config = {
    baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
    headers: {
      authorization: '77b672f1-b332-40f2-b12e-fd3bf3caef3f',
      'Content-Type': 'application/json',
    },
};

function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
};



function getUser () {
    return fetch(`${config.baseUrl}/users/me`, { headers: config.headers })
        .then(checkResponse);
};

let currentUserId = null;

getUser()
.then(function(userData) {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    currentUserId = userData._id;
})
.catch(function(err) {
    console.error(`getUser() error: ${err}`);
});



function getInitialCards() {
    return fetch(`${config.baseUrl}/cards`, { headers: config.headers })
        .then(checkResponse);
};

getInitialCards()
.then(function(cards) {
    cards.forEach((cardData) => {
        placesList.append(addCard(cardData, currentUserId));
    });
})
.catch(function(err) {
    console.error(`getInitialCards() error: ${err}`);
});


function updateUser(userData) {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify(userData),
    }).then(checkResponse);
};


function addNewCard(cardData) {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(cardData),
    }).then(checkResponse);
};


function deleteCard(cardID) {
    return fetch(`${config.baseUrl}/cards/${cardID}`, {
        method: 'DELETE',
        headers: config.headers,
    }).then(checkResponse);
};


function likeCard(cardId) {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: config.headers,
    }).then(checkResponse);
  };
  

function unlikeCard(cardId) {
return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
}).then(checkResponse);
};


function updateAvatar(avatarUrl) {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    }).then(checkResponse);
};


function addCard(cardData, currentUserId) {
    const imagePopup = document.querySelector('.popup_type_image');

    const cardTemplate = document.querySelector('#card-template').content;
    const card = cardTemplate.querySelector('.card').cloneNode(true);

    const cardName = card.querySelector('.card__title');
    cardName.textContent = cardData.name;
    const cardImage = card.querySelector('.card__image');
    cardImage.src = cardData.link
    const cardLikeCount = card.querySelector('.card__like-count');
    cardLikeCount.textContent = cardData.likes.length;
    
    // Delete card
    const deleteButton = card.querySelector('.card__delete-button');
    if (cardData.owner._id !== currentUserId) {
        deleteButton.style.visibility = 'hidden';
    }
    deleteButton.addEventListener('click', function() {
        deleteCard(cardData._id)
        .then(function() {
            card.remove();
        })
        .catch(function(err) {
            console.error(`deleteCard() error: ${err}`);
        });
    });
    
    // Like card
    const likeButton = card.querySelector('.card__like-button');
    if (cardData.likes.some((user) => user._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
      }

    likeButton.addEventListener('click', () => {
        if (likeButton.classList.contains('card__like-button_is-active')) {
          unlikeCard(cardData._id)
          .then((updatedCard) => {
              likeButton.classList.remove('card__like-button_is-active');
              cardLikeCount.textContent = updatedCard.likes.length;
          })
          .catch((err) => {
              console.error('unlikeCard() error:', err);
          });
        } else {
          likeCard(cardData._id)
          .then((updatedCard) => {
              likeButton.classList.add('card__like-button_is-active');
              cardLikeCount.textContent = updatedCard.likes.length;
          })
          .catch((err) => {
              console.error('likeCard() error:', err);
          });
        }
    });
    
    // Image popup
    imagePopup.classList.add('popup_is-animated');
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
/*initialCards.forEach(function(card) {
    placesList.append(addCard(card));
});*/


// Profile popup

profilePopup.classList.add('popup_is-animated');
profilePopup.addEventListener('click', handleOverlayClick);

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

profileForm.addEventListener('submit', function handleProfileFormSubmit(e) {
    e.preventDefault();

    const updatedUserData = {
        name: inputProfileTitle.value,
        about: inputProfileDescription.value
    };

    updateUser(updatedUserData)
    .then(function(userData) {
        console.log(userData);
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closeModal(profilePopup);
    })
    .catch((err) => {
        console.error(`updateUser() error: ${err}`);
    })
});


// Card popup

cardPopup.classList.add('popup_is-animated');
cardPopup.addEventListener('click', handleOverlayClick);


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

cardForm.addEventListener('submit', function handleCardFormSubmit(e) {
    e.preventDefault();

    const newCardData = {
        name: inputCardName.value,
        link: inputCardUrl.value
    };
    addNewCard(newCardData)
    .then(function(cardData) {
        placesList.prepend(addCard(cardData, currentUserId));
        closeModal(cardPopup);
    })
    .catch((err) => {
        console.error(`addNewCard() error: ${err}`);
    })
});
