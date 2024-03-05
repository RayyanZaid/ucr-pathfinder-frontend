import removeFromAsyncStorage from "./removeFromAsyncStorage";
function signout() {
  removeFromAsyncStorage("uid");
}
