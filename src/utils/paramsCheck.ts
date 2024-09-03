export const emailCheck = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(emailRegex)) {
    return email;
  } else {
    return false;
  }
};

export const passwordCheck = (password) => {
  const passRegex = /^[A-Za-z0-9]\w{7,}$/;

  if (password.match(passRegex)) {
    return password;
  } else {
    return false;
  }
};
