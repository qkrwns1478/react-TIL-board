const shortenWords = (str, limit) => {
    let result = '';
    if (str.length > limit) {
        result = str.substr(0, limit) + '…';
    } else {
        result = str;
    }
    return result;
};

export default shortenWords;