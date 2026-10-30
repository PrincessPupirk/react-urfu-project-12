import leoProfanity from 'leo-profanity';

leoProfanity.loadDictionary('ru');
leoProfanity.loadDictionary('en');

export const filterProfanity = (text) => {
  if (typeof text !== 'string' || text.length === 0) {
    return text;
  }

  return leoProfanity.clean(text);
};

export default filterProfanity;
