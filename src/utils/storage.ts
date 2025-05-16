import { Card, Deck } from '../types';

const STORAGE_KEYS = {
  DECKS: 'brainboost_decks',
  CARDS: 'brainboost_cards',
  REVIEW_SESSIONS: 'brainboost_sessions',
} as const;

// Helper to safely parse JSON with dates
const parseWithDates = (json: string) => {
  return JSON.parse(json, (key, value) => {
    const dateKeys = ['lastReviewed', 'nextReview', 'createdAt', 'updatedAt', 'startedAt'];
    if (dateKeys.includes(key) && value) {
      return new Date(value);
    }
    return value;
  });
};

// Decks
export const getDecks = (): Deck[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DECKS);
  return data ? parseWithDates(data) : [];
};

export const saveDeck = (deck: Deck): void => {
  const decks = getDecks();
  const index = decks.findIndex(d => d.id === deck.id);
  
  if (index >= 0) {
    decks[index] = { ...deck, updatedAt: new Date() };
  } else {
    decks.push({ ...deck, createdAt: new Date(), updatedAt: new Date() });
  }
  
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
};

export const deleteDeck = (deckId: string): void => {
  const decks = getDecks().filter(d => d.id !== deckId);
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  
  // Also delete all cards in this deck
  const cards = getCards().filter(c => c.deckId !== deckId);
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
};

// Cards
export const getCards = (): Card[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CARDS);
  return data ? parseWithDates(data) : [];
};

export const getCardsByDeck = (deckId: string): Card[] => {
  return getCards().filter(card => card.deckId === deckId);
};

export const getDueCards = (deckId: string): Card[] => {
  const now = new Date();
  return getCardsByDeck(deckId).filter(card => 
    !card.nextReview || card.nextReview <= now
  );
};

export const saveCard = (card: Card): void => {
  const cards = getCards();
  const index = cards.findIndex(c => c.id === card.id);
  
  if (index >= 0) {
    cards[index] = { ...card, updatedAt: new Date() };
  } else {
    cards.push({ ...card, createdAt: new Date(), updatedAt: new Date() });
  }
  
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  
  // Update card count in deck
  const deck = getDecks().find(d => d.id === card.deckId);
  if (deck) {
    const cardCount = getCardsByDeck(card.deckId).length;
    saveDeck({ ...deck, cardCount });
  }
};

export const deleteCard = (cardId: string): void => {
  const cards = getCards();
  const cardToDelete = cards.find(c => c.id === cardId);
  if (!cardToDelete) return;
  
  const filteredCards = cards.filter(c => c.id !== cardId);
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(filteredCards));
  
  // Update card count in deck
  const deck = getDecks().find(d => d.id === cardToDelete.deckId);
  if (deck) {
    const cardCount = getCardsByDeck(cardToDelete.deckId).length - 1;
    saveDeck({ ...deck, cardCount });
  }
}; 