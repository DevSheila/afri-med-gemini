function formatResponse(response) {
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i];
        } else {
            newResponse += "<br/><b>" + responseArray[i] + "</b>";
        }
    }
    let newResponse2 = newResponse.split("*").join("<br/>");

    let withImage = newResponse2.replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    return withImage;
}

async function removeSpecialCharacters(text) {
    var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    return text.replace(regex, '');
}

module.exports = {
    formatResponse,
    removeSpecialCharacters
};
