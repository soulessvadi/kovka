exports.chunk = function (arr, groupsize) {
    var sets = [], chunks, i = 0;
    chunks = arr.length / groupsize;
    while(i < chunks) { sets[i] = arr.splice(0,groupsize); i++;}
    return sets;
};
