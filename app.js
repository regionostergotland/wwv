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
    "/",
    (mm > 9 ? "" : "0") + mm,
    "/",
    (dd > 9 ? "" : "0") + dd,
    " ",
    (hh > 9 ? "" : "0") + hh,
    ":",
    (mi > 9 ? "" : "0") + mi
  ].join("");
}

function addListItem(startTime, endTime, value, table) {
  const tr = document.createElement("tr");
  const start = document.createElement("td");
  start.innerHTML = startTime;
  const end = document.createElement("td");
  end.innerHTML = endTime;
  const val = document.createElement("td");
  val.innerHTML = JSON.stringify(value);

  tr.appendChild(start);
  tr.appendChild(end);
  tr.appendChild(val);
  table.appendChild(tr);
}

function addEntry(data) {
  const container = document.createElement("div");

  const header = document.createElement("h2");
  const table = document.createElement("table");
  const h1 = document.createElement("th");
  h1.innerHTML = "Start Time";
  const h2 = document.createElement("th");
  h2.innerHTML = "End Time";
  const h3 = document.createElement("th");
  h3.innerHTML = "Value";
  const tr = document.createElement("tr");
  tr.appendChild(h1);
  tr.appendChild(h2);
  tr.appendChild(h3);
  table.appendChild(tr);

  header.innerHTML = data.dataSourceId;
  data.point.forEach(dataPoint => {
    addListItem(
      convertTime(Number(dataPoint.startTimeNanos) / Math.pow(10, 6)),
      convertTime(Number(dataPoint.endTimeNanos) / Math.pow(10, 6)),
      dataPoint.value,
      table
    );
  });
  container.appendChild(header);
  container.appendChild(table);

  container.classList.add("container");
  document.body.appendChild(container);
}

function gapiAllStreams(res) {
  // UNIX start and end times.
  const weekInMs = 7 * 24 * 3600 * 1000;

  // convert to nanoSec and string the results
  const startTime = String((Date.now() - weekInMs) * Math.pow(10, 6));
  const endTime = String(Math.floor(Date.now() * Math.pow(10, 6)));
  const dataSetId = startTime + "-" + endTime;

  // Iterate the datasources, and log the result to the console
  res.dataSource.forEach(source => {
    if (source.dataStreamId.split(":")[0] === "raw" || true) {
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
