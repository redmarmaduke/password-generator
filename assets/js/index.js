const numbers = "0123456789";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const special = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

const generateButton = document.getElementById("generate_btn");
const copyButton = document.getElementById("copy_btn");

/**
 * Swaps two elements of an array
 *
 * @param {array} array of elements to act on
 * @param {number} index of first element for swapping
 * @param {number} index of second element for swapping
 */

function swap(array,indexOne,indexTwo) {
    if (
        (indexOne >= 0 && indexOne < array.length) && 
        (indexTwo >= 0 && indexTwo < array.length)
     ) {
        /* one line solution but looks like it may require more work under the hood unless the interpreter is clever
        https://medium.com/better-programming/how-swap-two-values-without-temporary-variables-using-javascript-8bb28f96b5f6
        
        array[indexOne] = [ array[indexTwo], array[indexTwo] = array[indexOne] ][0];
        */
        const temp = array[indexOne];
        array[indexOne] = array[indexTwo];
        array[indexTwo] = temp;
    }
    else {
        throw new Error('Invalid index used in swap()');
    }
}

/**
 * Generates a random character from all character classes submitted
 *
 * @param {string[]} charClasses array of character class strings
 * @return {string} random character
 */
function getRandomCharacterFromAllSets(charClasses) {

    /* find number of all characters  */
    let numCharacters = 0;
    for (charClass of charClasses) {
        numCharacters += charClass.length;
    }

    let index = Math.floor(Math.random() * numCharacters);

    for (charClass of charClasses) {                
        if (index >= charClass.length) {
            /* adjust to find the actual index into the charClass */
            index -= charClass.length;
        }
        else {
            return charClass[index];
        }
    }
    return undefined;
}

/**
 * Generates a password
 *
 * Each class will contribute at least one character and all remaining
 * characters will be selected randomly from the complete set of all
 * character classes.
 *
 * @param {number} numChars number of characters in the password
 * @param {string[]} charClasses array of character class strings
 */
function generatePassword(requiredPasswordLength, charClasses) {
    const password = [];
    
    /* must have enough characters to use at least one of each required character class */
    if (requiredPasswordLength < charClasses.length) {
        throw new Error("Invalid Argument: required password length is too short!"); 
    }

    while(password.length < requiredPasswordLength) {
        if (password.length < charClasses.length) {
            /* 
             * make sure each required character class gets at least a single instance 
             */
            const setIndex = Math.floor(Math.random() * charClasses[password.length].length);
            password.push(charClasses[password.length][setIndex]);
        }
        else {
            /* 
             * Remaining characters should be selected with equal probability from
             * all characters available.
             */
            password.push(getRandomCharacterFromAllSets(charClasses));
        }
    }

    /* randomize array */
    for (let i = 0; i < password.length - 1; ++i) {
        j = Math.floor(Math.random() * (password.length-i)) + i;
        swap(password,i,j);
    }
    
    return password.join("");
}

generateButton.onclick = function generate() {
    let numChars = 0;
    do {
        numChars = parseInt(prompt("Enter length: ",8));
        if (numChars >= 8 && numChars <= 128) {
            break;
        }
        else {
            alert("Length must be between 8 and 128 characters!");
        }
    }
    while(true);

    const charClasses = [];
    do {
        if(confirm("Use number character class?")) {
            charClasses.push(numbers);
        }
        if(confirm("Use lower-case character class?")) {
            charClasses.push(lowercase);
        }
        if (confirm("Use upper-case character class?")) {
            charClasses.push(uppercase);
        }
        if (confirm("Use special character class?")) {
            charClasses.push(special);
        }
        if (charClasses.length != 0) {
            break;
        }
        else {
            alert("You must choose at least one class of characters for the password!");
        }
    } while(true);

    password = generatePassword(numChars, charClasses);

    /** document.getElementById("password").textAreaElement. */
    const passwordElement = document.getElementById("password_textarea");
    passwordElement.value = password;
    passwordElement.style.textAlign = "left"; 
    /* allow break at any character */
    passwordElement.style.wordBreak = "break-all";
    
    /* enable copy and paste */
    copyButton.classList.remove("button_disabled");
}

copyButton.onclick = function copy() {
    /* https://www.w3schools.com/howto/howto_js_copy_clipboard.asp */
    const textAreaElement = document.getElementById("password_textarea");
    /* select contents of the text field */
    textAreaElement.select();
    /* 
     * w3schools example claims that the selection range is required for 
     * correct behavior on mobile devices
     */
    textAreaElement.setSelectionRange(0,99999);
    /* perform the copy */
    document.execCommand("copy");
    textAreaElement.setSelectionRange(0,0);
}
