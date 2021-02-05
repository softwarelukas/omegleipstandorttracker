window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");
    
    const ip = fields[4];
    if (fields[7] === "srflx") {
      getLocation(ip);
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

const getLocation = async (ip) => {
  let url = `https://get.geojs.io/v1/ip/geo/${ip}.json`;

  await fetch(url).then((response) =>
    response.json().then((json) => {
      const output = `
          ---------------------
          Land: ${json.country}
          Stadt: ${json.city}
          Region: ${json.region}
          IP: ${json.ip}
          Anbieter: ${json.organization_name}
          Genauereinfos: ${json.organization}
          ---------------------
          `;

      console.log(output);
      
    })
  );
};
