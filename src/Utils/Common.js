// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}
 
// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}
 
// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}
 
// set the token and user from the session storage
export const setUserSession = (token, user) => {
  sessionStorage.setItem('token', token);
  user.isAdmin = false;
  user.isModo = false;
  user.roles.map((role) => {
  	if (role == "ROLE_ADMIN") {
  		user.isAdmin = true;
  	} else if (role == "ROLE_MODERATOR") {
  		user.isModo = true;
  	}
  });
  sessionStorage.setItem('user', JSON.stringify(user));
}