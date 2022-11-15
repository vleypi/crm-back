module.exports = parse = (result) =>{
    return Object.values(JSON.parse(JSON.stringify(result)));
}
