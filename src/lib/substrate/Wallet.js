import { Keyring } from '@polkadot/keyring'
const {
  mnemonicToMiniSecret,
  // mnemonicValidate,
  naclKeypairFromSeed
} = require('@polkadot/util-crypto');

class Wallet {
  constructor(mnemonic) {
    try {
      this.keyring = new Keyring()

      const pair = this.keyring.createFromUri(mnemonic)
      const seed = mnemonicToMiniSecret(mnemonic)
      const { publicKey, secretKey } = naclKeypairFromSeed(seed)

      this.mnemonic = mnemonic
      this.address = pair.address
      this.publicKey = publicKey
      this.privateKey = secretKey
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default Wallet
