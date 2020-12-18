// Elliptic Curve Diffie Hellman

// Alice and Bob

// Want to share communication securely

// to communicate, they must share a secret

// then use that secret to encrypt traffic

// secret is used an an encryption key (e.g. 32-byte string)

// key exchange

// challenge is doing a secure key exchange

// to exchange a secret, Alice and Bob must have public/private keypairs

// Alice knows Bob's public key

// Bob knows Alice's public key

// Signal Protocol - every communication uses a different encryption key, 
// that cannot be derived from the previous encryption key

const { text } = require('body-parser')
var sodium = require('sodium-native')

// X25519 crypto algorithm for public/private key pairs
// Ed25519 algorithm (twisted Edwards curve)

// alice makes a public/private key pair
var aliceX25519PublicKey = sodium.sodium_malloc(sodium.crypto_box_PUBLICKEYBYTES)
var aliceX25519SecretKey = sodium.sodium_malloc(sodium.crypto_box_SECRETKEYBYTES)
sodium.sodium_memzero(aliceX25519PublicKey)
sodium.sodium_memzero(aliceX25519SecretKey)

//console.log(`alice's public key is ${sodium.crypto_box_PUBLICKEYBYTES}-bytes long`)
//console.log(`alice's secret key is ${sodium.crypto_box_SECRETKEYBYTES}-bytes long`)

sodium.crypto_box_keypair(aliceX25519PublicKey, aliceX25519SecretKey)

console.log(`Alice's public key is: ${aliceX25519PublicKey.toString('base64')}`)
console.log(`Alice's private key is: ${aliceX25519SecretKey.toString('base64')}`)

// bob makes a public/private key pair
var bobX25519PublicKey = sodium.sodium_malloc(sodium.crypto_box_PUBLICKEYBYTES)
var bobX25519SecretKey = sodium.sodium_malloc(sodium.crypto_box_SECRETKEYBYTES)
sodium.sodium_memzero(bobX25519PublicKey)
sodium.sodium_memzero(bobX25519SecretKey)

//console.log(`bob's public key is ${sodium.crypto_box_PUBLICKEYBYTES}-bytes long`)
//console.log(`bob's secret key is ${sodium.crypto_box_SECRETKEYBYTES}-bytes long`)

sodium.crypto_box_keypair(bobX25519PublicKey, bobX25519SecretKey)

console.log(`Bob's public key is: ${bobX25519PublicKey.toString('base64')}`)
console.log(`Bob's private key is: ${bobX25519SecretKey.toString('base64')}`)

// assume that Alice can access Bob's public key and vice versa
// Alice runs an ECDH using her private key, and Bob's public key
var aliceSharedSecret = sodium.sodium_malloc(sodium.crypto_scalarmult_BYTES)
//console.log(`shared secret size is ${sodium.crypto_scalarmult_BYTES}-bytes long`)
sodium.sodium_memzero(aliceSharedSecret)

sodium.crypto_scalarmult(aliceSharedSecret, aliceX25519SecretKey, bobX25519PublicKey)

console.log(`Alice's shared secret is ${aliceSharedSecret.toString('base64')}`)

// Bob runs an ECDH using his private key, and Alice's public key
var bobSharedSecret = sodium.sodium_malloc(sodium.crypto_scalarmult_BYTES)
sodium.sodium_memzero(bobSharedSecret)

sodium.crypto_scalarmult(bobSharedSecret, bobX25519SecretKey, aliceX25519PublicKey)

console.log(`Bob's shared secret is ${bobSharedSecret.toString('base64')}`)

// Ideally, both Alice and Bob will have access to the same secret




//*************************************************** */
// ENCRYPTING AND DECRYPTING USING THAT SHARED SECRET 
// to encrypt something with chachapoly 1305 or AES
// you need a secret
// and a nonce
// **if the nonce is repeated, the encrypted text is crackable**
// https://security.stackexchange.com/questions/136739/aes-use-same-nonce-security-risk


// we're going to encrypt a message from Alice to Bob
let textToEncrypt = "hello bob, how are you"
console.log("alice is encrypting: " + textToEncrypt)

// encryption key = aliceSharedSecret
// nonce = 1  -- it's the first message that Alice is sending Bob


// Alice will have to keep track of the nonces of her messages 
// so as never to repeat them
// we could also use a random nonce, as the nonce is included in the
// encrypted text, but as only 12 bytes are available, there is a chance of a 
// nonce collision if a lot of messages are sent, which would be a catastrophic 
// failure in this encryption mechanism

// let's set up the encrypted message
// the encrypted message will be the same length as the cleartext message
// although as the encrypted message can also include the nonce, 
// so it would be 12 bytes longer in total
var aliceEncryptedMessage = sodium.sodium_malloc(textToEncrypt.length)

// let's set up the nonce (we'll zero the memory location as well)
var aliceEncryptedMessageNonce = sodium.sodium_malloc(sodium.crypto_stream_chacha20_NONCEBYTES)
sodium.sodium_memzero(aliceEncryptedMessageNonce)

//we'll incremement the nonce from 0 to 1
sodium.sodium_increment(aliceEncryptedMessageNonce)

// now we'll encrypt the message
sodium.crypto_stream_chacha20_xor(aliceEncryptedMessage, Buffer.from(textToEncrypt), aliceEncryptedMessageNonce, aliceSharedSecret)


// and now we'll simulate bob decrypting the secret
// he'll use his shared secret, not Alice's!

// okay, let's have bob generate the nonce. he's expecting message 1 from alice
var bobEncryptedMessageNonce = sodium.sodium_malloc(sodium.crypto_stream_chacha20_NONCEBYTES)
sodium.sodium_memzero(bobEncryptedMessageNonce)
sodium.sodium_increment(bobEncryptedMessageNonce)

// allocate the memory for the decrypted message content
// it will be the same length as the encrypted message
var bobDecryptedMessage = sodium.sodium_malloc(aliceEncryptedMessage.length)


// the decryption is the same process as the encryption (like doing it twice)
// using the same key and nonce will encrypt cleartext or decrypt ciphertext
// bob's decryption key = bobSharedSecret
sodium.crypto_stream_chacha20_xor(bobDecryptedMessage, aliceEncryptedMessage, bobEncryptedMessageNonce, bobSharedSecret)

// and now let's make sure bob reads the original message!
console.log("bob decrypted the message to be: " + bobDecryptedMessage)






// elliptic curve public key 
// [G * very_large_number (VLN)] 
//(256-bit number)

// elliptic curve private key
// VLN

// Alice Public Key: G*VLNAlice
// Bob's Public Key: G*VLNBob

// Alice's Private Key: VLNAlice
// Bob's Private Key: VLNBob

// Alice Shared Secret: (G * VLNBob) * VLNAlice = ss
// Bob Shared Secret: (G * VLNAlice) * VLNBob = ss

// AlicePubKey: 3 * 54 (162)
// AlicePrivKey: 54

// BobPubKey: 3 * 17 (51)
// BobPrivKey: 17

// BobSharedSecret: (17 * 3) * 54 = 2754
// AliceSharedSecret: 54 * (3 * 17) = 2754

