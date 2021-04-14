export function isIdentical(array1, array2){
    return (array1.length == array2.length) && array1.every(function(element, index) {
        return element === array2[index]; 
    });
}

export function chunk(collection, size) {
    var result = [];
  
    // default size to two item
    size = parseInt(size) || 2;
  
    // add each chunk to the result
    for (var x = 0; x < Math.ceil(collection.length / size); x++) {
      var start = x * size;
      var end = start + size;
  
      result.push(collection.slice(start, end));
    }
  
    return result;
}

export function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function removeArrayByIndex(array, idx){
    array.splice(idx, 1)
    return array
}

export function removeArrayByElement(array, el){
    for(let i = 0; i < array.length; i++){
        if(el === array[i]){
            array.splice(i, 1)
            break
        }
    }
    return array
}