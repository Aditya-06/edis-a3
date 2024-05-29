// Middleware for Book store mobile app BFF service
const deleteFields = (body: Object): Object => {
  console.log('delete fields called');
  const modifiedBody = JSON.parse(JSON.stringify(body));
  delete modifiedBody.address;
  delete modifiedBody.address2;
  delete modifiedBody.city;
  delete modifiedBody.state;
  delete modifiedBody.zipcode;
  console.log(modifiedBody);
  return modifiedBody;
};

export default deleteFields;
