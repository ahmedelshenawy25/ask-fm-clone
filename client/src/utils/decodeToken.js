function decodeToken(token) {
  try {
    let parsedToken = null;
    const payload = token.split('.')[1];

    if (payload) {
      parsedToken = JSON.parse(atob(payload));
    }

    return parsedToken;
  } catch (error) {
    return null;
  }
}

export default decodeToken;
