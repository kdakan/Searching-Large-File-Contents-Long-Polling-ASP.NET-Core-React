function toJson(response) {
  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }
  return response.json();
}

// function toText(response) {
//   debugger;
//   if (!response.ok) {
//     throw new Error("HTTP error " + response.status);
//   }
//   return response.text();
// }

export function getServers() {
  return fetch("https://localhost:44344/api/servers").then(toJson);
}

function addListeners(xhr, loadendCallback, errorCallback) {
  xhr.addEventListener("loadend", loadendCallback);
  xhr.addEventListener("error", errorCallback);
  xhr.addEventListener("abort", errorCallback);
  xhr.addEventListener("timeout", errorCallback);
}

function runXHR(url, searchPath, dataCallback, loadendCallback, errorCallback) {
  var params = `path=${escape(searchPath)}`;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.LOADING && xhr.status === 200) {
      dataCallback(xhr.responseText);
    }
  };
  addListeners(xhr, loadendCallback, errorCallback);
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(params);
  return xhr;
}

export function search(
  server,
  searchPath,
  searchTerm,
  dataCallback,
  loadendCallback,
  errorCallback
) {
  let url = `https://${server}:44344/api/search/${searchTerm}`;
  runXHR(url, searchPath, dataCallback, loadendCallback, errorCallback);
}
