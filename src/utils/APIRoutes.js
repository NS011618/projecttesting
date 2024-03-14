const host = "http://localhost:5000";
/* User Dashboard routes */ 
export const registerRoute = `${host}/signup`;
export const loginRoute = `${host}/login`;
export const logoutRoute = `${host}/signout`;
/* Patient Dashboard routes */ 
export const inputRoute = `${host}/fetchinput`;
export const predictRoute = `${host}/predictdisease`;
export const getSymptomsRoute = `${host}/getsymptoms`;
export const gethistory = `${host}/getpastdata`;
export const predictAndSuggestRoute = `${host}/predictandsuggest`;
/* Admin Dashboard routes */ 
export const Admindash = `${host}/admindash`;