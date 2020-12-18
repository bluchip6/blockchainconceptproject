var sodium = require("sodium-native")


// set up a signing key pair
var alicePublicSigningKey = sodium.sodium_malloc(sodium.crypto_sign_PUBLICKEYBYTES)
var alicePrivateSigningKey = sodium.sodium_malloc(sodium.crypto_sign_SECRETKEYBYTES)

// zero the memory - just in case it's got junk in it
sodium.sodium_memzero(alicePublicSigningKey)
sodium.sodium_memzero(alicePrivateSigningKey)

// create the key pair 
sodium.crypto_sign_keypair(alicePublicSigningKey, alicePrivateSigningKey)

// log out the size of the keys
console.log(`alice public key is: ${alicePublicSigningKey.toString('base64')}`)
console.log(`alice private key is: ${alicePrivateSigningKey.toString('base64')}`)

// hash a message (using lib sodium) in order to sign it
var message = "Alice is not Satoshi Nakamoto"

// real message hash
var messageHash = sodium.sodium_malloc(sodium.crypto_hash_sha256_BYTES)
sodium.sodium_memzero(messageHash)

sodium.crypto_hash_sha256(messageHash, Buffer.from(message))

console.log(`message hash is: ${messageHash.toString('base64')}`)

// generate fake message hash - for negative testing
var fakeMessageHash = sodium.sodium_malloc(sodium.crypto_hash_sha256_BYTES)
sodium.sodium_memzero(fakeMessageHash)

sodium.crypto_hash_sha256(fakeMessageHash, Buffer.from("Alice is Satoshi Nakamoto"))

console.log(`fake message hash is: ${fakeMessageHash.toString('base64')}`)


// hashes are deterministic (same every time for input and algo)
// hashes are one-way (cannot unhash something)
// BUT you can get hash collisions
// where 2 different inputs generate the same output
// 10 ^80, birthday paradox reduces to 10^37


console.log(`message hash is: ${messageHash.toString('base64')}`)

// declare signature and malloc/zero memory
var aliceSignature = sodium.sodium_malloc(sodium.crypto_sign_BYTES)
sodium.sodium_memzero(aliceSignature)

//generate the signature
sodium.crypto_sign_detached(aliceSignature, messageHash, alicePrivateSigningKey)

console.log(`alice's signature is: ${aliceSignature.toString('base64')}`)
console.log(`alice's signature is ${sodium.crypto_sign_BYTES}-bytes long`)

// verify the signature
var signatureVerified = sodium.crypto_sign_verify_detached(aliceSignature, messageHash, alicePublicSigningKey)

console.log(`Alice's sigature has validated as: ${signatureVerified} `)

// verify using the fake message hash
var fakeSignatureVerified = sodium.crypto_sign_verify_detached(aliceSignature, fakeMessageHash, alicePublicSigningKey)

console.log(`Alice's fake sigature has validated as: ${fakeSignatureVerified} `)

