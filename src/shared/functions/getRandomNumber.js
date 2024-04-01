const getRandomNumber = () => {
    const min = 10000;  
    const max = 99999;  
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = getRandomNumber