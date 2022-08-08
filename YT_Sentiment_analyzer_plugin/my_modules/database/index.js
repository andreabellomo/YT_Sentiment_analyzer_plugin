const URL_LIST = [];
const RISULTATO = [];

const getUrl = () => {
    return URL_LIST;
};

const insertUrl = (data) => {
    URL_LIST.push(data);
};



const getRisultato = () => {
    return RISULTATO;
};

const insertRisultato = (data) => {
    RISULTATO.push(data);
};


module.exports = { getUrl, insertUrl, getRisultato, insertRisultato };