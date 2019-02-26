window.onload = function() {
    const SCOPES = [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.activity.write",
        "https://www.googleapis.com/auth/fitness.blood_pressure.read",
        "https://www.googleapis.com/auth/fitness.body.read"
      ].join(" ");
      
      
      let accessToken = "";
      
      function gapiAllStreams(res) {
        const endTime = String(Math.floor(Date.now() * Math.pow(10, 6)));
        const dataSetId = "0-"+endTime;

        res.dataSource.forEach(source => {
            if(source.dataStreamId.split(":")[0] === "raw") {
                const url = "https://www.googleapis.com/fitness/v1/users/me/dataSources/" + source.dataStreamId + "/datasets/" + dataSetId + "?access_token="+ accessToken;
                fetch(url).then(response => response.json())
                .then(json => console.log(json.dataSourceId, json.point))
                .catch(err => console.log(err.message))
            }
        })
      }
      
      
      function gapiAuthorizationResponse(response) {
        if (response.error) {
          console.log(response.error, "err");
          return;
        }
        accessToken = response.access_token;
        fetch("https://www.googleapis.com/fitness/v1/users/me/dataSources?access_token="+accessToken)
        .then(res => res.json())
        .then(gapiAllStreams);
        
      }
      
      function gapiLoaded() {
            const params = {
                client_id:              API_KEY,
                cookie_policy:          'single_host_origin',
                fetch_basic_profile:    true,
                ux_mode:                "popup",
                include_granted_scopes: true,
                prompt:                 '',
                scope:                  SCOPES,
          };
      
          gapi.auth2.authorize(params, gapiAuthorizationResponse);
      }

      gapiLoaded();
}





git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch apikey.js' --prune-empty --tag-name-filter cat -- --all