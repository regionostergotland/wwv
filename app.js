const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.activity.write",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.body.read"
].join(" ");

let accessToken = "";

function convertTime(unix_timestamp) {
  const date = new Date(unix_timestamp);
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();
  return [
    date.getFullYear(),
    "-",
    (mm > 9 ? "" : "0") + mm,
    "/",
    (dd > 9 ? "" : "0") + dd,
    " - ",
    (hh > 9 ? "" : "0") + hh,
    ":",
    (mi > 9 ? "" : "0") + mi
  ].join("");
}

function addListItem(startTime, endTime, value, list) {
  
  const ele = document.createElement("li");
  ele.innerHTML = startTime + " - " + endTime + " - " + JSON.stringify(value);
  list.appendChild(ele);
  
}

function addEntry(data) {
    
    const list = document.createElement("ul");
    const header = document.createElement("h2");
    header.innerHTML = data.dataSourceId;
    document.body.appendChild(header);
  data.point.forEach(dataPoint => {
    addListItem(
        convertTime(Number(dataPoint.startTimeNanos) / Math.pow(10, 6)),
        convertTime(Number(dataPoint.endTimeNanos) / Math.pow(10, 6)),
        dataPoint.value,
        list
    );
  });
  document.body.appendChild(list);
}

function gapiAllStreams(res) {
  // UNIX start and end times.
  const weekInMs =  7 * 24 * 3600 * 1000;

  // convert to nanoSec and string the results
  const startTime = String( ( Date.now() - weekInMs ) * Math.pow(10, 6) )
  const endTime = String(Math.floor(Date.now() * Math.pow(10, 6)));
  const dataSetId = startTime + "-" + endTime;

  // Iterate the datasources, and log the result to the console
  res.dataSource.forEach(source => {
    if (source.dataStreamId.split(":")[0] === "raw"  || true) {
      const url =
        "https://www.googleapis.com/fitness/v1/users/me/dataSources/" +
        source.dataStreamId +
        "/datasets/" +
        dataSetId +
        "?access_token=" +
        accessToken;

        
      fetch(url)
        .then(response => response.json())
        .then(addEntry)
        .catch(err => console.log(err.message));
    }
  });
}
function gapiAuthorizationResponse(response) {
  if (response.error) {
    console.log(response.error, "err");
    return;
  }
  accessToken = response.access_token;
  fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataSources?access_token=" +
      accessToken
  )
    .then(res => res.json())
    .then(gapiAllStreams);
}

function autorizeGapi() {
  const params = {
    client_id: API_KEY,
    cookie_policy: "single_host_origin",
    fetch_basic_profile: true,
    ux_mode: "popup",
    include_granted_scopes: true,
    prompt: "",
    scope: SCOPES
  };

  gapi.auth2.authorize(params, gapiAuthorizationResponse);
}

window.onload = function() {
  if (!API_KEY) {
    alert("Add the api key to apikey.js");
    return;
  }

  autorizeGapi();
};
