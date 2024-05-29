// Middleware for Book store mobile app BFF service
const replaceGenre = (body: Object): Object => {
  console.log('replacing genre');
  const modifiedBody = JSON.parse(JSON.stringify(body));
  if (modifiedBody.genre && typeof modifiedBody.genre === 'string') {
    modifiedBody.genre = Number(modifiedBody.genre.replace(/non-fiction/gi, 3));
  }

  return modifiedBody;
};

export default replaceGenre;
