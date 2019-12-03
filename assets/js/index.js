var numbers = "0123456789";
var lowercase = "abcdefghijklmnopqrstuvwxyz";
var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var special = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

/**
 * Swaps two elements of an array
 *
 * @param {array} array of elements to act on
 * @param {number} index of first element for swapping
 * @param {number} index of second element for swapping
 */

function swap(array,index_one,index_two) {
    if (index_one < array.length && index_two < array.length) {
        /* one line solution but looks like it may require more work under the hood unless the interpreter is clever
        https://medium.com/better-programming/how-swap-two-values-without-temporary-variables-using-javascript-8bb28f96b5f6
        
        array[index_one] = [ array[index_two], array[index_two] = array[index_one] ][0];
        */
        var temp = array[index_one];
        array[index_one] = array[index_two];
        array[index_two] = temp;
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
    var num_characters = 0;
    for (charClass of charClasses) {
        num_characters += charClass.length;
    }

    var index = Math.floor(Math.random() * num_characters);

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
    var password = [];
    var all_characters = "";
    
    /* must have enough characters to use at least one of each required character class */
    if (requiredPasswordLength < charClasses.length) {
        throw new Error("Invalid Argument: required password length is too short!"); 
    }

    while(password.length < requiredPasswordLength) {
        if (password.length < charClasses.length) {
            /* 
             * make sure each required character class gets at least a single instance 
             */
            var set_index = Math.floor(Math.random() * charClasses[password.length].length);
            password.push(charClasses[password.length][set_index]);
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
    for (var i = 0; i < password.length - 1; ++i) {
        j = Math.floor(Math.random() * (password.length-i)) + i;
        swap(password,i,j);
    }
    
    return password.join("");
}

document.getElementById("generate-btn").onclick = function generate() {
    var numChars;
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

    var charClasses = [];
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
    var passwordElement = document.getElementById("password-textarea");
    passwordElement.value = password;
    passwordElement.style.textAlign = "left"; 
    /* allow break at any character */
    passwordElement.style.wordBreak = "break-all";
}

document.getElementById("copy-btn").onclick = function copy() {
    /* https://www.w3schools.com/howto/howto_js_copy_clipboard.asp */
    var textAreaElement = document.getElementById("password-textarea");
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
