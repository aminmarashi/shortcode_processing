export const find = (array, fn) => {
    if (Array.prototype.find)
        return Array.prototype.find.call(array, fn);

    let i = 0;
    for (; i < array.length; i++)
        if (fn(array[i]))
            break;

    return array[i];
}
